# GitHub: `dev` vs `main`

## Intended setup

1. **Default branch:** `dev` — `Settings → General → Default branch → dev`.
2. **Branch protection for `main`:** `Settings → Branches → Add rule` for `main`:
   - Require a pull request before merging
   - Require status checks to pass (e.g. CI) when you add them as required
   - Do not allow bypassing (optional, for admins)
   - Restrict who can push (optional)

3. **Automation:** Workflow `main-pr-source-dev.yml` fails any pull request targeting `main` whose head branch is not `dev`.

## CLI (optional)

After both branches exist on the remote:

```bash
gh repo edit OWNER/REPO --default-branch dev
```

Branch protection often needs the web UI or the REST API with fine-grained permissions; see [GitHub docs — protecting a branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
