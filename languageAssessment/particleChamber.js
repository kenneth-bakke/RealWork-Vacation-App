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
  // TODO
}
