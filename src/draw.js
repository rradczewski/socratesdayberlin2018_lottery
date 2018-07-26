function getRandomSubarray(arr, size, rng) {
  // From https://stackoverflow.com/a/11935263
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * rng.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

module.exports = (bucket, numberOfWinners, random) => {
  if (bucket.length <= numberOfWinners) return bucket;

  const result = getRandomSubarray(bucket, numberOfWinners, random);

  return result;
};
