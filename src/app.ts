import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  console.log(message);
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there!`);
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();
