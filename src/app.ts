import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';
import { analyzeSentiment } from './sentiment';

// Load environment variables
dotenv.config();
const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

// Initializes your app with your bot token and signing secret
const app = new App({ token, signingSecret });

// Listens to all messages
app.message(/(.*?)/, async ({ message }) => {
  console.log('message received', message);

  // Analyze the sentiment of the message and continue if negative
  let sentiment = 0;
  if ('text' in message && message.text) {
    console.log('calculating sentiment...');
    console.log(`-> text: ${message.text}`);
    sentiment = await analyzeSentiment(message.text);
    console.log(`-> sentiment: ${sentiment}`);
  }
  if (sentiment >= 0) {
    return;
  }

  // Get the link to the message
  console.log('fetching permalink...');
  const permalink = await app.client.chat.getPermalink({
    token,
    channel: message.channel,
    message_ts: message.ts,
  });
  const link = permalink?.permalink;
  console.log('-> permalink received', link);

  if ('user' in message && message.user && sentiment < 0) {
    let text = 'Your message';
    if (message.channel_type === 'channel' && message.channel) {
      text += ` in <#${message.channel}>`
    }
    text += ` received a sentiment score of ${sentiment}. You might want to consider editing it. ${link}`;

    console.log(`sending direct message to user ${message.user}...`);
    const dm = await app.client.chat.postMessage({
      token,
      text,
      channel: message.user,
    });
    console.log('-> dm sent', !!dm);
  }
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log('Sentinel app is running!');
})();
