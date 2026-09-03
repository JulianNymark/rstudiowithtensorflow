# RStudio + R + TensorFlow (Python) in one shot.
#
# Why this exists: the R `tensorflow`/`keras` packages are thin wrappers that
# call Python's TensorFlow via `reticulate`. The classic failure mode is
# reticulate finding a Python that does not have TensorFlow installed.
# This flake removes the guesswork:
#
#   - R + RStudio + reticulate (+ R tensorflow/keras3 glue) come from Nix
#   - Python comes from Nix, but TensorFlow itself comes from official
#     PyPI wheels via a pinned `uv` venv in a cache dir
#     (nixpkgs' own python tensorflow package is broken upstream, so wheels
#     are the only reliable cross-platform source — macOS arm64 included)
#   - RETICULATE_PYTHON is hard-wired to that venv, so R literally cannot
#     pick the wrong Python
#
# Usage:
#   nix run    github:YOU/rstudiowithtensorflow   # launches RStudio, wired
#   nix develop                                # shell for Rscript/hacking
#
# Verify inside RStudio's console (or `Rscript`):
#   library(tensorflow); tf_config()

{
  description = "RStudio with a working TensorFlow via reticulate";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});

      # R glue packages. If one fails to build on your platform, use the
      # `minimal` devShell (nix develop .#minimal) — reticulate only, and
      # `install.packages("tensorflow")` from inside R still works then.
      rGlueFull = [
        "reticulate"
        "tensorflow"
        "keras3"
      ];
      rGlueMinimal = [ "reticulate" ];

      # Everything shared by the devShell and the `nix run` app:
      # env vars + venv bootstrap.
      mkEnvFor =
        pkgs: rGluePkgs:
        let
          # Python interpreter from Nix. Pinned to 3.12: official TensorFlow
          # wheels currently ship for CPython 3.10–3.13, and nixpkgs' default
          # python3 may be newer than that.
          python = pkgs.python312;

          # R with the reticulate/tensorflow glue packages.
          rEnv = pkgs.rWrapper.override {
            packages = map (n: pkgs.rPackages.${n}) rGluePkgs;
          };

          # RStudio using that R + packages, via nixpkgs' canonical wrapper.
          rstudioEnv = pkgs.rstudioWrapper.override {
            packages = map (n: pkgs.rPackages.${n}) rGluePkgs;
          };

          # Everything shared by the devShell and the `nix run` app:
          # env vars + venv bootstrap.
          bootstrap = ''
            # Stable venv location, shared by nix run and nix develop.
            VENV_DIR="''${XDG_CACHE_HOME:-$HOME/.cache}/rstudiowithtensorflow/venv"
            REQ="${./requirements.txt}"

            # Marker name embeds the requirements.txt store hash, so editing
            # requirements triggers a clean rebuild of the venv.
            MARKER="$VENV_DIR/.ok-$(basename "$REQ")"

            if [ ! -e "$MARKER" ]; then
              echo "rstudiowithtensorflow: setting up TensorFlow venv (first run only)..."
              rm -rf "$VENV_DIR"
              ${pkgs.uv}/bin/uv venv --python "${python}/bin/python3" "$VENV_DIR" &&
              ${pkgs.uv}/bin/uv pip install --python "$VENV_DIR/bin/python" -r "$REQ" &&
              touch "$MARKER" || {
                echo "rstudiowithtensorflow: ERROR - venv setup failed, see output above" >&2
                exit 1
              }
            fi

            # --- Wire R/reticulate to this exact Python ---------------------
            export RETICULATE_PYTHON="$VENV_DIR/bin/python"
            export RETICULATE_MINICONDA_ENABLED="FALSE"

            # Make sure RStudio picks up the Nix R (honored on Linux; on
            # macOS it works when RStudio is launched from this same shell).
            export RSTUDIO_WHICH_R="${rEnv}/bin/R"

            # Quieter TF logs; force the keras backend.
            export TF_CPP_MIN_LOG_LEVEL="2"
            export KERAS_BACKEND="tensorflow"
          '';
        in
        {
          inherit python rEnv rstudioEnv bootstrap;

          devShell = pkgs.mkShell {
            packages = [
              rstudioEnv
              rEnv
              python
              pkgs.uv
            ];
            shellHook = ''
              ${bootstrap}

              echo
              echo "  RStudio+TF env ready:"
              echo "    RETICULATE_PYTHON = $RETICULATE_PYTHON"
              echo "    RSTUDIO_WHICH_R   = $RSTUDIO_WHICH_R"
              echo "  Start it:  rstudio"
              echo "  Verify in R:  library(tensorflow); tf_config()"
              echo
            '';
          };

          launcher = pkgs.writeShellScriptBin "rstudio-tf" ''
            ${bootstrap}
            exec ${rstudioEnv}/bin/rstudio "$@"
          '';
        };
    in
    {
      devShells = forAllSystems (pkgs: {
        default = (mkEnvFor pkgs rGlueFull).devShell;

        # Fallback if an R glue package fails to build on your platform.
        minimal = (mkEnvFor pkgs rGlueMinimal).devShell;
      });

      apps = forAllSystems (pkgs: {
        default = {
          type = "app";
          program = "${(mkEnvFor pkgs rGlueFull).launcher}/bin/rstudio-tf";
        };
      });
    };
}
