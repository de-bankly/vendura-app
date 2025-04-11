# Vendura App Styling-Leitfaden

Dieses Dokument beschreibt den Styling-Ansatz, der in der Vendura App verwendet wird.

## Theme-Struktur

Die Anwendung verwendet Material-UI (MUI) für das Styling mit einem benutzerdefinierten Theme, das in `src/style/theme/index.js` definiert ist. Das Theme umfasst:

### Typografie

- **Fließtexte**: Spectral Light
- **Überschriften**: Montserrat Extra Bold

### Farbpalette

- **Primärfarbe**: #0043C1
- **Akzentfarben**:
  - #0466c8 (Primär Hell)
  - #023e7d (Primär Dunkel)
  - #002855 (Sekundär Dunkel)
  - #001845 (Text Primär)
  - #018abc (Sekundär Haupt)
  - #36688d (Sekundär Hell)

## Globale Stile

Globale Stile werden auf zwei Arten implementiert:

1. **MUI CssBaseline**: CSS-Reset und Basisstile werden durch MUI's `CssBaseline`-Komponente und benutzerdefinierte Überschreibungen im Theme angewendet.

2. **Globales CSS**: Zusätzliche globale Stile sind in `src/style/global/index.css` definiert.

## Verwendung

### Typografie

```jsx
<Typography variant="h1">Überschrift 1</Typography>
<Typography variant="h2">Überschrift 2</Typography>
<Typography variant="body1">Fließtext</Typography>
```

### Farben

```jsx
<Box sx={{ bgcolor: 'primary.main', color: 'white' }}>
  Primärfarbe
</Box>
<Box sx={{ bgcolor: 'secondary.main', color: 'white' }}>
  Sekundärfarbe
</Box>
```

### Buttons

```jsx
<Button variant="contained" color="primary">
  Primärer Button
</Button>
<Button variant="outlined" color="secondary">
  Sekundärer Button
</Button>
```

## Responsives Design

Das Theme enthält responsive Typografie, die sich basierend auf der Bildschirmgröße anpasst. Media Queries sind in der Theme-Konfiguration definiert.

## Barrierefreiheit

Das Theme enthält Fokus-Stile für die Tastaturnavigation und stellt ausreichenden Farbkontrast für die Lesbarkeit sicher.

## Erweiterung des Themes

Um das Theme zu erweitern oder zu modifizieren, bearbeiten Sie die Theme-Konfiguration in `src/style/theme/index.js`. Für globale Stile, die nicht durch das Theme behandelt werden können, bearbeiten Sie `src/style/global/index.css`.
