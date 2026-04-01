# GitHub: `dev` vs `main`

## Local first, no staging

There is no separate staging environment. **Run the same commands locally** (`pnpm lint`, `typecheck`, `test`, `build` from `disclo/`) before you push. **Railway / production** should track **`main`** when you are ready to release; merge **`dev` → `main`** only after local checks pass.

## Intended setup

1. **Default branch:** `dev` — `Settings → General → Default branch → dev` (so scheduled workflows such as keep-alive use the branch that contains `.github/workflows/`).
2. **CI (`.github/workflows/ci.yml`):** Runs on **push to `dev`** and on **pull requests** targeting **`dev` or `main`**. Opening a **PR from `dev` to `main`** runs the full pipeline against the PR head (your release gate).
3. **Branch protection for `main`:** `Settings → Branches → Add rule` for `main`:
   - Require a pull request before merging
   - Require status checks to pass (e.g. CI) when you add them as required
   - Do not allow bypassing (optional, for admins)
   - Restrict who can push (optional)

4. **Automation:** Workflow `main-pr-source-dev.yml` fails any pull request targeting `main` whose head branch is not `dev`.

## CLI (optional)

After both branches exist on the remote:

```bash
gh repo edit OWNER/REPO --default-branch dev
```

Branch protection often needs the web UI or the REST API with fine-grained permissions; see [GitHub docs — protecting a branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
