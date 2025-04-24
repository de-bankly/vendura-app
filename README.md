# Vendura App

Vendura ist eine moderne Point-of-Sale (POS) Webanwendung, entwickelt mit React 19 und Material UI 6. Diese Anwendung ermöglicht die Verwaltung von Inventar, Verkäufen, Gutscheinen und Pfandsystemen in einem benutzerfreundlichen Interface.

## 🚧 Entwicklungsstatus

⚠️ **HINWEIS: Dieses Projekt befindet sich in aktiver Entwicklung** ⚠️

Die Anwendung ist noch nicht für den produktiven Einsatz bereit.

## 🚀 Hauptfunktionen

- **Verkaufsabwicklung**: Schnelles und intuitives POS-Interface
- **Inventarverwaltung**: Verfolgung von Produkten, Beständen und Kategorien
- **Gutschein- und Pfandsystem**: Verwaltung von Gutscheinkarten und Pfandrückgaben
- **Benutzerverwaltung**: Rollenbasierte Zugriffssteuerung
- **Admin-Bereich**: Erweiterte Konfigurationsoptionen für Administratoren
- **PWA-Unterstützung**: Offline-Funktionalität durch Service Worker
- **Monitoring**: Integration mit Grafana Faro für Leistungsüberwachung

## 🛠️ Technologie-Stack

- **Frontend Framework**: React 19
- **UI-Bibliothek**: Material UI 6
- **Build-Tool**: Vite 6
- **Performance-Optimierung**: Million.js
- **Code-Qualität**: ESLint 9, Prettier
- **Routing**: React Router 7
- **Monitoring**: Grafana Faro SDK
- **Animation**: Framer Motion
- **Date Handling**: date-fns, dayjs

## 🚀 Schnellstart

```bash
# Repository klonen
git clone https://github.com/de-bankly/vendura-app.git

# In das Verzeichnis wechseln
cd vendura-app

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## 📦 Build & Deployment

Vendura unterstützt verschiedene Build- und Deployment-Konfigurationen:

```bash
# Standard-Build (Produktion)
npm run build

# Umgebungsspezifische Builds
npm run build:dev      # Entwicklung
npm run build:staging  # Staging
npm run build:prod     # Produktion

# Optimierter Produktions-Build
npm run build:optimize

# Umgebungsspezifisches Deployment
npm run deploy:dev     # Entwicklung
npm run deploy:staging # Staging
npm run deploy:prod    # Produktion
```

Für detaillierte Informationen zum Build-Prozess, siehe [BUILD.md](./BUILD.md).

## 📋 Projektstruktur

```
vendura-app/
├── public/          # Statische Assets
├── src/
│   ├── components/  # Wiederverwendbare UI-Komponenten
│   ├── contexts/    # React Context Provider
│   ├── pages/       # Seiten-Komponenten
│   ├── routes/      # Routing-Konfiguration
│   ├── services/    # API-Services
│   ├── style/       # Globale Styles und Theme
│   ├── utils/       # Hilfsfunktionen
│   ├── App.jsx      # Haupt-App-Komponente
│   └── main.jsx     # Einstiegspunkt
├── scripts/         # Build- und Deployment-Skripte
└── ...
```

## 🧪 Qualitätssicherung

```bash
# Linting
npm run lint

# Formatierung überprüfen
npm run format:check

# Formatierung anwenden
npm run format
```

## 📚 Dokumentation

Umfassende Dokumentation ist im [GitHub Wiki](https://github.com/de-bankly/vendura-app/wiki) verfügbar:

- [Projektübersicht und Vision](https://github.com/de-bankly/vendura-app/wiki/Projektübersicht)
- [Entwicklungsrichtlinien](https://github.com/de-bankly/vendura-app/wiki/Entwicklungsrichtlinien)
- [Workflow & Prozesse](https://github.com/de-bankly/vendura-app/wiki/Workflow-Prozesse)
- [Code-Review Checkliste](https://github.com/de-bankly/vendura-app/wiki/Code-Reviews)
- [Tooling](https://github.com/de-bankly/vendura-app/wiki/Tooling)
- [Installation & Setup](https://github.com/de-bankly/vendura-app/wiki/Installation-Setup)
- [Technischer Stack](https://github.com/de-bankly/vendura-app/wiki/Technischer-Stack)

## 🤝 Mitwirken

Wir freuen uns über Beiträge zum Vendura Projekt! Bitte lesen Sie vor dem Beitragen die [Workflow & Prozesse](https://github.com/de-bankly/vendura-app/wiki/Workflow-Prozesse) und [Entwicklungsrichtlinien](https://github.com/de-bankly/vendura-app/wiki/Entwicklungsrichtlinien) Wiki-Seiten.

### Entwicklungsstandards

- **Komponenten**: Funktionale Komponenten mit React Hooks
- **Namenskonventionen**: PascalCase für Komponenten, camelCase für Funktionen/Variablen
- **Code-Formatierung**: Prettier mit maximal 80 Zeichen Länge
- **Barrierefreiheit**: ARIA-Attribute und semantisches HTML

## 👥 Contributors

Wir danken allen, die zu diesem Projekt beigetragen haben:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/lulkebit">
        <img src="https://avatars.githubusercontent.com/u/64534456?v=4" width="100px;" alt="Luke"/>
        <br />
        <sub><b>Luke</b></sub>
      </a>
      <br />
      <sub>Hauptentwickler & Frontend-Architektur</sub>
    </td>
    <td align="center">
      <a href="https://github.com/antonbowe">
        <img src="https://avatars.githubusercontent.com/u/54149917?v=4" width="100px;" alt="Anton Bowe"/>
        <br />
        <sub><b>Anton Bowe</b></sub>
      </a>
      <br />
      <sub>CI/CD & Deployment-Konfiguration</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/soenkevogelsberg">
        <img src="https://github.com/soenkevogelsberg.png" width="100px;" alt="Sönke Vogelsberg"/>
        <br />
        <sub><b>Sönke Vogelsberg</b></sub>
      </a>
      <br />
      <sub>Projektunterstützung</sub>
    </td>
    <td align="center">
      <a href="https://github.com/SanguarY">
        <img src="https://github.com/SanguarY.png" width="100px;" alt="SanguarY"/>
        <br />
        <sub><b>SanguarY</b></sub>
      </a>
      <br />
      <sub>Projektunterstützung</sub>
    </td>
  </tr>
</table>

## 🔒 Sicherheit

Informationen zu Sicherheitsrichtlinien und zum Melden von Sicherheitslücken finden Sie in der [SECURITY.md](./SECURITY.md).

## 📝 Lizenz

Dieses Projekt steht unter der in [LICENSE](./LICENSE) angegebenen Lizenz.

## 📞 Kontakt

Bei Fragen oder Anregungen wenden Sie sich bitte an das Entwicklungsteam über GitHub Issues oder die im Wiki angegebenen Kontaktmöglichkeiten.

---

© 2025 de-bankly. Alle Rechte vorbehalten.
