export const shuffleGameIndexes = (length = 25) => {
  const array = [...Array(length).keys()];
  for (
    var j, x, i = length;
    i;
    j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x
  );
  return array;
};
