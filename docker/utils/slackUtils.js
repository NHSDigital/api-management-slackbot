const axios = require("axios");
const qs = require("qs");
const { WebClient } = require('@slack/web-api');

const slackInviteReminder = async (slackConfig) => {
    const { token, channel, user, text } = slackConfig;
    
    const formatText = text.toLowerCase();
    const keyWordsOne = ['channel', 'workspace', 'slack'];
    const keyWordsTwo = ['added', 'add', '@nhs.net'];
    const includesKeyWord = word => formatText.includes(word);

    const isSlackRequest = keyWordsOne.some(includesKeyWord) && keyWordsTwo.some(includesKeyWord);

    if (isSlackRequest) {
        const slackInviteResp = 'Hi there. It looks like you\'re making a Slack Invitation request? If so please use the shortcut on this channel by clicking the lightening bolt and selecting \'Slack Invite Request\'. Please also reply to your message to let us know you\'ve seen this. Thanks.'

        const slackRequestParams = {
            token,
            channel,
            text: slackInviteResp,
            user
        };

        try {
            await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(slackRequestParams));
        } catch (error) {
            console.log(error);
        }
    };
};

const generalDocsReminder = async (slackConfig) => {
    const { token, channel, user, thread_ts } = slackConfig;
    const messageLimit = process.env.SLACK_MESSAGE_LIMIT || 50;

    if (thread_ts) return;

    const bot = new WebClient(token);

    const result = await bot.conversations.history({
      token,
      channel,
      limit: messageLimit
    });
    const conversationHistory = result.messages;    
    const recentSender = conversationHistory.some((histMessage, index) => {
      return histMessage.user === user && index !== 0;
    });

    if (!recentSender) {
        const docsReminderResp = 'Hi there and thanks for your message. Can you please confirm that you have already looked for an answer to your question in our <https://nhsd-confluence.digital.nhs.uk/display/APM/API+producer+zone|*API producer zone*> by writing "I have have already looked for an answer to my question in the API producer zone." as a reply to your own question. Thanks.';
        
        const docsReminderParams = {
            token,
            channel,
            text: docsReminderResp,
            user
        };

        try {
            await axios.post("https://slack.com/api/chat.postEphemeral", qs.stringify(docsReminderParams));
        } catch (error) {
            console.log(error);
        }
    };
};

module.exports = { slackInviteReminder, generalDocsReminder };
