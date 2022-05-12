/**
 * We are writing a simulation of a particle chamber where individual particles
 * are leaving the chamber at constant speed.
 *
 * Implement the method 'animate' that takes an initial position, and a speed
 * that returns an array of strings that represents the number of positions that
 * each particle travels in a given step.
 *
 * The input string will include either '.', 'L', or 'R'
 *
 * '.' represents an empty position
 * 'R' represents a particle at that position that is traveling to the right
 * 'L' represents a particle at that position that is traveling to the left
 *
 * Examples:
 * Input ('..R....', 2)
 * Output ['..X....', '....X..', '......X', '.......'];
 *
 * Input ('RR..LRL', 3)
 * Output ['XX..XXX', '.X.XX..', 'X.....X', '.......']
 *
 * Input ('LRLR.LRLR', 2)
 * Output ['XXXX.XXXX', 'X..X.X..X', '.X.....X.', '.........']
 *
 * Input('RLRLRLRLRL', 10)
 * Output ['XXXXXXXXXX', '..........']
 *
 */

/**
 * @param {string} initialPosition
 * @param {number} speed
 * @return {string[]}
 *
 */

function animate(initialPosition, speed) {
  if (!initialPosition || !speed) return initialPosition;
  const animationFrames = [copyAndReplaceWithX(initialPosition)];
  let chamberCopy = initialPosition.split('');
  let chamberContainsParticles = true;

  while (chamberContainsParticles) {
    let nextChamber = new Array(chamberCopy.length).fill('.');


    for (let i = 0; i < chamberCopy.length; i++) {
      const currentChar = chamberCopy[i];
      const nextRightIndex = i + speed;
      const nextLeftIndex = i - speed;


      if (currentChar === '.') {
        continue;
      } else if (currentChar === 'R') {
        if (nextRightIndex <= chamberCopy.length - 1) {
          if (nextChamber[nextRightIndex] === 'L') {
            nextChamber[nextRightIndex] = 'B';
          } else {
            nextChamber[nextRightIndex] = 'R';
          }
        }
      } else if (currentChar === 'L') {
        if (nextLeftIndex >= 0) {
          if (nextChamber[nextLeftIndex] === 'R') {
            nextChamber[nextLeftIndex] = 'B';
          } else {
            nextChamber[nextLeftIndex] = 'L';
          }
        }
      } else if (currentChar === 'B') {
        if (nextLeftIndex >= 0) {
          if (nextChamber[nextLeftIndex] === 'R') {
            nextChamber[nextLeftIndex] = 'B';
          } else {
            nextChamber[nextLeftIndex] = 'L';
          }
        }

        if (nextRightIndex <= chamberCopy.length - 1) {
          if (nextChamber[nextRightIndex] === 'L') {
            nextChamber[nextRightIndex] = 'B';
          } else {
            nextChamber[nextRightIndex] = 'R';
          }
        }
      }
    }

    chamberCopy = nextChamber;
    animationFrames.push(copyAndReplaceWithX(nextChamber.join('')));
    if (chamberIsEmpty(nextChamber)) {
      chamberContainsParticles = false;
    }
  }

  return animationFrames;
}

function chamberIsEmpty(iterable) {
  for (let i = 0; i < iterable.length; i++) {
    if (iterable[i] !== '.') {
      return false;
    }
  }
  return true;
}

function copyAndReplaceWithX(string) {
  let newString = [];
  for (let i = 0; i < string.length; i++) {
    if (string[i] === 'R' || string[i] === 'L' || string[i] === 'B') {
      newString.push('X');
    } else {
      newString.push('.');
    }
  }
  return newString.join('');
}

function replaceCharacterAtIndex(string, index, char) {
  if (index < 0 || index > string.length - 1) return string;
  return string.substring(0, index) + char + string.substring(index + 1);
}

const animationFrames = animate('..R....', 2);

module.exports = {
  copyAndReplaceWithX: copyAndReplaceWithX,
  replaceCharacterAtIndex: replaceCharacterAtIndex,
  animate: animate,
};
