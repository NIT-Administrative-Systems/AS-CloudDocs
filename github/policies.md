# Policy
These policies govern the use of the Northwestern IT GitHub organization.

## Secrets
No secrets should be committed to a Github repository. Secrets include username/passwords, API keys, session tokens, or anything else that can be used to access resources.

In some limited cases, there are API keys that are not considered secret. Things that are intended to be available to client-side Javascript code, like a Sentry DSN, *may* be committed. It is recommended to inject environment-specific configuration (like the aforementioned sentry DSN) into your app instead of commit it to the codebase.

If a secret is inadvertently committed and pushed to Github, it cannot be removed -- rewriting the repository history will not remove it from the reflog on Github's side. Your only option is to immediately change the secret in any systems that utilize it.

## Integrations
There are tons of services that will integrate with GitHub to assist in testing, code review, coding style enforcement, error manegement, and more. 

Integrations available via the GitHub marketplace can be enabled. A list of repositories should be provided so the integration can be authorized to use those specific repositories.

3rd party integrations with GitHub (not via the marketplace) are typically done with OAuth. We cannot enable these integrations; the GitHub OAuth permission model will grant access to all private repositories in the organization.
