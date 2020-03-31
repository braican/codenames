/**
 * Randomly get a subset of values from an array.
 * @param  {array} arr   The array to shuffle.
 * @param  {int}   count The number of random items to get.
 * @return {array}       The random array.
 */
export const randomSubset = (arr, count = 1) => {
  const sourceArray = [...arr];
  const randomArray = [];

  for (let index = 0; index < count; index++) {
    const randIndex = Math.floor(Math.random() * sourceArray.length);
    const rand = sourceArray.splice(randIndex, 1);
    randomArray.push(rand[0]);
  }

  return randomArray;
};
