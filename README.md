# example-app-sdk

Example app using sdk for basic use

[Progress]
Create a personal project for learning. Create the project with the following requirements:
A personal Github repo. It can be private or public, if private, invite me (Justin) to it
HTTPS with self-signed certs
DNS alias within /etc/hosts
Uses a cloud platform of some kind
Write Hello, World!
Create a README that tracks your progress

At each milestone, commit your progress and link the commit to the progress statement on the README
Create the most basic username-password SPA with the following requirements:
With no JavaScript framework, just create the most basic HTML, JS and CSS SPA with no dependencies other than the Core JS SDK (no FRUI) and Twitter Bootstrap (TBS) or an equivalent for default styling
Dependencies are just imported via old-school script and style tags; just use the single, built file from the SDK repo
The app renders a basic username-password form with default styling from TBS
Upon submission of the form, plain JS catches the form submission event and uses the value off of the event target to submit them with the SDK's FRAuth to AM.

Handles a success or failure of login, rendering some kind of basic message to user
Once logged in, display a functional logout button that uses the SessionManager to logout the user
Once logged out, display the same login form from above

Add an OAuth flow to the basic username-password from above:
After successful login, use the SDK's getTokens to call an OAuth client to get access token and id token
After getting tokens, use the SDK's getUserInfo to call the userinfo endpoint
Render user info to screen
Using the logout button from the previous task, refactor to use FRUser to logout both session and OAuth tokens

- [x] Upgrade your existing project from old-school HTML and JS without any tooling or module system to a framework/tech that is MOST familiar to you:
- [x] Choose Angular, Vue, React ... whatever you're most effective in ... converting the project to a standard, convention-based (for the chosen framework) app
- [x] Leverage NPM for your dependencies and ES or Common JS module syntax
- [x] Make sure the all previous features work as expected after refactoring
- [x] Don't over-engineer it; keep it simple

- [x] Refactor your form and authentication flow to be callback driven
- [x] Change your authentication tree to include the following:
- [x] Page node with Username and Password Collector
- [x] Choice node with a "Are you human? Yes or no?" If yes, success; if no, fail
- [x] Configure the SDK at application initialization
- [x] Call AM for initial callbacks in tree before rendering login form

- [x] Render the login form components from the callback metadata
- [x] Labels from the `prompt` property
- [x] Inputs from callback type
- [x] Handle the additional step with the `ChoiceCallback` using recursion, looping, etc.: essentially, keep calling next and render form elements until you get a success or failure
- [x] Introduce a link or button that allows the user to do Centralized Login
- [x] Create a button on the page that says “Login via Platform” (essentially the user has a choice between using the embedded login, what you've already built, or with centralized login, what you will build)
- [x] Configure a new OAuth2 client in AM with “implied consent” disabled (aka enforcing consent)

- [x] The new button from above initiates the Centralized Login flow that uses the new OAuth client you just created, leveraging the standard Authorization Code Flow of the OAuth 2 standard
- [x] Ensure consent is enforced
- [x] Handle the redirect back to your app and complete the OAuth flow using the provided authorization code and state provided in the redirect URL
- [x] Ensure both flows, embedded login and centralized login, are error/bug free
