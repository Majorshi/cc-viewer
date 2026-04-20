# TeamDelete

Rozmontowuje obecnie aktywny zespół, usuwając jego katalog konfiguracji i współdzielony katalog zadań. Jest to odpowiednik czyszczący `TeamCreate`, zwykle wywoływany po osiągnięciu celu zespołu i wyłączeniu wszystkich współpracowników.

## Kiedy używać

- Zespół ukończył swoją pracę, a końcowy raport został dostarczony użytkownikowi.
- Zespół został utworzony przez pomyłkę lub jego zakres zmienił się tak drastycznie, że zaczynanie od nowa jest czystsze niż kontynuowanie.
- Musisz utworzyć nowy zespół, ale jeden jest już aktywny — najpierw usuń stary, ponieważ tylko jeden zespół może być prowadzony naraz.
- Zespół zestarzał się między sesjami, a jego trwały stan pod `~/.claude/teams/` nie jest już potrzebny.

NIE wywołuj, gdy współpracownicy nadal działają — najpierw ich wyłącz za pomocą `SendMessage` z `shutdown_request`, poczekaj na każdy `shutdown_response`, a potem usuń.

## Parametry

`TeamDelete` nie przyjmuje parametrów w typowym wywołaniu. Działa na obecnie aktywnym zespole należącym do wywołującej sesji.

## Przykłady

### Przykład 1: Rutynowe wyłączenie po sukcesie

1. Rozgłoś prośbę o wyłączenie do zespołu:
   ```
   SendMessage(to="*", message={ "type": "shutdown_request" })
   ```
2. Poczekaj, aż każdy współpracownik odpowie `shutdown_response`.
3. Wywołaj `TeamDelete()`, aby usunąć katalog zespołu i katalog zadań.

### Przykład 2: Zastąpienie błędnie skonfigurowanego zespołu

Jeśli `TeamCreate` został wywołany z niewłaściwym `agent_type` lub `description`, najpierw upewnij się, że żaden współpracownik nie został jeszcze utworzony (lub wyłącz ich), a następnie:

```
TeamDelete()
TeamCreate(team_name="...", description="...", agent_type="...")
```

## Uwagi

- `TeamDelete` zawodzi, jeśli jakiś współpracownik jest nadal aktywny. Odpowiedź błędu wymienia żyjących współpracowników — wyślij każdemu z nich `shutdown_request` przez `SendMessage`, zaczekaj na ich `shutdown_response` i spróbuj ponownie.
- Usunięcie jest nieodwracalne z perspektywy narzędzia. Konfiguracja zespołu w `~/.claude/teams/{team_name}/config.json` oraz jego katalog zadań są usuwane z dysku. Jeśli potrzebujesz zachować listę zadań, wyeksportuj lub skopiuj katalog przed usunięciem.
- Tylko sesja lidera, która utworzyła zespół, może go usunąć. Utworzony współpracownik nie może wywołać `TeamDelete` na swoim zespole.
- Usunięcie zespołu nie cofa żadnych zmian systemu plików, które współpracownicy wprowadzili w repozytorium. Są to zwykłe edycje śledzone przez git i muszą być cofnięte osobno, jeśli nie są pożądane.
- Po pomyślnym powrocie `TeamDelete` sesja może ponownie wywołać `TeamCreate` dla nowego zespołu.
