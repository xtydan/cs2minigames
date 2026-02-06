# 🎮 HLTV Players Database - Pipeline do 700 Graczy

## 📋 Co robi ten pipeline?

1. **Krok 1**: Pobiera statystyki ~700 graczy z HLTV (nick, ID, team, rating, K/D, etc.)
2. **Krok 2**: Pobiera historię drużyn dla każdego gracza
3. **Krok 3**: Łączy wszystko w finalną bazę `merged_players_700.json`

---

## 🚀 Jak uruchomić?

### Przygotowanie

1. Zainstaluj zależności:
```bash
npm install puppeteer-extra puppeteer-extra-plugin-stealth fs-extra
```

2. Upewnij się że masz plik `players2.json` (twoja obecna baza 210 graczy)

---

### Krok 1: Pobierz statystyki 700 graczy

```bash
node 1_get_players_stats.js
```

**Co robi:**
- Przechodzi przez strony `hltv.org/stats/players?offset=0, 50, 100...`
- Pobiera ~700 graczy (nick, ID, team, stats)
- Zapisuje do `players_stats_700.json`

**Czas:** ~15-20 minut (zależy od internetu i opóźnień)

---

### Krok 2: Pobierz historię drużyn dla nowych graczy

```bash
node 2_get_teams_history.js
```

**Co robi:**
- Wczytuje `players_stats_700.json` i `players2.json`
- Sprawdza których graczy jeszcze nie masz w bazie
- Dla nowych graczy (~490) pobiera historię drużyn z `hltv.org/player/ID/nick`
- Łączy ze starą bazą i zapisuje do `players_with_teams_700.json`

**Czas:** ~2-3 godziny (490 graczy × ~15 sekund/gracz)

**💡 Tip:** Skrypt zapisuje postęp na bieżąco, więc możesz go przerwać (Ctrl+C) i wznowić później - nie pobierze tych samych graczy dwa razy.

---

### Krok 3: Finalizacja bazy

```bash
node 3_finalize_database.js
```

**Co robi:**
- Waliduje bazę
- Pokazuje statystyki (ilość graczy, drużyn, krajów)
- Zapisuje finalną bazę do `merged_players_700.json`

**Czas:** ~2 sekundy

---

## 📁 Pliki wyjściowe

- `players_stats_700.json` - Surowe statystyki 700 graczy
- `players_with_teams_700.json` - Gracze + historia drużyn
- `merged_players_700.json` - **FINALNA BAZA** (gotowa do gry!)

---

## ⚙️ Konfiguracja

W skryptach możesz zmienić:

### `1_get_players_stats.js`
```javascript
const TARGET_PLAYERS = 700; // Zmień na 500, 1000, etc.
```

### Ścieżki do Chrome
Jeśli Chrome jest w innym miejscu, zmień w obu skryptach:
```javascript
userDataDir: "C:/twoja-sciezka/chrome-profile",
executablePath: "C:/twoja-sciezka/chrome.exe",
```

### Opóźnienia
Jeśli HLTV blokuje requesty, zwiększ opóźnienia:
```javascript
const shortDelay = ms => new Promise(r => setTimeout(r, ms || 5000 + Math.random() * 5000));
```

---

## 🎯 Użycie w grze

Po skończeniu pipeline'u:

1. Skopiuj `merged_players_700.json` do folderu z grą
2. Zmień nazwę na `merged_players.json` (albo zaktualizuj nazwę pliku w `game.js`)
3. Otwórz `index.html` w przeglądarce

**Gotowe!** Teraz masz 700 graczy w grze! 🎉

---

## 🛠️ Troubleshooting

**Problem:** "Cannot find module 'puppeteer-extra'"
- **Rozwiązanie:** `npm install puppeteer-extra puppeteer-extra-plugin-stealth fs-extra`

**Problem:** Chrome się nie otwiera
- **Rozwiązanie:** Sprawdź czy ścieżka do Chrome jest poprawna w skrypcie

**Problem:** HLTV blokuje requesty
- **Rozwiązanie:** Zwiększ opóźnienia między requestami (zmień `shortDelay`)

**Problem:** Skrypt przerwany w połowie
- **Rozwiązanie:** Po prostu uruchom ponownie - skrypt pominie już pobrane dane

---

## 📊 Przykładowy output

```
⏳ Pobieram graczy: offset=0, dotychczas=0
✅ Pobrano 50 graczy z tej strony (razem: 50)

⏳ Pobieram graczy: offset=50, dotychczas=50
✅ Pobrano 50 graczy z tej strony (razem: 100)

...

🎉 Osiągnięto cel: 700 graczy!
✅ Gotowe! Zapisano 700 graczy w players_stats_700.json
```

---

## 🤝 Kontakt

Jakieś pytania? Pisz! 🚀
