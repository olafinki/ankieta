/**
 * Serwer ankiety startowej — Google Apps Script.
 *
 * Co robi:
 *   doPost  — przyjmuje wypełnioną ankietę i dopisuje ją do arkusza
 *   doGet   — oddaje wszystkie ankiety do panelu (po podaniu klucza)
 *
 * Instrukcja wdrożenia jest w README.md, w sekcji „Automatyczny obieg”.
 */

/** Wklej tu długi, losowy ciąg. Ten sam wpiszesz w panelu. */
const KLUCZ_ODCZYTU = 'zmien-mnie-na-dlugi-losowy-ciag';

const ARKUSZ_CZYTELNY = 'Odpowiedzi';
const ARKUSZ_DANE = 'Dane';

/* ---------- odbieranie ankiet ---------- */

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, blad: 'serwer-zajety' });
  }
  try {
    const wpis = JSON.parse(e.postData.contents);
    if (!wpis || !wpis.dane) return json({ ok: false, blad: 'zly-format' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const id = String(wpis.id || Utilities.getUuid());
    const odebrano = new Date();

    zapiszDane(ss, id, odebrano, wpis);
    zapiszCzytelne(ss, id, odebrano, wpis);

    return json({ ok: true, id: id });
  } catch (err) {
    return json({ ok: false, blad: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- wydawanie ankiet do panelu ---------- */

function doGet(e) {
  if (!e || !e.parameter || e.parameter.klucz !== KLUCZ_ODCZYTU) {
    return json({ ok: false, blad: 'zly-klucz' });
  }
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ARKUSZ_DANE);
  if (!sh || sh.getLastRow() < 2) return json({ ok: true, ankiety: [] });

  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  const ankiety = [];
  rows.forEach(function (r) {
    if (!r[2]) return;
    try {
      const d = JSON.parse(r[2]);
      d.id = String(r[0]);
      d.odebrano = r[1] ? new Date(r[1]).toISOString() : '';
      ankiety.push(d);
    } catch (err) { /* uszkodzony wiersz pomijamy */ }
  });
  return json({ ok: true, ankiety: ankiety });
}

/* ---------- zapis ---------- */

/** Arkusz techniczny: ID, data, całe zgłoszenie w JSON. Z niego czyta panel. */
function zapiszDane(ss, id, odebrano, wpis) {
  let sh = ss.getSheetByName(ARKUSZ_DANE);
  if (!sh) {
    sh = ss.insertSheet(ARKUSZ_DANE);
    sh.appendRow(['ID', 'Odebrano', 'JSON']);
    sh.setFrozenRows(1);
    sh.hideSheet();
  }
  const tresc = JSON.stringify(wpis);
  const wiersz = znajdzWiersz(sh, id);
  if (wiersz) {
    sh.getRange(wiersz, 1, 1, 3).setValues([[id, odebrano, tresc]]);
  } else {
    sh.appendRow([id, odebrano, tresc]);
  }
}

/** Arkusz do czytania: jedna kolumna na pytanie, jeden wiersz na osobę. */
function zapiszCzytelne(ss, id, odebrano, wpis) {
  let sh = ss.getSheetByName(ARKUSZ_CZYTELNY);
  if (!sh) {
    sh = ss.insertSheet(ARKUSZ_CZYTELNY, 0);
    sh.appendRow(['ID', 'Odebrano']);
    sh.setFrozenRows(1);
  }
  let naglowki = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 2)).getValues()[0];

  // dopisz kolumny dla pytań, których jeszcze nie ma
  const brakujace = [];
  Object.keys(wpis.dane).forEach(function (key) {
    const pytanie = wpis.dane[key].pytanie || key;
    if (naglowki.indexOf(pytanie) === -1 && brakujace.indexOf(pytanie) === -1) brakujace.push(pytanie);
  });
  if (brakujace.length) {
    sh.getRange(1, naglowki.length + 1, 1, brakujace.length).setValues([brakujace]);
    naglowki = naglowki.concat(brakujace);
  }

  const wiersz = new Array(naglowki.length).fill('');
  wiersz[0] = id;
  wiersz[1] = odebrano;
  Object.keys(wpis.dane).forEach(function (key) {
    const pole = wpis.dane[key];
    const i = naglowki.indexOf(pole.pytanie || key);
    if (i > -1) wiersz[i] = pole.odpowiedz || '';
  });

  const istniejacy = znajdzWiersz(sh, id);
  if (istniejacy) {
    sh.getRange(istniejacy, 1, 1, wiersz.length).setValues([wiersz]);
  } else {
    sh.getRange(sh.getLastRow() + 1, 1, 1, wiersz.length).setValues([wiersz]);
  }
}

function znajdzWiersz(sh, id) {
  if (sh.getLastRow() < 2) return 0;
  const kolumna = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < kolumna.length; i++) {
    if (String(kolumna[i][0]) === id) return i + 2;
  }
  return 0;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
