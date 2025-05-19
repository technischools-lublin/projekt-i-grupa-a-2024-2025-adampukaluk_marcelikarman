# Projekt 02.05.2025
##### I grupa, Klasa II A
### Paczkomat
* Adam Pukaluk
* Marceli Karman
---
# Instrukcja uruchomienia projektu Paczkomaty

## Wymagania wstępne
Przed rozpoczęciem upewnij się, że masz zainstalowane:
- Git
- Node.js i npm
- Python

## Krok 1: Klonowanie repozytorium

Otwórz terminal i wykonaj następujące polecenie, aby sklonować repozytorium:

```bash
git clone https://github.com/technischools-lublin/projekt-i-grupa-a-2024-2025-adampukaluk_marcelikarman.git
```

Po sklonowaniu zobaczysz nowy katalog z projektem.

## Krok 2: Uruchomienie części frontendowej

### Przejście do katalogu frontendu

```bash
cd projekt-i-grupa-a-2024-2025-adampukaluk_marcelikarman/paczkomaty_frontend
```

### Instalacja zależności

Zainstaluj wszystkie wymagane pakiety npm:

```bash
npm install
```

Proces instalacji może potrwać kilka minut, w zależności od szybkości połączenia internetowego.

### Uruchomienie serwera deweloperskiego

Po zakończeniu instalacji uruchom serwer deweloperski:

```bash
npm run dev
```

Po wykonaniu tego polecenia aplikacja frontendowa będzie dostępna pod adresem:
**http://localhost:3000**

## Krok 3: Uruchomienie części backendowej

### Otwórz nowy terminal

Pozostaw działający terminal z frontendem i otwórz nowy terminal.

### Przejście do katalogu backendu

```bash
cd projekt-i-grupa-a-2024-2025-adampukaluk_marcelikarman/paczkomaty_backend
```

### Uruchomienie serwera backendowego

```bash
python manage.py runserver
```

Po wykonaniu tego polecenia serwer backendowy zostanie uruchomiony, zazwyczaj na porcie 8000.

## Gotowe!

Teraz masz uruchomione oba komponenty aplikacji:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

Możesz zacząć korzystać z aplikacji Paczkomaty w trybie deweloperskim.

## Panel administratora

Panel admina jest dostępny pod adresem:
**http://localhost:8000/admin**

Aby uzyskać dostęp do panelu administracyjnego, musisz być zalogowany jako administrator.

## Rozwiązywanie problemów

Jeśli napotkasz problemy podczas uruchamiania:

1. **Problem z npm install:**
   - Upewnij się, że masz aktualną wersję Node.js
   - Spróbuj `npm cache clean --force` a następnie ponów instalację

2. **Problem z serwerem Django:**
   - Sprawdź, czy masz zainstalowane wszystkie wymagane pakiety Pythona
   - Możesz potrzebować wykonać `python manage.py migrate` przed uruchomieniem serwera

3. **Błędy połączenia frontend-backend:**
   - Sprawdź, czy oba serwery działają na odpowiednich portach
   - Sprawdź ustawienia CORS w pliku konfiguracyjnym backendu

## Zamykanie aplikacji

Aby zatrzymać działanie serwerów, użyj kombinacji klawiszy `Ctrl+C` w każdym z terminali.

