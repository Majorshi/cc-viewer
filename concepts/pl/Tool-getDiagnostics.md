# getDiagnostics

Pobiera diagnostykę serwera języka (błędy, ostrzeżenia, wskazówki) z podłączonego IDE dla konkretnego pliku lub dla każdego pliku, który IDE ma obecnie otwarty. Używane do weryfikowania, że zmiany kodu kompilują się czysto, przed ogłoszeniem zadania za zakończone.

## Kiedy używać

- Po `Edit` lub `Write`, aby potwierdzić, że zmiana nie wprowadziła błędu typu, błędu składni ani ostrzeżenia lintera.
- Przed zakończeniem zadania, aby przejść przez każdy otwarty plik w poszukiwaniu nierozwiązanych problemów.
- Gdy diagnozujesz błąd zgłoszony przez użytkownika — wyciągnięcie dokładnego komunikatu kompilatora lub type-checkera z IDE pozwala uniknąć zgadywania.
- Jako lekkiej alternatywy dla uruchomienia pełnej kompilacji lub polecenia testowego, gdy chcesz sprawdzić tylko statyczną poprawność.

NIE polegaj na `getDiagnostics` jako substytucie zestawu testów. Raportuje to, co widzi serwer języka, a nie to, co działa w czasie testów lub produkcji.

## Parametry

- `uri` (string, opcjonalny): URI pliku (zwykle `file:///absolute/path`), dla którego pobrać diagnostykę. Gdy pominięty, narzędzie zwraca diagnostykę dla każdego pliku obecnie otwartego w IDE.

## Przykłady

### Przykład 1: Sprawdź pojedynczy plik po edycji

```
getDiagnostics(
  uri="file:///Users/sky/project/src/auth.ts"
)
```

Zwraca wszelkie błędy TypeScript, ostrzeżenia ESLint lub inne komunikaty serwera języka dla `src/auth.ts`.

### Przykład 2: Przeszukaj wszystkie otwarte pliki

```
getDiagnostics()
```

Zwraca diagnostykę we wszystkich obecnie otwartych edytorach. Przydatne na końcu wieloplikowego refaktoringu, aby upewnić się, że nic nie zregresowało gdzie indziej.

## Uwagi

- `getDiagnostics` to narzędzie mostu IDE. Jest dostępne tylko wtedy, gdy Claude Code jest podłączony do wspierającej integracji IDE (na przykład rozszerzenia VS Code). W zwykłej sesji terminalowej narzędzie się nie pojawi.
- Wyniki odzwierciedlają dowolne serwery języków, które IDE załadowało — TypeScript, Pyright, ESLint, rust-analyzer itd. Jakość i pokrycie zależą od konfiguracji IDE użytkownika, a nie od Claude Code.
- Diagnostyka jest żywa. Po edycji daj serwerowi języka chwilę na ponowną analizę przed zinterpretowaniem pustego wyniku jako sukcesu — uruchom ponownie, jeśli plik został właśnie zapisany.
- Poziomy ważności zwykle obejmują `error`, `warning`, `information` oraz `hint`. Skoncentruj się najpierw na `error`; ostrzeżenia mogą być intencjonalnym stylem projektu.
- Dla plików obecnie nieotwartych w IDE serwer języka może nie mieć żadnej diagnostyki do zgłoszenia, nawet jeśli plik zawiera rzeczywiste problemy. Otwórz plik lub uruchom kompilację dla miarodajnego pokrycia.
