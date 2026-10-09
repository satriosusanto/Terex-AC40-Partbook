# TEREX AC350-6 PartBook

GitHub Pages-ready static web application.

- Catalog variants: 866
- Source catalog rows: 10441
- Material rows: 6356
- English descriptions: 6356
- Link/hotspot rows: 16644
- Image references: 780
- TIFF diagrams included: 697
- Hotspots mapped: 16644
- Part rows mapped: 10441
- Missing diagram references: 0

Features: catalog selector, part search, diagram viewer, hotspot overlays, part list, zoom, dark mode, responsive layout. The app uses UTIF.js from jsDelivr to decode TIFF in the browser; an internet connection is required to load that decoder.

Important: EPARTS/EPARTDATA/EHOTSPOT/ESHEET are empty in the supplied extraction, so this build uses populated KATALOG, MAT, SPRACHE, LINKS, IMAGES and POOL tables. Hotspot coordinates are interpreted on a normalized 0–10000 basis; validate several callouts against the original desktop catalog before ordering parts.

Publish folder contents to a GitHub repository and enable GitHub Pages on main / root.
