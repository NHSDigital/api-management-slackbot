# API Management Producer Support Slackbot

## What is this for?

This slackbot is for the purpose of sending automated messages in the platforms-apim-producer-support channel.

- The chat.postEphemeral method sends a message only visible to the message sender.
- The conversations.history method fetches a limited number of messages from the channel history and only post the response if the user has not sent a recent message.
- The Slackbot will listen to channels that it has been installed in.
  It is recommended to only install this application in the platforms-apim-producer-support channel.

## Instructions for Creating and Authenticating a Slack Application

### Creating your application

You must be an admin for your workspace to create an application.

1. Visit [Slack Apps](https://api.slack.com/apps/) and create a new app.
2. Name your app and select the NHS Digital Platforms workspace.
3. Your App can be customised in the Basic Information tab.

### Authenticating your application

1. In OAuth & Permissions Scopes must be set. When adding OAuth Scopes the following scopes must be added:

- channels:history
- im:history
- mpim:history
- chat:write

2. Install the app in your workspace.
3. In the Event Subscriptions tab toggle on 'Enable Events' and paste in your hosted endpoint. The endpoint must end with /slack/events.
4. Once this is verified save the changes.
5. On slack, in the platforms-apim-producer-support channel add the app from the channel details section.

### Setting Environment Variables

Within the hosted appliction the following environment variables must be set using the secret and token from the [Slack Apps](https://api.slack.com/apps/) page.

- SLACK_SIGNING_SECRET - Signing Secret found on the Basic Information tab.
- SLACK_BOT_TOKEN - Bot User OAuth Access Token (starting with 'xoxb') found on the OAuth & Permissions tab.
- SLACK_MESSAGE_LIMIT - Limited number of messages fetched to determine if the user has recently posted a message in the channel. Max number is 100.
