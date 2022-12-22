# Settings & Permissions
The Northwestern IT GitHub organization is maintained by the EACD team. It is available to any Northwestern IT staff.

Membership in the GitHub organization and teams is controlled centerally. Since pushing code to a release branch in many of our repositories also bestows the authority to deploy to production by way of CI/CD, access requests must be documented and approved.

## Permissions
The organization has teams that closely mirror the organizational chart, with a *leads* team added. A repository is typically owned by one team; its *leads* group will receive the *Admin* permission, and the team will receive *Write* permission. For details on what the permission levels do, see [GitHub's permission matrix](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#repository-access-for-each-permission-level).

For example, the ADO department looks like this:

- Administrative Systems
    - ADO
        - EACD
            - EACD-leads
        - Peoplesoft
            - Peoplesoft-leads

If the EACD team is responsible for the *ADO-CoolApp* repository, then the EACD-leads team will have Admin, and the EACD team will have Write. No other groups will be able to view or push to the repository. The EACD-leads team may ask the Github admins to add other teams with read/write permissions to their repositories on an as-needed basis.

At the request of a repository's owner, other teams can be added with read/write access.

### Outside Collaborators
No individual collaborators should be added to a repository. Instead, a team can be created under Partners. The team will then be added to any applicable repositories.

Outside collaborators include other Northwestern staff (outside of IT), consultants, service providers, and student workers.

Having a team for outside collaborators allows us to assign context to who they are & why they should be collaborating on the repository. It also allows us to follow the same processes for outside collaborators as internal staff.

### Reviewer Teams
Upon request, the GitHub administrators will create reviewer teams. These teams are intended to be used to easily tag a whole group of interested parties as pull request reviewers. 

To reduce the burden of maintaining team memberships on our Github admins, the ability to add/remove members from a reviewer team will be delegated to some of its team member(s). Since the membership is not centerally managed, these teams **are not** eligible to be collaborators on a repository.

A reviewer team is a good way to sub-divide a larger group of developers by interest. For example, the EACD team covers some 15 developers. Creating an alumni-reviewers team would be an easy way to tag the six developers who actively work on alumni software.

## Branch Protection
For a typical Northwestern application, you will have at least three environments: development, QA/UAT/test, and production. If you are using CI/CD to deploy your application, you must create branches to mirror your environments. For example:

- `develop`
- `qa`
- `production`

::: tip Libraries and Packages
If you are building a library or package (as opposed to an app you will be deploying), you do not need to follow this practice. If your targeted package management system has any conventions, follow those instead.

You should still protect the branch(es) that you generate release artifacts from, as described below.
:::

Once you have created your branches, we recommend setting up [Branch Protection](https://help.github.com/en/articles/about-protected-branches) for all of them. This is a GitHub feature that lets you enforce certain conditions:

- No contributors can force-push to a protected branch
- You may require one or more Pull Request reviews before code can be merged to the branch
    - You may require a [code owners](#code-owners-template) submit a review as well
- You may require that all of the [Status Checks](https://help.github.com/en/articles/about-required-status-checks) on a Pull Request pass before code can be merged to the branch
    - Status Checks come from Jenkins, TravisCI, or other 3rd-party tools that you have set up

If you are using CI/CD to deploy your application, you must require an approved review from your leads team before a pull request can be merged to any production environments.
