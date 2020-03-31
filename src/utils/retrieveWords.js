import { gameWords } from '@/firebase';

export const retrieveWords = async () => {
  try {
    const doc = await gameWords.get();

    if (!doc.exists) {
      console.error('There are no stored words. Please add some.');
      return [];
    }

    const chunks = doc.data();
    const words = [];

    Object.keys(chunks).map(chunk => {
      words.push(...chunks[chunk]);
    });

    return words;
  } catch (e) {
    console.error('There was a problem getting the words.', e);
    return [];
  }
};
