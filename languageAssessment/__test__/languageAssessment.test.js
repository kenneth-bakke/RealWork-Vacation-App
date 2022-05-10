const unusedLetters = require('../unusedLetters');

describe('Unused letters', () => {
  it('Returns a string', () => {
    expect(typeof unusedLetters('This is a test string')).toBe('string');
  });

  it('Filters out the correct letters', () => {
    let unused = unusedLetters(
      'A slow yellow fox crawls under the proactive dog'
    );
    expect(unused).toBe('bjkmqz');
  });

  it('Returns an empty string when input string uses all letters', () => {
    let unused = unusedLetters('A quick brown fox jumps over the lazy dog');
    expect(unused).toBe('');
  });

  it('Returns an empty string when input string is empty', () => {
    let unused = unusedLetters('');
    expect(unused).toBe('');
  });
});

describe('Particle chamber', () => {});
