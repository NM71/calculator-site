# AGENT.md - CalcHub Developer Guide

## Build/Test/Lint Commands
- **Test**: Open HTML files in browser to test calculators (no automated test suite)
- **Lint**: No specific linting tools configured
- **Serve**: Use a local HTTP server (e.g., `python -m http.server` or VS Code Live Server)
- **PWA**: Service worker caching enabled via sw.js

## Architecture & Structure
- **Type**: Static calculator website with PWA capabilities
- **Structure**: Main index.html with categorized calculator pages in /calculators/
- **Categories**: 7 main categories (math, finance, health, education, construction, business, tech)
- **PWA**: Progressive Web App with manifest.json and service worker
- **No Backend**: Pure frontend HTML/CSS/JavaScript

## Code Style & Conventions
- **CSS**: CSS custom properties (--primary-color, --bg-primary, etc.) for theming
- **JavaScript**: ES6+ classes (ThemeManager, SearchManager, etc.)
- **HTML**: Semantic HTML5 structure with accessibility considerations
- **Naming**: kebab-case for files/folders, camelCase for JS variables
- **Theme**: Light/dark mode support via data-theme attribute
- **Responsive**: Mobile-first responsive design
- **Icons**: FontAwesome 6.4.0 via CDN
- **No Comments**: Minimal code comments, prefer self-documenting code
