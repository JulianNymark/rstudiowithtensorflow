# rstudiowithtensorflow

One-command RStudio with a TensorFlow that actually works.

- `flake.nix` — Nix flake: R + RStudio + reticulate from Nix, Python/TensorFlow from official PyPI wheels in a `uv` venv
- `site/` — the friendly guide (GitHub Pages)

```sh
nix run github:JulianNymark/rstudiowithtensorflow
```

Opens RStudio, wired to the right Python. Dev shell for hacking:

```sh
nix develop
```

Then in the R console:

```r
library(tensorflow); tf_config()
```

Full instructions: see `site/index.html` (deploy to GitHub Pages).