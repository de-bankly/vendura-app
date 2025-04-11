# Vendura App Build-Prozess

Dieses Dokument erläutert den Build-Prozess für die Vendura-Anwendung, einschließlich umgebungsspezifischer Konfigurationen, Optimierungstechniken und Bereitstellungsverfahren.

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Umgebungskonfiguration](#umgebungskonfiguration)
- [Build-Skripte](#build-skripte)
- [Optimierungstechniken](#optimierungstechniken)
- [Bereitstellung](#bereitstellung)
- [Service Worker und PWA-Unterstützung](#service-worker-und-pwa-unterstützung)
- [Fehlerbehebung](#fehlerbehebung)

## Überblick

Die Vendura-Anwendung verwendet Vite als Build-Tool mit mehreren benutzerdefinierten Skripten, um den Build-Prozess für verschiedene Umgebungen zu optimieren. Der Build-Prozess umfasst:

1. Laden umgebungsspezifischer Konfigurationen
2. Asset-Optimierung (JS, CSS, Bilder)
3. Bundle-Splitting und Code-Chunking
4. Komprimierung (Gzip und Brotli)
5. Service-Worker-Generierung für Offline-Unterstützung
6. Bundle-Größenanalyse und Berichterstattung

## Umgebungskonfiguration

Die Anwendung unterstützt drei Umgebungen:

- **Development**: Lokale Entwicklungsumgebung
- **Staging**: Vorproduktions-Testumgebung
- **Production**: Live-Produktionsumgebung

Umgebungsspezifische Variablen werden in `.env.{environment}`-Dateien gespeichert:

- `.env.development`
- `.env.staging`
- `.env.production`

Diese Dateien enthalten umgebungsspezifische Variablen, die während des Build-Prozesses geladen werden. Variablen mit dem Präfix `VITE_` werden dem clientseitigen Code zugänglich gemacht.

## Build-Skripte

Die folgenden Build-Skripte sind verfügbar:

| Skript | Beschreibung |
|--------|-------------|
| `npm run dev` | Startet den Entwicklungsserver |
| `npm run build` | Baut die Anwendung (standardmäßig für Produktion) |
| `npm run build:dev` | Baut für die Entwicklungsumgebung |
| `npm run build:staging` | Baut für die Staging-Umgebung |
| `npm run build:prod` | Baut für die Produktionsumgebung |
| `npm run build:optimize` | Baut für die Produktion und führt zusätzliche Optimierungen durch |
| `npm run analyze` | Baut mit aktivierter Bundle-Analyse |
| `npm run optimize` | Führt zusätzliche Optimierungen an einem bestehenden Build durch |
| `npm run bundle-report` | Generiert einen Bericht zur Bundle-Größe |

## Optimierungstechniken

Der Build-Prozess umfasst mehrere Optimierungstechniken:

### JavaScript-Optimierung

- **Tree Shaking**: Entfernt ungenutzten Code
- **Minifizierung**: Reduziert die Codegröße mit Terser
- **Code-Splitting**: Trennt Code in Chunks für besseres Caching
- **Vendor-Chunking**: Trennt Vendor-Code vom Anwendungscode

### Asset-Optimierung

- **Bildoptimierung**: Komprimiert Bilder mit dem ViteImageOptimizer-Plugin
- **CSS-Code-Splitting**: Extrahiert CSS in separate Dateien
- **Asset-Inlining**: Bettet kleine Assets (< 4KB) als Data-URLs ein

### Komprimierung

- **Gzip-Komprimierung**: Komprimiert Assets mit Gzip
- **Brotli-Komprimierung**: Komprimiert Assets mit Brotli (bessere Komprimierung, aber weniger Browser-Unterstützung)

## Bereitstellung

Die Anwendung enthält Skripte für die Bereitstellung in verschiedenen Umgebungen:

| Skript | Beschreibung |
|--------|-------------|
| `npm run deploy` | Stellt die Anwendung bereit (standardmäßig für Produktion) |
| `npm run deploy:dev` | Stellt in der Entwicklungsumgebung bereit |
| `npm run deploy:staging` | Stellt in der Staging-Umgebung bereit |
| `npm run deploy:prod` | Stellt in der Produktionsumgebung bereit |
| `npm run deploy:build:dev` | Baut und stellt in der Entwicklungsumgebung bereit |
| `npm run deploy:build:staging` | Baut und stellt in der Staging-Umgebung bereit |
| `npm run deploy:build:prod` | Baut und stellt in der Produktionsumgebung bereit |

Der Bereitstellungsprozess umfasst:

1. Bauen der Anwendung für die angegebene Umgebung (wenn das Flag `--build` angegeben ist)
2. Generieren der Laufzeitkonfiguration
3. Erstellen von Bereitstellungsinformationsdateien
4. Bereitstellen in der angegebenen Umgebung

## Service Worker und PWA-Unterstützung

Die Anwendung enthält Service-Worker-Unterstützung für Offline-Funktionalität und PWA-Funktionen:

- **Automatische Updates**: Der Service Worker aktualisiert sich automatisch, wenn eine neue Version verfügbar ist
- **Offline-Unterstützung**: Die Anwendung funktioniert offline mit zwischengespeicherten Assets
- **API-Caching**: API-Antworten werden für die Offline-Nutzung zwischengespeichert
- **Font-Caching**: Google Fonts werden für die Offline-Nutzung zwischengespeichert

Der Service Worker wird in `vite.config.js` mit dem VitePWA-Plugin konfiguriert.

## Fehlerbehebung

### Häufige Probleme

#### Build schlägt mit "Module Not Found"-Fehler fehl

Dies deutet in der Regel auf eine fehlende Abhängigkeit hin. Versuchen Sie:

```bash
npm install
```

#### Umgebungsvariablen funktionieren nicht

Stellen Sie sicher, dass die Umgebungsvariablen mit `VITE_` beginnen, um dem clientseitigen Code zugänglich gemacht zu werden.

#### Service Worker aktualisiert sich nicht

Der Service Worker verwendet eine Cache-First-Strategie. Um ein Update zu erzwingen, können Sie:

1. Alle Tabs der Anwendung schließen
2. Den Browser-Cache leeren
3. Die Anwendung erneut öffnen

#### Große Bundle-Größe

Wenn die Bundle-Größe zu groß ist, können Sie:

1. `npm run analyze` ausführen, um große Abhängigkeiten zu identifizieren
2. Lazy Loading für Komponenten oder Routen in Betracht ziehen
3. Ungenutzte Abhängigkeiten überprüfen und entfernen

Für eine detailliertere Fehlerbehebung überprüfen Sie die Build-Logs oder kontaktieren Sie das Entwicklungsteam. 