import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';
import { analyzeSentiment } from './sentiment';

// Load environment variables
dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listens to all messages
app.message(/(.*?)/, async ({ message, say }) => {
  const body = message as any;
  console.log(`text: ${body.text}`);
  const sentiment = await analyzeSentiment(body.text);
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there! - ${sentiment}`);
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();
