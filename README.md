# TEREX AC40 PartBook

Static Electronic Parts Catalogue for TEREX AC40, prepared for GitHub Pages.

## Contents

- `index.html` - application entry point
- `app.js` - application logic
- `style.css` - user interface
- `data/` - extracted catalogue, part, hotspot and image metadata
- `images/` - exploded-view diagrams
- `.nojekyll` - prevents Jekyll processing
- `.gitignore` - excludes local/temporary files
- `.gitattributes` - normalizes source files and keeps JPGs binary
- `setup-github.ps1` - optional one-step Git setup/push script
- `setup-github.bat` - Windows launcher for the PowerShell setup script

## Local preview

From the project folder, run a simple static server. For example, with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Do not open `index.html` directly with `file://`; browsers may block `fetch()` requests for JSON files.

## GitHub Pages

1. Create an empty GitHub repository.
2. Open CMD/PowerShell in this folder.
3. Run `setup-github.bat`, or use the Git commands below.
4. In GitHub, open **Settings > Pages**.
5. Choose **Deploy from a branch**.
6. Select `main` and `/ (root)`.

### Manual Git commands

```bash
git init
git branch -M main
git remote add origin https://github.com/USERNAME/terex-ac40-partbook.git
git add .
git commit -m "Initial TEREX AC40 PartBook"
git push -u origin main
```

## File size / Git LFS

The current package is approximately 54 MB in total, and the largest individual tracked file is far below GitHub's 100 MB normal-file limit. Git LFS is therefore **not required** for the current package.

If future diagrams exceed 100 MB individually, use Git LFS for those files rather than adding them as normal Git blobs.
