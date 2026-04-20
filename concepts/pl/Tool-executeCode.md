# executeCode

Wykonuje fragment kodu wewnątrz żywego jądra lub sandboxa dostarczonego przez integrację IDE (na przykład jądro Jupyter powiązane z obecnie otwartym notatnikiem). Narzędzie jest dostępne tylko wtedy, gdy Claude Code działa obok kompatybilnego mostu IDE, takiego jak rozszerzenie VS Code z wybranym jądrem Jupyter.

## Kiedy używać

- Uruchamianie szybkich obliczeń, inspekcji danych lub wykresu względem stanu już załadowanego w aktywnym jądrze Jupyter.
- Walidowanie fragmentu kodu przed wklejeniem go do komórki notatnika.
- Eksplorowanie dataframe'a w pamięci, zmiennej lub modelu, który istnieje w jądrze, ale nie jest serializowany na dysk.
- Produkowanie wykresu lub wyniku liczbowego, który użytkownik chce mieć renderowany inline w IDE.

NIE używaj dla samodzielnych skryptów, którym lepiej odpowiadałby `Bash` uruchamiający `python script.py`, ani dla kodu, który musi trwać przez świeże jądro.

## Parametry

- `code` (string, wymagany): Kod do wykonania w bieżącym jądrze. Uruchamia się tak, jakby został wklejony do komórki notatnika — zdefiniowane zmienne utrzymują się w jądrze, aż zostanie zrestartowane.
- `language` (string, opcjonalny): Język fragmentu, gdy most IDE obsługuje wiele jąder. Najczęściej pomijany; domyślnie język aktywnego jądra (zwykle Python).

## Przykłady

### Przykład 1: Inspekcja dataframe'a w pamięci

```
executeCode(
  code="df.head()\nprint(df.shape)\nprint(df.dtypes)"
)
```

Zwraca pierwsze wiersze, kształt i typy kolumn dataframe'a już załadowanego w jądrze.

### Przykład 2: Szybkie sprawdzenie liczbowe

```
executeCode(
  code="import numpy as np\nnp.mean([1, 2, 3, 4, 5])"
)
```

Wykonuje jednorazowe obliczenie bez tworzenia komórki notatnika.

## Uwagi

- `executeCode` to narzędzie mostu IDE. Jest niedostępne w zwykłych sesjach terminalowych Claude Code; pojawia się tylko, gdy sesja jest podłączona do IDE udostępniającego jądro (na przykład rozszerzenia Jupyter w VS Code).
- Stan utrzymuje się w jądrze. Zmienne zdefiniowane jednym wywołaniem `executeCode` pozostają widoczne dla późniejszych wywołań, komórek notatnika i użytkownika — uważaj na efekty uboczne.
- Długo działający lub blokujący kod zablokuje jądro. Utrzymuj fragmenty krótkie; dla wielominutowej pracy napisz właściwy skrypt i uruchom go przez `Bash`.
- Wyjście (stdout, wartości zwracane, obrazy) jest zwracane do sesji. Bardzo duże wyjścia mogą być obcinane przez most IDE.
- Do edycji plików preferuj `Edit`, `Write` lub `NotebookEdit` — `executeCode` nie jest substytutem autoringu plików źródłowych.
