const app = require('express')();
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const slackEvents = createEventAdapter(slackSigningSecret);
const { WebClient } = require('@slack/web-api');
const bot = new WebClient(token);
const { slackInviteReminder, generalDocsReminder } = require('./utils/slackUtils');

app.get('/_health', (req, res) => { res.send({ msg:"OK" }) });
app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
  try {
    const { user, channel, text } = event;
    
    console.log('Recieved an event - ', event);
    
    slackInviteReminder({token, user, channel, text});

    const thread_ts = event.thread_ts
    generalDocsReminder({token, user, channel, thread_ts, bot});
  } catch (error) {
    console.log(error);
  }
});

slackEvents.on('error', (error) => {
  console.log(error);
});

module.exports = app;
