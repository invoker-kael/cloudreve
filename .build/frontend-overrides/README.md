# Frontend overrides

These files are copied over the pinned `cloudreve/frontend` submodule by `.build/build-assets.sh`.

Pinned upstream frontend commit: `19da0fe1ecd40971fafa813983d769fdce41573c`

The overrides are intentionally limited to:
- bootstrapping a passwordless kiosk session before React renders;
- hiding the logout action in kiosk mode.

When updating the frontend submodule, rebase these two files against the new upstream versions before building.
