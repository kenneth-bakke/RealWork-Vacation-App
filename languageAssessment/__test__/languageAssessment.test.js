const unusedLetters = require('../unusedLetters');
const {
  animate,
  replaceCharacterAtIndex,
  copyAndReplaceWithX,
} = require('../particleChamber');

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

describe('Particle chamber', () => {
  let particleFrames, expectedFrames;
  it('replaces a character at the correct index', () => {
    const replaced = replaceCharacterAtIndex('hello', 1, 'a');
    expect(replaced).toBe('hallo');
  });

  it('creates a copy of the string with X replacing L and R', () => {
    const copy = copyAndReplaceWithX('..R..L..');
    expect(copy).toBe('..X..X..');
  });

  it('Returns an array', () => {
    const animationFrames = animate('..R....', 2);
    expect(animationFrames).toEqual(expect.arrayContaining(['..X....']));
  });

  it('Returns an array containing each appropriate frame of a single particle chamber', () => {
    particleFrames = animate('..R....', 2);
    expectedFrames = ['..X....', '....X..', '......X', '.......'];
    expect(particleFrames).toEqual(expectedFrames);
  });

  it('Returns an array containing each appropriate frame of a multiple particle chamber', () => {
    particleFrames = animate('.RR....', 2);
    expectedFrames = ['.XX....', '...XX..', '.....XX', '.......'];
    expect(particleFrames).toEqual(expectedFrames);
  });

  it('Returns an array containing each appropriate frame of a multiple particle, multi-directional chamber', () => {
    particleFrames = animate('LRLR.LRLR', 2);
    expectedFrames = ['XXXX.XXXX', 'X..X.X..X', '.X.....X.', '.........'];
    expect(particleFrames).toEqual(expectedFrames);

    particleFrames = animate('RR..LRL', 3);
    expectedFrames = ['XX..XXX', '.X.XX..', 'X.....X', '.......'];
    expect(particleFrames).toEqual(expectedFrames);
  });

  it('Returns an array containing each appropriate frame of multiple particles at a fast speed', () => {
    particleFrames = animate('RLRLRLRLRL', 10);
    expectedFrames = ['XXXXXXXXXX', '..........'];
    expect(particleFrames).toEqual(expectedFrames);
  });
});
