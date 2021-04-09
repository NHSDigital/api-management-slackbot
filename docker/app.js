const app = require('express')();
const { createEventAdapter } = require('@slack/events-api');
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const slackEvents = createEventAdapter(slackSigningSecret);
const { slackInviteReminder, generalDocsReminder } = require('./utils/slackUtils');

app.get('/_health', (req, res) => { res.send({ msg:"OK" }) });
app.use('/slack/events', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
    const { user, channel, text, thread_ts } = event;
    
    slackInviteReminder({token, user, channel, text});

    generalDocsReminder({token, user, channel, thread_ts});
});

slackEvents.on('error', (error) => {
  console.error(error.name);
});

module.exports = app;
