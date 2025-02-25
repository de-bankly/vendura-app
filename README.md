# BankLy X

## Übersicht

**BankLy X** ist eine moderne Web-Anwendung, die mit React und Material UI entwickelt wird. Dieses Projekt befindet sich derzeit in der **frühen Entwicklungsphase**.

## Entwicklungsstatus

⚠️ **HINWEIS: Dieses Projekt befindet sich noch in aktiver Entwicklung** ⚠️

Die Anwendung ist noch nicht für den produktiven Einsatz bereit. Weitere Informationen zur Funktionalität, Installation und Verwendung werden in Kürze folgen.

## Technologie-Stack

- React 19
- Material UI 6
- Vite 6
- ESLint 9
- Million.js

## Erste Schritte

Um das Projekt lokal zu starten:

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Beitragen zum Projekt

Wir freuen uns über Beiträge zum BankLy X Projekt! Bitte beachten Sie die folgenden Richtlinien, um einen reibungslosen Entwicklungsprozess zu gewährleisten.

### Branch-Struktur

- **main**: Produktions-Branch. Nur Luke darf Änderungen von `dev` nach `main` übertragen.
- **dev**: Entwicklungs-Branch. Alle Entwicklungsarbeiten werden hier zusammengeführt.

### Workflow für Beitragende

1. **Feature-Branches erstellen**:
   - Erstellen Sie für jede neue Funktion einen eigenen Branch basierend auf dem `dev` Branch
   - Benennen Sie den Branch nach dem Format: `feature/JIRA-XXX` (wobei XXX die Nummer des JIRA-Tasks ist)
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/JIRA-123
   ```

2. **Änderungen vornehmen**:
   - Implementieren Sie Ihre Änderungen im Feature-Branch
   - Committen Sie regelmäßig mit aussagekräftigen Commit-Nachrichten

3. **Pull Request erstellen**:
   - Wenn Ihre Funktion fertig ist, erstellen Sie einen Pull Request zum `dev` Branch
   - Beschreiben Sie die Änderungen und referenzieren Sie den JIRA-Task in der PR-Beschreibung

4. **Code Review**:
   - Warten Sie auf das Code Review durch andere Teammitglieder
   - Nehmen Sie bei Bedarf Änderungen vor

5. **Zusammenführen**:
   - Nach der Genehmigung wird Ihr Feature-Branch in den `dev` Branch zusammengeführt
   - Der Produktions-Release (Zusammenführung von `dev` nach `main`) wird ausschließlich von Luke durchgeführt

### Best Practices

- Halten Sie Ihre Feature-Branches aktuell, indem Sie regelmäßig Änderungen aus dem `dev` Branch integrieren
- Dokumentieren Sie Ihren Code angemessen
- Befolgen Sie die Coding-Standards des Projekts

### Code-Richtlinien

Um die Codequalität und -konsistenz im gesamten Projekt zu gewährleisten, bitten wir alle Mitwirkenden, die folgenden Richtlinien zu befolgen:

#### Allgemeine Richtlinien

- **Sprache**: Alle Variablen-, Funktions- und Komponentennamen sollten auf Englisch sein
- **Formatierung**: Verwenden Sie die im Projekt konfigurierten ESLint- und Prettier-Regeln
- **Kommentare**: Kommentieren Sie komplexe Logik, aber vermeiden Sie unnötige Kommentare für selbsterklärenden Code

#### Namenskonventionen

- **Komponenten**: PascalCase (z.B. `TransactionList.jsx`)
- **Funktionen**: camelCase (z.B. `calculateInterest`)
- **Variablen**: camelCase (z.B. `userAccount`)
- **Konstanten**: UPPER_SNAKE_CASE (z.B. `MAX_RETRY_COUNT`)
- **CSS-Klassen**: kebab-case (z.B. `transaction-item`)

#### React-spezifische Richtlinien

- Verwenden Sie funktionale Komponenten mit Hooks statt Klassenkomponenten
- Extrahieren Sie wiederverwendbare Logik in eigene Hooks
- Vermeiden Sie übermäßiges Nesting von Komponenten
- Verwenden Sie React.memo() für Performance-kritische Komponenten
- Nutzen Sie die Material UI Komponenten und Styling-Konventionen

#### State Management

- Verwenden Sie React Context für globalen State
- Halten Sie den State so lokal wie möglich
- Vermeiden Sie unnötige Re-Renders durch optimierte State-Updates

#### Fehlerbehandlung

- Implementieren Sie angemessene Fehlerbehandlung für asynchrone Operationen
- Verwenden Sie try/catch-Blöcke für potentiell fehleranfällige Operationen
- Zeigen Sie benutzerfreundliche Fehlermeldungen an

#### Tests

- Testen Sie Edge Cases und Fehlerszenarien
- Halten Sie die Testabdeckung auf einem angemessenen Niveau

#### Performance

- Vermeiden Sie unnötige Berechnungen in Render-Methoden
- Optimieren Sie Bilder und Assets für schnelle Ladezeiten
- Implementieren Sie Lazy Loading für große Komponenten

Durch die Einhaltung dieser Richtlinien tragen Sie dazu bei, dass das Projekt wartbar, konsistent und von hoher Qualität bleibt.

### Code-Formatierung mit Prettier

Dieses Projekt verwendet [Prettier](https://prettier.io/) zur automatischen Code-Formatierung, um einen konsistenten Coding-Stil im gesamten Projekt zu gewährleisten.

#### Konfiguration

Die Prettier-Konfiguration ist in der Datei `.prettierrc` definiert und enthält folgende Einstellungen:

```json
{
  "semi": true,          // Semikolon am Ende von Anweisungen
  "tabWidth": 2,         // 2 Leerzeichen für Einrückungen
  "printWidth": 100,     // Maximale Zeilenlänge
  "singleQuote": true,   // Einfache Anführungszeichen für Strings
  "trailingComma": "es5", // Komma am Ende von Objekten/Arrays (ES5-kompatibel)
  "bracketSpacing": true, // Leerzeichen in Objektliteralen
  "jsxBracketSameLine": false, // JSX-Klammern in neuer Zeile
  "arrowParens": "avoid", // Keine Klammern um einzelne Arrow-Function-Parameter
  "endOfLine": "lf"      // Linux-Style Zeilenenden (LF)
}
```

#### Verwendung

Um Prettier in Ihrem Entwicklungsprozess zu verwenden, stehen folgende npm-Skripte zur Verfügung:

```bash
# Alle Dateien formatieren
npm run format

