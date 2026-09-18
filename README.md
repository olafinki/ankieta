# Ankieta startowa maturzysty

Ankieta, którą wysyłasz kursantowi przed ułożeniem planu nauki, oraz panel,
w którym odpowiedzi pojawiają się same — jako osobna zakładka dla każdej osoby.

| Plik | Do czego służy | Kto to otwiera |
|---|---|---|
| `ankieta.html` | 23 pytania o cel, czas, budżet i sposób uczenia się | kursant |
| `panel.html` | zakładki z odpowiedziami, na żywo z arkusza, eksport CSV | Ty |
| `serwer.gs` | skrypt Google, który przyjmuje ankiety i wpisuje je do arkusza | wklejasz raz przy konfiguracji |

## Automatyczny obieg — konfiguracja raz, ok. 10 minut

Po tej konfiguracji kursant klika **Wyślij odpowiedzi**, a Ty widzisz go
w panelu w ciągu minuty. Nikt niczego nie odsyła mailem.

### 1. Arkusz i skrypt

1. Wejdź na [sheets.new](https://sheets.new) i nazwij arkusz, np. `Ankiety`.
2. W arkuszu: **Rozszerzenia → Apps Script**.
3. Skasuj przykładowy kod i wklej całą zawartość `serwer.gs`.
4. W pierwszej linii zamień `zmien-mnie-na-dlugi-losowy-ciag` na własny długi,
   losowy ciąg. To hasło do odczytu — zapamiętaj je, wpiszesz je w panelu.
5. Zapisz (ikona dyskietki).

### 2. Wdrożenie

1. **Wdróż → Nowe wdrożenie**, typ: **Aplikacja internetowa**.
2. *Wykonaj jako*: **Ja**. *Kto ma dostęp*: **Wszyscy**.
   Bez tego drugiego ustawienia kursanci nie wyślą ankiety.
3. **Wdróż**, zaakceptuj uprawnienia (Google pokaże ostrzeżenie o niezweryfikowanej
   aplikacji — to Twój własny skrypt, wybierz *Zaawansowane → Przejdź do…*).
4. Skopiuj adres kończący się na `/exec`.

> Po każdej późniejszej zmianie w skrypcie: **Wdróż → Zarządzaj wdrożeniami →
> ołówek → Wersja: Nowa → Wdróż**. Adres zostaje ten sam.

### 3. Ankieta

W `ankieta.html`, na początku znacznika `<script>`, uzupełnij trzy linijki:

```js
const FIRMA = "Twoja firma";
const KONTAKT_EMAIL = "kontakt@twojafirma.pl";
const ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
```

Zostawienie `ENDPOINT` pustego wraca do trybu awaryjnego: kursant pobiera
plik `.json` i odsyła go mailem.

### 4. Gdzie postawić ankietę

Plik musi być pod adresem `https://`, żeby mógł wysyłać dane. Najprościej
z tego repozytorium: **Settings → Pages → Source: Deploy from a branch**,
gałąź z tymi plikami, katalog `/ (root)`. Po chwili ankieta będzie pod
`https://olafinki.github.io/ankieta/ankieta.html` — i ten link wysyłasz kursantom.
Równie dobrze zadziała własna domena albo darmowy Netlify.

### 5. Panel

Otwórz `panel.html`, wklej adres `/exec` i swój klucz odczytu, kliknij **Połącz**.
Ustawienia zapisują się w tej przeglądarce, więc robisz to raz na komputerze.
Panel dopytuje arkusz co minutę; możesz też kliknąć **Odśwież**.

## Jak to wygląda w praktyce

**Kursant** dostaje link, odpowiada (postęp zapisuje się sam, może przerwać
i wrócić), klika **Wyślij odpowiedzi**. Jeśli wysyłka z jakiegoś powodu nie
przejdzie, ankieta sama pobiera mu plik i podaje Twój adres — żadna
odpowiedź się nie gubi. Może też wrócić i wysłać poprawki: nadpiszą jego
wiersz, nie utworzą drugiego.

**Ty** otwierasz panel. Po lewej lista kursantów, najnowsi u góry; zielona
kropka oznacza ankietę, której jeszcze nie otwierałeś. Po kliknięciu —
komplet odpowiedzi pogrupowany tak jak w ankiecie, z kontaktem i celem
procentowym na wierzchu. **Arkusz CSV** zbiera wszystkich do jednej tabeli.
Pliki `.json` odesłane mailem możesz dorzucić przyciskiem **Wczytaj pliki** —
trafią na tę samą listę.

W arkuszu Google powstają dwie karty: `Odpowiedzi` (czytelna tabela, jedna
kolumna na pytanie) i ukryta `Dane` (z niej czyta panel — nie kasuj jej).

## Intro

Ankieta otwiera się sceną 3D: na stronie notatnika ląduje prawdziwy tydzień
z gotowego planu — kartka po kartce, od poniedziałku do złotej kartki
„Maj · Matura”. Kartki opadają z góry z lekkim obrotem, cienie pod nimi
zbierają się w miarę lądowania, a potem scena spokojnie oddycha i reaguje
na ruch myszy. Chodzi o to, żeby pierwsze wrażenie brzmiało „to jest do
ogarnięcia”, a nie „czeka Cię harówka” — stąd kartka „Niedziela — wolne,
odpoczywasz”.

Scena nie ma własnej palety: czyta zmienne CSS formularza (`--paper`,
`--surface`, `--accent`, `--gold`…), więc kartki wyglądają dokładnie jak
odpowiedzi w ankiecie — białe z cienką ramką, zielone jak zaznaczone,
złota jak pytanie o cel. Zmiana barw na górze pliku przemalowuje też
intro, a przy motywie ciemnym scena przerysowuje się sama.

Napisane w czystym WebGL, bez żadnej biblioteki z zewnątrz — plik działa
otwarty prosto z dysku, bez internetu. Napisy na kartkach rysuje zwykłe
płótno 2D i trafiają na scenę jako tekstura, więc stoi na nich prawdziwy
plan, a nie ozdobne kreski. Bez WebGL zostaje samo tło i tekst; przy
włączonym ograniczeniu animacji scena rysuje jedną nieruchomą klatkę
po wylądowaniu kartek.

Treść kartek to tablica `KARTY` na początku drugiego znacznika `<script>`.
Jeden wpis to jedna kartka:

```js
{ e:"ŚRODA · 60 MIN", t:"Arkusz CKE, zadania 1–15", k:"#E8E6F2",
  x: 2.50, z: -2.20, o: 0.06, u: 0.02 }
```

`e` to etykieta, `t` tytuł, `k` kolor kartki, `x` i `z` miejsce na stronie,
`o` obrót, `u` wysokość unoszenia. Dodatkowe `typ:"pasek"` rysuje pasek
postępu, `typ:"cel"` złotą kartkę z ptaszkiem, `typ:"wolne"` dopisek pod
tytułem. Wymieniając teksty na swoje, pokazujesz klientowi własny plan —
to najskuteczniejsza część tej strony, więc warto ją dopasować do tego,
co naprawdę sprzedajesz.

## O co pytamy

**01 Kim jesteś** — imię, kontakt, termin matury.

**02 Cel** — przedmioty (można zaznaczyć kilka naraz), docelowy wynik
procentowy, wynik obecny, powód (kierunek studiów, próg rekrutacyjny,
stypendium).

Poziom nie jest osobnym pytaniem: po zaznaczeniu polskiego, matematyki
albo języka pod listą przedmiotów wysuwa się rząd z wyborem *Podstawa /
Rozszerzenie / Oba* — osobno dla każdego z nich. Pozostałe przedmioty
zdaje się wyłącznie na rozszerzeniu, więc przy nich nic się nie pokazuje.
Które przedmioty mają poziom, decyduje pole `poziomy` w pytaniu
`przedmiot` w tablicy `SURVEY`; dopisanie kolejnego języka to jedna
pozycja w `options` i jedna w `poziomy`.

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
są wymagane; próba wysyłki bez nich podświetla brakujące i przewija
do pierwszego z nich.

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

Nowe pytanie samo dopisze sobie kolumnę w arkuszu. Jeśli chcesz, żeby
trafiło do właściwej grupy w panelu, dopisz jego `id` do tablicy `GRUPY`
w `panel.html` — inaczej wyląduje w sekcji „Pozostałe pytania”.

## Ochrona danych

Odpowiedzi idą prosto z przeglądarki kursanta do Twojego arkusza Google —
po drodze nie ma żadnego pośrednika. Panel czyta ten sam arkusz
bezpośrednio; klucz odczytu trzymany jest wyłącznie w Twojej przeglądarce.
Nie publikuj `panel.html` pod publicznym adresem razem z kluczem — trzymaj
go na dysku. Pod podsumowaniem ankiety jest zgoda na wykorzystanie
odpowiedzi do przygotowania planu; bez jej zaznaczenia wysyłka nie ruszy.

Sam adres `/exec` jest publiczny (musi być, żeby ankieta mogła wysyłać),
ale bez klucza oddaje wyłącznie odpowiedź `zly-klucz` — odczytać ankiet
się z niego nie da.
