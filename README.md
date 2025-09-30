
## CI/CD

GitHub Actions auto-deploys this site to Firebase Hosting.

- Workflow: `.github/workflows/firebase-hosting.yml`
- Deploys on push to `main`
- Creates preview channels for pull requests

Required secret:

- `FIREBASE_TOKEN`: CI token generated with `firebase login:ci` from a Firebase project owner.

Ensure `firebase.json` points `hosting.public` to `docs` (already configured).