# Überprüfen, ob alle Dateien korrekt formatiert sind (ohne Änderungen)
npm run format:check
```

#### Integration mit der IDE

Für die beste Entwicklungserfahrung empfehlen wir die Installation des Prettier-Plugins für Ihre IDE:

- **VS Code**: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- **WebStorm/IntelliJ**: [Prettier](https://plugins.jetbrains.com/plugin/10456-prettier)

Konfigurieren Sie Ihre IDE so, dass sie Prettier beim Speichern einer Datei automatisch ausführt.

### Code-Review Checkliste

Um qualitativ hochwertige Code-Reviews zu gewährleisten, sollten folgende Punkte bei jedem Review überprüft werden:

#### Funktionalität

- [ ] Erfüllt der Code die Anforderungen des JIRA-Tickets?
- [ ] Funktioniert der Code wie erwartet?
- [ ] Wurden Edge Cases berücksichtigt?
- [ ] Ist die Fehlerbehandlung angemessen implementiert?
- [ ] Wurden manuelle Tests durchgeführt?

#### Code-Qualität

- [ ] Folgt der Code den definierten Code-Richtlinien?
- [ ] Ist der Code verständlich und gut strukturiert?
- [ ] Gibt es Möglichkeiten zur Vereinfachung oder Optimierung?
- [ ] Wurden unnötige Kommentare oder Debug-Code entfernt?
- [ ] Ist die Benennung von Variablen, Funktionen und Komponenten klar und konsistent?

#### Architektur & Design

- [ ] Passt der Code zur bestehenden Architektur?
- [ ] Wurden Komponenten sinnvoll aufgeteilt und wiederverwendbar gestaltet?
- [ ] Ist die Trennung von Zuständigkeiten (Separation of Concerns) gewahrt?
- [ ] Werden bestehende Bibliotheken und Utilities angemessen genutzt?
- [ ] Ist der State-Management-Ansatz konsistent?

#### Performance

- [ ] Gibt es potenzielle Performance-Probleme?
- [ ] Werden unnötige Re-Renders vermieden?
- [ ] Sind Ressourcen (Bilder, Assets) optimiert?
- [ ] Werden große Listen oder Datenmengen effizient verarbeitet?

#### Sicherheit

- [ ] Gibt es potenzielle Sicherheitsprobleme?
- [ ] Werden Benutzereingaben validiert?
- [ ] Werden sensible Daten angemessen behandelt?

#### Dokumentation

- [ ] Sind komplexe Funktionen oder Algorithmen dokumentiert?
- [ ] Wurden README oder andere Dokumentationen bei Bedarf aktualisiert?
- [ ] Sind die Commit-Nachrichten klar und beschreibend?

#### Barrierefreiheit & UX

- [ ] Sind UI-Komponenten barrierefrei gestaltet?
- [ ] Ist die Benutzerführung intuitiv?
- [ ] Werden Ladezeiten und Übergänge angemessen behandelt?

#### Abschließende Überprüfung

- [ ] Wurden alle Kommentare aus vorherigen Reviews adressiert?
- [ ] Ist der Code bereit für die Zusammenführung?
- [ ] Gibt es Erkenntnisse, die mit dem Team geteilt werden sollten?

Diese Checkliste dient als Orientierungshilfe und sollte je nach Projekt und spezifischen Anforderungen angepasst werden. Nicht alle Punkte sind für jedes Review relevant, aber sie bieten einen guten Ausgangspunkt für gründliche Code-Reviews.

## Kontakt

Weitere Informationen zum Projekt und Kontaktmöglichkeiten folgen in Kürze.

---

© 2024 de-bankly. Alle Rechte vorbehalten.
