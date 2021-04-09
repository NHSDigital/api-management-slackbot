const axios = require("axios");
const qs = require("qs");

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

const generalDocsReminder = () => {};

module.exports = { slackInviteReminder, generalDocsReminder };
