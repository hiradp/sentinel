// Imports the Google Cloud client library
import * as language from '@google-cloud/language';

export async function analyzeSentiment(text: string): Promise<number> {
  // Creates a client
  const client = new language.LanguageServiceClient();

  // Prepares a document, representing the provided text
  const document: any = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the document
  const [result] = await client.analyzeSentiment({
    document,
  });

  const sentiment = result.documentSentiment;
  if (sentiment) {
    console.log('Document sentiment:');
    console.log(`  Score: ${sentiment.score}`);
    console.log(`  Magnitude: ${sentiment.magnitude}`);
  } else {
    throw new Error('unable to analyze sentiment');
  }

  const score = sentiment.score as number;
  return Math.round((score + Number.EPSILON) * 100) / 100;
}
