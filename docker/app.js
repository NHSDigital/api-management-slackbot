const express = require('express');
const axios = require("axios");
const qs = require("qs");
const { createEventAdapter } = require('@slack/events-api');
const { App, LogLevel } = require("@slack/bolt");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const messageLimit = process.env.SLACK_MESSAGE_LIMIT || 100;
const slackEvents = createEventAdapter(slackSigningSecret);

const bot = new App({
  token,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG
});

const botResponses = {
    docsReminder: 'Hi there and thanks for your message. Can you please confirm that you have already looked for an answer to your question in our <https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone|*API producer zone*> by writing "I have have already looked for an answer to my question in the API producer zone." as a reply to your own question. Thanks.',
    slackInvite: 'Hi there. It looks like you\'re making a Slack Invitation request? If so please use the shortcut on this channel by clicking the lightening bolt and selecting \'Slack Invite Request\'. Please also reply to your message to let us know you\'ve seen this. Thanks.'
};

const app = express();

app.get('/_health', (req, res) => { res.send("OK") });
app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
  try {
    const { user, channel, text } = event;
    
    // SLACK INVITE REMINDER
    const formatText = text.toLowerCase();
    const keyWordsOne = ['channel', 'workspace', 'slack'];
    const keyWordsTwo = ['added', 'add', '@nhs.net'];
    const includesKeyWord = word => formatText.includes(word);

    const isSlackRequest = keyWordsOne.some(includesKeyWord) && keyWordsTwo.some(includesKeyWord);

    if (isSlackRequest) {
      const slackRequestParams = {
        token,
        channel,
        text: botResponses.slackInvite,
        user
      };
      await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(slackRequestParams));
    };

    // GENERIC DOCS REMINDER
    const isThread = event.thread_ts;
    if (isThread) return

    const result = await bot.client.conversations.history({
      token,
      channel,
      limit: messageLimit
    });
    const conversationHistory = result.messages;    
    const recentSender = conversationHistory.some((histMessage, index) => {
      return histMessage.user === user && index !== 0;
    });

    if (!recentSender) {
      const docsReminderParams = {
        token,
        channel,
        text: botResponses.docsReminder,
        user
      };
      await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(docsReminderParams));
    };

  } catch (event) {console.error(event)};
});

slackEvents.on('error', (error) => {
  console.error(error.name);
});

module.exports = app;
