# 🔒 Sicherheitsrichtlinien für Vendura App

## 📋 Übersicht

Die Sicherheit unserer Anwendung und der Schutz der Nutzerdaten haben für uns höchste Priorität. Dieses Dokument beschreibt unsere Sicherheitsrichtlinien, implementierte Schutzmaßnahmen und den Prozess zur Meldung von Sicherheitslücken.

## ✅ Unterstützte Versionen

| Version | Unterstützt        |
| ------- | ------------------ |
| main    | :white_check_mark: |
| dev     | :x:                |

## 🛡️ Implementierte Sicherheitsmaßnahmen

Vendura implementiert zahlreiche Sicherheitsmaßnahmen, um die Anwendung und Nutzerdaten zu schützen:

### Frontend-Sicherheit

- **Content Security Policy (CSP)**: Verhindert XSS-Angriffe durch Einschränkung der erlaubten Quellen für Skripte, Styles und andere Ressourcen
- **HTTPS-Erzwingung**: Alle Verbindungen werden über HTTPS verschlüsselt
- **JWT-Authentifizierung**: Sichere, token-basierte Authentifizierung mit kurzer Gültigkeitsdauer
- **Automatisches Token-Refresh**: Sichere Erneuerung von Authentifizierungstoken
- **Zugriffskontrolle**: Rollenbasierte Zugriffskontrolle für alle geschützten Routen und Funktionen
- **Input-Validierung**: Client-seitige Validierung aller Eingaben vor der Übermittlung
- **Sanitization**: Bereinigung von HTML-Inhalten zur Vermeidung von XSS-Angriffen

### API-Sicherheit

- **Rate Limiting**: Begrenzung der API-Anfragen pro Zeiteinheit
- **CSRF-Schutz**: Maßnahmen gegen Cross-Site Request Forgery
- **Sichere Header**: Verwendung sicherheitsrelevanter HTTP-Header (X-Content-Type-Options, X-Frame-Options, etc.)

### Datensicherheit

- **Minimale Datenspeicherung**: Speicherung nur der notwendigsten Daten im Frontend
- **Sichere Speicherung**: Verwendung sicherer Methoden zur lokalen Datenspeicherung
- **Automatische Abmeldung**: Timeout für inaktive Sitzungen

## 🔍 Sicherheitsaudits

Die Vendura App durchläuft regelmäßige Sicherheitsaudits:

- Regelmäßige automatisierte Sicherheitsscans mit OWASP-Tools
- Manuelle Code-Reviews mit Fokus auf Sicherheitsaspekte
- Dependency-Scanning zur Erkennung von Schwachstellen in Abhängigkeiten
- Jährliche umfassende Sicherheitsaudits durch externe Experten

## 📢 Meldung von Sicherheitslücken

Wir nehmen alle Sicherheitsbedenken ernst. Wenn Sie eine Sicherheitslücke in Vendura entdecken, bitten wir Sie, diese verantwortungsvoll zu melden:

1. **Vertrauliche Meldung**: Bitte senden Sie Ihre Entdeckung nicht über öffentliche Issue-Tracker oder Foren.
2. **Kontaktaufnahme**: Senden Sie eine E-Mail an [security@de-bankly.example.com](mailto:security@de-bankly.example.com) mit dem Betreff "Vendura Sicherheitslücke".
3. **Informationen**: Beschreiben Sie die Sicherheitslücke so detailliert wie möglich, einschließlich:
   - Schritte zur Reproduktion des Problems
   - Betroffene Komponenten oder Funktionen
   - Potenzielle Auswirkungen und Schweregrad
   - Vorschläge zur Behebung (falls vorhanden)
   - Ihre Kontaktdaten für Rückfragen (optional)

## ⏱️ Prozess nach der Meldung

Nach Erhalt einer Sicherheitsmeldung befolgen wir diesen Prozess:

1. **Bestätigung**: Wir bestätigen den Erhalt Ihrer Meldung innerhalb von 24 Stunden.
2. **Untersuchung**: Unser Sicherheitsteam untersucht die gemeldete Sicherheitslücke.
3. **Klassifizierung**: Wir bewerten den Schweregrad und die Auswirkungen der Sicherheitslücke.
4. **Behebung**: Wir entwickeln und testen einen Fix für die Sicherheitslücke.
5. **Kommunikation**: Wir informieren Sie über den Fortschritt und die geplante Veröffentlichung des Fixes.
6. **Veröffentlichung**: Wir stellen den Fix bereit und dokumentieren die Sicherheitslücke in unserem Security Advisory.
7. **Anerkennung**: Mit Ihrer Zustimmung nehmen wir Sie in unsere Liste der Sicherheitsmitwirkenden auf.

## ⏳ Zeitplan für die Veröffentlichung

Unser Ziel ist es, Sicherheitslücken zeitnah zu beheben:

- **Kritische Sicherheitslücken**: Fix innerhalb von 48 Stunden
- **Hohe Sicherheitslücken**: Fix innerhalb von 7 Tagen
- **Mittlere Sicherheitslücken**: Fix innerhalb von 30 Tagen
- **Niedrige Sicherheitslücken**: Fix innerhalb von 90 Tagen

## 🤝 Verantwortungsvolle Offenlegung

Wir bitten um eine verantwortungsvolle Offenlegung von Sicherheitslücken und gewähren eine Frist von 90 Tagen, bevor Details zu Sicherheitslücken öffentlich gemacht werden, sofern nicht anders vereinbart.

## 👏 Danksagungen

Wir möchten allen Sicherheitsforschern danken, die zur Verbesserung der Sicherheit von Vendura beitragen. Mit Ihrer Erlaubnis werden Sie in unserer öffentlichen Liste der Sicherheitsmitwirkenden erwähnt.

---

© 2024 de-bankly. Alle Rechte vorbehalten.
