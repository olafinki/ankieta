# Ankieta startowa maturzysty

Ankieta, którą wysyłasz kursantowi przed ułożeniem planu nauki, oraz panel,
w którym oglądasz zebrane odpowiedzi.

| Plik | Do czego służy | Kto to otwiera |
|---|---|---|
| `ankieta.html` | 24 pytania o cel, czas, budżet i sposób uczenia się | kursant |
| `panel.html` | podgląd nadesłanych odpowiedzi + eksport do arkusza | Ty |

## Zanim wyślesz — dwie linijki do zmiany

W `ankieta.html`, na początku znacznika `<script>`:

```js
const FIRMA = "Twoja firma";
const KONTAKT_EMAIL = "kontakt@twojafirma.pl";
```

Nazwa firmy trafia do stopki, adres — na przycisk „Wyślij e-mailem”.

## Jak to działa

1. Wysyłasz kursantowi `ankieta.html` (załącznikiem albo linkiem, jeśli
   wrzucisz plik na swoją stronę). Działa też otwarta prosto z dysku,
   bez internetu i bez logowania.
2. Kursant odpowiada. Odpowiedzi zapisują się same w jego przeglądarce,
   więc może przerwać i wrócić — pasek u góry pokazuje postęp.
3. Na końcu klika **Pobierz plik z odpowiedziami** i odsyła Ci plik
   `ankieta-imie-przedmiot-data.json`. Alternatywnie: **Wyślij e-mailem**
   (otwiera pocztę z gotową treścią) albo **Kopiuj podsumowanie**.
4. Zebrane pliki przeciągasz do `panel.html`. Widzisz listę kursantów
   z celem procentowym i tygodniowym budżetem czasu na pierwszy rzut oka,
   a po kliknięciu — pełne odpowiedzi. **Pobierz arkusz (CSV)** zbiera
   wszystkich do jednej tabeli (Excel, Arkusze Google).

## O co pytamy

**01 Kim jesteś** — imię, kontakt, termin matury.

**02 Cel** — przedmiot, poziom, docelowy wynik procentowy, wynik obecny,
powód (kierunek studiów, próg rekrutacyjny, stypendium).

**03 Rytm nauki** — jedna długa sesja czy krótkie odcinki, godziny
tygodniowo, dni w tygodniu, pora dnia, kanał (wzrok, słuch, notatki,
zadania, tłumaczenie komuś), opis własnej najlepszej sesji nauki.

**04 Co przeszkadza** — czego brakuje (teoria, powtórka, technika zadań,
systematyczność), trudne działy, co wybija z rytmu.

**05 Warunki** — budżet na materiały, materiały posiadane, korepetycje,
data zakończenia nauki, forma kontroli postępów, praca samodzielna
czy z prowadzącym, uwagi dodatkowe.

Przy każdym pytaniu zamkniętym jest pozycja **„Inne — wpisz własną
odpowiedź”**, która odsłania pole tekstowe. Pytania oznaczone gwiazdką
są wymagane; próba pobrania pliku bez nich podświetla brakujące
i przewija do pierwszego z nich.

## Dopisanie albo zmiana pytania

Wszystkie pytania siedzą w tablicy `SURVEY` w `ankieta.html`. Jeden wpis:

```js
{ id:"pora_roku", type:"radio", required:false, chips:true, other:true,
  q:"O jakiej porze roku zaczynasz przygotowania?",
  hint:"Tekst pomocniczy pod pytaniem — opcjonalny.",
  options:["Wakacje","Wrzesień","Styczeń"] }
```

- `type` — `text`, `textarea`, `radio` (jedna odpowiedź) albo `check` (wiele),
- `other: true` — dokleja pozycję „Inne” z polem tekstowym,
- `chips: true` — układa krótkie odpowiedzi w rządek zamiast listy,
- `goal: true` — złoty akcent zamiast zielonego (użyty przy celu procentowym),
- `options` — napisy albo obiekty `{v:"Treść", note:"dopisek mniejszą czcionką"}`.

`id` trafia do pliku z odpowiedziami i do nagłówka CSV, więc po zmianie
nazwy starsze pliki pokażą to pytanie jako osobną kolumnę.

## Ochrona danych

Ankieta nic nigdzie nie wysyła — plik z odpowiedziami powstaje na
urządzeniu kursanta i to on decyduje, czy Ci go odeśle. Panel też czyta
pliki wyłącznie lokalnie. Pod podsumowaniem jest zgoda na wykorzystanie
odpowiedzi do przygotowania planu; bez jej zaznaczenia przycisk pobrania
nie zadziała.
