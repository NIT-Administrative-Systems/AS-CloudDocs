# Single Sign-on
There are several different options available for AS to do single-sign on.

| Type                  | Typical Use Cases        | Technology                          |
|-----------------------|--------------------------|-------------------------------------|
| OpenAM Integration    | Agentless SSO, Agent SSO | OpenID/OAuth2 or OpenAM's REST APIs |
| Federation/Shibboleth | Vendor app login         | SAML                                |
| Azure AD              | General purpose          | OpenID/OAuth2 or SAML               |

All of these options support multi-factor (MFA) authentication. MFA must be enabled for all applications as per the Admin Systems Expectations given over the last few years.

:::tip Recommendations
Our general recommendation is to use [Azure AD's OpenID authentication](#applications-via-openid-connect). This is our most secure option, and it utilizes the standard OpenID protocol.

This is a relatively new approach for AS; we have made heavy use of the OpenAM integrations. Our understanding and practices around AzureAD OpenID are developing.
:::

## OpenAM Integration
This is the traditional "online passport" login screen that Northwestern has used for years. 

There are two methods of doing an OpenAM integration: agentless SSO, which utilizes the `nusso` session cookie, or OAuth2. The web agent that Identity Services/Cyberinfrastructure provide for webservers like Apache and IIS utilizes OAuth2.

### Agentless
Agentless SSO utilizes the `nusso` session cookie set for the `.northwestern.edu` domain. This cookie is `httpOnly` & `secure`, meaning that an application must meet all of the following criteria to access the cookie:

- Served from a northwestern.edu name
- Served over HTTPS
- Has a backend that can access the cookie (client-side JavaScript cannot read the value of an `httpOnly` cookie)

The session token can be looked up using [the Agentless SSO API](https://apiserviceregistry.northwestern.edu/apis/identity-management-apis/IdentityManagement-AgentlessWebSSO.html) and resolved to a netID. Depending on the authentication tree you use, you can trigger Duo MFA. The API endpoint will indicate whether an `nusso` session token has gone through MFA.

This is largely self-service. Requests for access to the Agentless SSO API are made in the API Service Registry and still must be reviewed and approved. This is not a standard authentication protocol, so you will need to develop it in your application or use one of our [agentless libraries](../development/libraries.md).

### Web Agent
The web agent comes in two flavours: the Apache agent for use on Linux, and the IIS agent for use on Windows Server. This is a package that Identity Services provides to CI that includes a config file that's been pre-configured with an OAuth2 client ID & secret.

If you want to use a web agent, you will need to submit a ticket to Identity Services asking them to set up a new application and provide the appropriate agent package for your webserver.

The web agent cannot be used with any serverless services on AWS. It could potentially be used with ECS Fargate, but we do not have any example Dockerfiles at this time.

## Federation/Shibboleth
Federation (colloquially known as "fed" or "shibb") is a SAML identity provider (IdP). SAML is a standard that many enterprise SaaS service providers can work with.

To set up a SAML integration, you will need to get the service provider's SAML metadata and open a ticket to the Identity Services team. They will do the necessary configuration and provide you with the IdP's SAML metadata. Then, you can configure the SAML authentication on the SaaS app side.

## Azure ActiveDirectory
Azure ActiveDirectory (Azure AD) is Microsoft's cloud identity solution. Cyberinfrastructure's Collaboration Services have replicated all of our identities to Azure AD, it can be used in a similar fashion to OpenAM.

As an added bonus, authenticating to Azure AD yields an access token that can call the [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/use-the-api). This can be used to load the user's profile picture & detailed contact information. If additional scopes are set up and the user consents, it can be used to integrate with their Outlook calendar or other O365 services.

### Applications via OpenID Connect
To use Azure AD's OpenID authentication, your application must be served via HTTPS, with an exception given for `localhost`.

You can [log in to the Azure console](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) and register an application to begin using OpenID authentication from the *App registrations* screen.

You will need to configure your application's redirect URIs on its *Authentication* screen, create a secret on its *Certificates & secrets* screen, and get the client ID from the *Overview* screen.

Since OpenID connect is a standard protocol built on OAuth2, your development framework is likely to have a plugin that supports it. For Laravel, the [`laravel-soa` package](https://nit-administrative-systems.github.io/SysDev-laravel-soa/) includes a Socialite driver that will work with Northwestern's Azure AD tenant out of the box.

If you cannot find an existing integration library or plugin, review [Microsoft's OpenID documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc) on how to implement the authentication flow.

When possible, you should configure applications with an additional parameter for the authorization redirect: `domain_hint=northwestern.edu`. This will skip the initial "enter your microsoft account" screen and sends the user directly to the Online Passport netID login screen.

:::warning Secret Management
For web applications, the proper OpenID auth flow requires calling the `/tokens` endpoint and using a client secret.

The client secret expires after a set period of time. Azure will **not** notify users when their secrets are about to expire, so please make a note of this expiration and migrate to a new secret before an old one expires.

Single-page apps, mobile apps, and certain other applications use other flows that do not require this secret. Please choose an appropriate flow for your type of application.
:::

To enable Duo MFA, you must submit a ticket to the Cyberinfrastructure Collab Services team. MFA can only be enabled by Azure tenant administrators, and its enabled/disabled status is not reflected in your application's configuration dashboard.

#### OpenID with an ALB
If your app is using an ALB, you can configure a listener rule that will handle OpenID authentication for all requests, before the request is passed to your app:

```hcl
resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.front_end.arn

  # . . . other config

  default_action {
    type = "authenticate-oidc"

    authenticate_oidc {
      client_id              = "your-client-id-here"
      client_secret          = "your-client-secret-here"
      authorization_endpoint = "https://login.microsoftonline.com/northwestern.edu/oauth2/v2.0/authorize"
      token_endpoint         = "https://login.microsoftonline.com/northwestern.edu/oauth2/v2.0/token"
      issuer                 = "https://login.microsoftonline.com/7d76d361-8277-4708-a477-64e8366cd1bc/v2.0"
      user_info_endpoint     = "https://graph.microsoft.com/oidc/userinfo"

      authentication_request_extra_params = {
          domain_hint = "northwestern.edu"
      }
    }
  }

  # . . . other actions
}
```

The redirect URI for the load balancer's OpenID provider is `https://<your-app-hostname>/oauth2/idpresponse`. Add this to the list of redirect URIs in the Azure AD console.

The forwarded request will include [some additional headers with auth information](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#user-claims-encoding). To obtain the netID from this, you will need to parse the JWT and pull out the `userPrincipalName` claim.

When using this approach, you should give consideration to how you will authenticate to your app when running it on your development machine.

### Enterprise Applications via SAML
Azure AD has another class of application: enterprise applications. Azure AD will serve as a SAML IdP, similar to federation.

To get started with this, you must submit a ticket to Cyberinfrastructure's Collab Services group. They must do the Azure AD-side configuration. It should otherwise be similar to [setting up federation](#federation-shibboleth).
