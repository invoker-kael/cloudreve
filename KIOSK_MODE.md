# Passwordless kiosk mode

This fork intentionally runs the web UI as a passwordless single-user Cloudreve instance.

## Behavior

- The browser requests `GET /api/v4/session/kiosk` before React starts.
- The backend resolves a real active administrator account and issues a normal Cloudreve token.
- All existing file, workflow, storage-policy and admin middleware remains in place; authentication is not globally bypassed.
- The logout action is hidden because a kiosk browser is automatically signed back in on the next page load.
- The upstream frontend remains a git submodule. The two modified frontend files live under `.build/frontend-overrides/` and are copied into the submodule by `.build/build-assets.sh` before the normal frontend build.

## Kiosk user

The default kiosk account is user ID `1`.

Set a different active administrator account before starting Cloudreve:

```bash
export CR_KIOSK_USER_ID=2
```

If the selected user does not exist, is inactive, or is not in an administrator group, kiosk token issuance fails closed and the legacy login UI remains available for recovery.

## Storage policies / cloud drives

The community backend does not impose a numeric limit on how many supported storage policies can be created. The practical blocker for adding policies was the login/admin gate, which kiosk mode removes by supplying a valid administrator token.

The Pro-only `load_balance` provider is deliberately not force-enabled here: this community backend does not contain the complete implementation/wizard needed to make that provider functional. Existing community providers such as Local, Remote, S3, OneDrive, OSS, COS, Qiniu, Upyun, OBS and KS3 continue to use their normal creation APIs without an added count restriction.

## Security warning

Anyone who can reach this web UI can obtain administrator access by design. Only expose this fork on a trusted LAN/VPN or place it behind an authentication-capable reverse proxy. Do not publish the kiosk endpoint directly to an untrusted network.
