# LaTeX Starter Bundle

This starter bundle is copied into `paper/` when a new research workspace is created.

It provides:

- `manuscript.tex` as the top-level entry point
- `sections/*.tex` for section-by-section drafting
- `references.bib` as the bibliography placeholder
- `build_paper.sh` to compile the PDF with `tectonic`

Expected outputs after running the build script:

- `paper/build/manuscript.pdf`
- `paper/build/build.log`
- `paper/build/build_errors.md` when compilation fails

Notes:

- The default bibliography commands in `manuscript.tex` are commented out to keep the first build path simple.
- Uncomment the bibliography lines after citations and BibTeX entries are ready.
- The starter bundle is modular. Keep the core sections, then selectively enable optional modules such as `related_work`, `ablations`, or `discussion_scope` when the paper shape actually needs them.
