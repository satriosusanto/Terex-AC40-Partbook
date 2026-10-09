# TEREX AC80-2 PartBook

Static electronic parts catalogue reconstructed from the supplied Docware/Advantage Database source.

## GitHub Pages

Upload the contents of this folder to the repository root and enable **Settings → Pages → Deploy from a branch → main → / (root)**.

No PHP, Java, Node.js, MySQL, H2 or Tomcat is required at runtime.

## Source data validation

- 7,512 catalog line records
- 4,663 material records
- 654 catalog nodes represented in the web index
- 545 diagram records / 544 extracted image blobs
- 11,278 diagram hotspots
- English descriptions are preferred, with German fallback
- Original AC80-2 coordinates are scaled to the web image dimensions

The supplied source uses Advantage proprietary ADT/ADI/ADM files. The web package contains only the extracted static representation; the source database is not modified.
