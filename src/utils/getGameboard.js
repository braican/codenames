import { retrieveWords, randomSubset, shuffleGameIndexes } from '@/utils';

export const getGameboard = async () => {
  const words = await retrieveWords();

  if (words.length === 0) {
    return false;
  }

  const gameboard = randomSubset(words, 25).map(word => ({
    word,
    owner: 'neutral',
    hidden: true,
  }));

  const shuffleKeys = shuffleGameIndexes();

  for (let index = 0; index < 18; index++) {
    const key = shuffleKeys[index];
    let owner = '';

    if (index === 0) {
      owner = 'black';
    } else if (index < 9) {
      owner = 'red';
    } else if (index === 9) {
      owner = Math.random() <= 0.5 ? 'red' : 'blue';
    } else {
      owner = 'blue';
    }

    gameboard[key].owner = owner;
  }

  return gameboard;
};
