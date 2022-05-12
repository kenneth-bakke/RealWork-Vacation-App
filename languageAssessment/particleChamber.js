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
    let nextPosition = new Array(chamberCopy.length).fill('.');

    for (let i = 0; i < chamberCopy.length; i++) {
      let nextRightIndex = i + speed;
      let nextLeftIndex = i - speed;

      if (chamberCopy[i] === 'R') {
        if (
          chamberCopy[nextRightIndex] === '.' ||
          chamberCopy[nextRightIndex] === 'R'
        ) {
          nextPosition[i] = '.';
          nextPosition[nextRightIndex] = 'R';
        } else if (chamberCopy[nextRightIndex] === 'L') {
          nextPosition[i] = 'L';
          nextPosition[nextRightIndex] = 'R';
        } else {
          if (nextRightIndex >= chamberCopy.length) {
            if (nextPosition[i] === 'R' || nextPosition[i] === 'L') {
              continue;
            } else {
              nextPosition[i] = '.';
            }
          }
        }
      } else if (chamberCopy[i] === 'L') {
        if (
          chamberCopy[nextLeftIndex] === '.' ||
          chamberCopy[nextLeftIndex] === 'L'
        ) {
          nextPosition[nextLeftIndex] = 'L';
          if (nextPosition[i] === 'R') {
            continue;
          } else {
            nextPosition[i] = '.';
          }
        } else if (chamberCopy[nextLeftIndex] === 'R') {
          nextPosition[i] = 'R';
          nextPosition[nextLeftIndex] = 'L';
        } else {
          if (nextLeftIndex <= 0) {
            if (nextPosition[i] === 'R' || nextPosition[i] === 'L') {
              continue;
            } else {
              nextPosition[i] === '.';
            }
          }
        }
      } else {
        if (nextPosition[i] === 'R' || nextPosition[i] === 'L') {
          continue;
        } else {
          nextPosition[i] = '.';
        }
      }
    }

    chamberCopy = nextPosition;
    animationFrames.push(copyAndReplaceWithX(nextPosition.join('')));
    if (chamberIsEmpty(nextPosition)) {
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
    if (string[i] === 'R' || string[i] === 'L') {
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
