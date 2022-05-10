/**
 * Given a string of English letters, write a function that
 * returns all letters of the alphabet that are unused.
 *
 * For example
 * Input: 'A slow yellow fox crawls under the proactive dog'
 * Output: 'bjkmqz'
 *
 * All of the letters in the output can't be found in the input string
 *
 * Input: 'A quick brown fox jumps over the lazy dog'
 * Output: ''
 *
 * All english letters are in the sentence
 */

var alphabet = 'abcdefghijklmnopqrstuvwxyz';

function unusedLetters(string) {
  if (!string) return '';

  const missingLetters = [];
  const stringCopy = string.toLowerCase();

  for (let i = 0; i < alphabet.length; i++) {
    if (stringCopy.indexOf(alphabet[i]) < 0) {
      missingLetters.push(alphabet[i]);
    }
  }

  return missingLetters.join('');
}

module.exports = unusedLetters;
