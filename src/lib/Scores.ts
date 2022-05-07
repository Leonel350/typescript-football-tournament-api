export function getPoints(score1: number, score2: number) {
   if (score1 === score2) {
      return 1;
   } else if (score1 > score2) {
      return 3;
   } else {
      return 0;
   }
}
export function getWon(score1: number, score2: number) {
   if (score1 > score2) {
      return 1;
   } else {
      return 0;
   }
}
export function getLost(score1: number, score2: number) {
   if (score1 < score2) {
      return 1;
   } else {
      return 0;
   }
}
export function getTied(score1: number, score2: number) {
   if (score1 === score2) {
      return 1;
   } else {
      return 0;
   }
}
