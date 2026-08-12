# AI Git Rules

- Read the repository and Git status before editing.
- Never work directly on `main` for feature work.
- Create a feature branch for module work.
- Review `git diff` before staging or committing.
- Run available typecheck/build/tests before feature pushes.
- Check staged files for secrets before commit.
- Make small, coherent commits.
- Push only feature branches automatically.
- Never merge a PR automatically.
- Human approval is required for: push to `main`, force push, reset, branch deletion, visibility changes, and security settings changes.
- Never commit `.env`, credentials, tokens, or private keys.
