# Lockfile Merge Conflict Resolution
This appendix has procedures for resolving merge conflicts in package manager lockfiles. 

If the `package.lock`, `yarn.lock`, or similar file has been updated by several pull requests around the same time, somebody's PR will almost certainly end up with a conflict. These files are usually huge, auto-generated, and very sensitive to changes.

For example, if somebody installed v1.0.1 of a thing, it's possible that somebody else has inadvertently updated it to v1.0.2 when installing *their* new dependency. This will produce a large amount of changed lines that conflict and have no clear resolution.

You should not attempt to resolve these conflicts by editing the lockfiles. Instead, you can perform the merge, check the lockfile from `develop` out, and then let the package manager regenerate it. 

## Prerequisite
For all package managers, begin by checking out the pull request with the conflict. Merge the default branch (typically `develop`) and let the conflict happen.

```sh
git fetch
git checkout ABC-1234 # the branch at issue
git pull
git merge origin/develop
```

Then, take a look at the PR's diff and note what the developer was trying to install or update. If this PR was only updating a single package, you may want to be careful and targeted about how you regenerate the lockfile. If there were many packages, a general update-of-everything may be an appropriate strategy.

After regenerating the lock file, you should be able to mark it as resolved and complete the merge. Push the merge commit back up to GitHub when you're done!

## Yarn 1.x
```sh
git restore --source origin/develop -- yarn.lock

# For a general update of all packages:
yarn upgrade 

# Or, something more targeted, specify the package name (or names, you can list a bunch for one upgrade command):
yarn upgrade foo-package
```

## Composer
```sh
git restore --source origin/develop -- composer.lock

# For a general update of all packages:
composer upgrade 

# Or, something more targeted, specify the package name (or names, you can list a bunch for one upgrade command):
composer upgrade foo/package
```