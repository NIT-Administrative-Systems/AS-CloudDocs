# Policies
These policies govern the use of the NIT-Administrative-Systems GitHub organization. Compliance is mandatory for all AS staff and outside collaborators.

## Secrets
No secrets should be committed to a repository. Secrets include username/passwords, API keys, session tokens, or anything else that can be used to access resources.

In some limited cases, there are API keys that are not considered secret. Things that are intended to be available to client-side Javascript code, like a Sentry DSN, may be committed. It is still recommended to inject environment-specific configuration (like the aforementioned sentry DSN) into your app instead of hard-coding it.

If a secret is inadvertently committed and pushed to GitHub, it **cannot** be removed: 

- Removing it with another commit preserves the secret in the repository history
- Rewriting the repository history will not remove it from the reflog on GitHub's side 

The only option is to immediately change the secret in any systems that utilize it.

### Remediating an Exposed Secret
:::tip It Happens
Despite our best efforts, *these things happen* from time to time.

Don't panic. We just need to fix it.
:::

First: until you have pushed a commit to GitHub, no incident has occurred, because the secret hasn't left your computer yet. You can amend the commit to remove secret.

If you find a secret in the repository or push one yourself, notify the relevant lead/manager -- usually your own. Inform them what the secret is for, what it can access, and who it has been exposed to.

Here are some guidelines on how severe a situation is based on the repository access. The repository will have a public/private/internal badge next to its name.

| Repository Access | Severity Level      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Private           | Low to Medium       | Our private repositories have a fairly tight access list -- developers and perhaps some relevant analysts. These are all people who should know to behave themselves. It's not a crisis. However, verify that there aren't non-NU outside collaborators who we may have leaked the secret to.                                                                                                                         |
| Internal          | Medium to Emergency | Internal repositories are available to the Northwestern enterprise, which includes non-NUIT staff, faculty, and students. Evaluate what the secret has access to; if this is something students could abuse, we have an emergency.                                                                                                                                                                                    |
| Public            | High to Emergency   | Public repositories are open to the whole internet, and bad actors actively scan public commits on GitHub for secrets. Assume anything leaked in a public repository will be exploited quickly. If this is an AWS/Azure/GCP/etc credential that can provision services, **immediately** revoke it, even if this causes an outage -- otherwise bad actors will start spinning up $expensive$ GPU EC2s to mine bitcoin. |

For a **Low** or **Medium** severity, your supervisor/manager should determine if the [information security incident response protocol](https://www.it.northwestern.edu/about/policies/incident.html) needs to be invoked. These are situations where we have only exposed secrets to people who otherwise have access to them, so while we need to rotate the credentials to prevent further leaks in the future, there is no immediate risk. For **High** or **Emergency** severities, you should initiate the protocol immediately by contacting the IT Support Center during business hours, or the SOC off-hours.

If you know how to rotate the credential, begin making preparations to do so. This may include generating a new credential to switch to, identifying other places the credential is used, and filing a CAB ticket. If you're not familiar with the secret, ask your team about it.

## Integrations & GitHub Apps
There are tons of services that will integrate with GitHub to assist in testing, code review, coding style enforcement, error manegement, and more.

Integrations available via the GitHub Marketplace can be enabled. A list of repositories should be provided so the integration can be authorized to use those specific repositories. Open a TeamDynamix ticket with the `NUIT-AS-ADO-EACD-Cloud-Services-and-Integrations` team to get started on set-up.

3rd party integrations with GitHub, not via the marketplace, are typically done with OAuth. We are unlikely to enable these integrations because their access is all-or-nothing, and we do not want to expose private repositories from one team to an integration used by another. We will evaluate these integrations on a case-by-case basis. 

## New Repositories
Anyone can create a repository in the NIT-Administrative-Systems org. When doing so, you are asked to make an important decision: who can see the repository?

| Level    | Who Can See It?                                                                            |
|----------|--------------------------------------------------------------------------------------------|
| Public   | Everyone on the whole internet.                                                            |
| Internal | Everybody in the Northwestern enterprise, including non-NUIT staff, faculty, and students. |
| Private  | Only teams you explicitly grant access to.                                                 |

In the absence of a specific reason to make a repository public or internal, you must choose private. 

Public repositories are open to the world. If you are releasing a library or documentation that you want to share with the IT@NU community or the wider world, you may select public. Northwestern application code should not be public without leadership approval.

There are no (currently known[^1]) cases where internal is useful for us, so it should not be used.

[^1]: But if you come up with a use-case, please submit a pull request!

You should add your leads team as an admin for the repository after creating it. For private repositories, you need to add your own team with write permissions or else they can't work on it.