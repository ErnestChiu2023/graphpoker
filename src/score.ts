import { Card, Suit, Value } from "./types";


const getRank = (value: Value) => {
  return [
    '2', '3', '4', '5', '6', '7', '8', '9', '10',
    'J', 'Q', 'K', 'A',
  ].indexOf(value);
};

const checkFlush = (hand: Card[]) => {
  return hand.every((c) => c.suit === hand[0].suit);
};

const checkStraight = (hand: Card[]) => {
  if (hand.length < 5) return false;


  // Array.prototype.sort sorts numbers lexicographically, not numerically
  // We need a custom sort function to compare numbers as numbers, not strings
  const ranks = hand.map((c) => getRank(c.value)).sort((a, b) => (a - b));
  if (ranks[0] == getRank('2') && ranks[ranks.length - 1] == getRank('A')) {
    // A,2,3,4,5 is a straight, but we have to re-rank is as a `1`
    ranks.pop();
    ranks.unshift(getRank('2') - 1);
  }

  for (let i=1; i<ranks.length; i++) {
    if (ranks[i-1] + 1 !== ranks[i]) {
      return false;
    }
  }

  return true;
};

const getGroups: (hand: Card[]) => Card[][] = (hand: Card[]) => {
  // group cards of the same value together
  const groups: Partial<Record<Value, Card[]>> = {};
  hand.forEach((c) => {
    groups[c.value] = groups[c.value] || [];
    (groups[c.value] as Card[]).push(c);
  });
  // sort by the size of the group (four-of-a-kind before pair),
  // then by the rank (K before 4)
  return Object.values(groups).sort((a, b) => {
    if (a.length > b.length) return -1;
    if (a.length < b.length) return 1;
    if (getRank(a[0].value) > getRank(b[0].value)) return -1;
    if (getRank(a[0].value) < getRank(b[0].value)) return 1;

    // impossible to have two groups with the same rank
    return 0;
  });
};

export const scoreHand: (hand: Card[]) => [number, string] = (hand: Card[]) => {
  const isFlush = checkFlush(hand);
  const isStraight = checkStraight(hand);
  const groups = getGroups(hand);

  let description = 'nothing';
  let score = 0
  if (hand.length <= 1) {
  } else if (isStraight && isFlush) {
    if (groups[0][0].value === 'A') {
      description = 'royal flush';
      score = 9;
    } else {
      description = 'straight flush';
      score = 8;
    }
  } else if (groups[0].length === 4) {
    description = 'four of a kind';
    score = 7;
  } else if (groups[0].length === 3 && groups[1]?.length === 2) {
    description = 'full house';
    score = 6;
  } else if (isFlush) {
    description = 'flush';
    score = 5;
  } else if (isStraight) {
    description = 'straight';
    score = 4;
  } else if (groups[0].length === 3) {
    description = 'three of a kind';
    score = 3;
  } else if (groups[0].length === 2 && groups[1]?.length === 2) {
    description = 'two pair';
    score = 2;
  } else if (groups[0].length === 2) {
    description = 'pair';
    score = 1;
  }
  return [score, description];
};
