# TEREX AC250-1 PartBook

GitHub Pages-ready static web application.

- Catalog variants: 812
- Source catalog rows: 9340
- Material rows: 5609
- English descriptions: 5609
- Link/hotspot rows: 14835
- Image references: 737
- TIFF diagrams included: 659
- Hotspots mapped: 14835
- Part rows mapped: 9340
- Missing diagram references: 3

Features: catalog selector, part search, diagram viewer, hotspot overlays, part list, zoom, dark mode, responsive layout. The app uses UTIF.js from jsDelivr to decode TIFF in the browser; an internet connection is required to load that decoder.

Important: EPARTS/EPARTDATA/EHOTSPOT/ESHEET are empty in the supplied extraction, so this build uses populated KATALOG, MAT, SPRACHE, LINKS, IMAGES and POOL tables. Hotspot coordinates are interpreted on a normalized 0–10000 basis; validate several callouts against the original desktop catalog before ordering parts.

Publish folder contents to a GitHub repository and enable GitHub Pages on main / root.
