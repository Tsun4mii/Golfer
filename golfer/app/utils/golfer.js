import "lodash.combinations";
import _ from "lodash";
const GENERATIONS = 30;
const RANDOM_MUTATIONS = 2;
const MAX_DESCENDANTS_TO_EXPLORE = 100;

export function* geneticSolver(
  groups,
  ofSize,
  forRounds,
  forbiddenPairs = [],
  discouragedGroups = []
) {
  const totalSize = groups * ofSize;

  function score(round, weights) {
    const groupScores = round.map((group) => {
      let groupCost = 0;
      forEachPair(group, (a, b) => (groupCost += Math.pow(weights[a][b], 2)));
      return groupCost;
    });
    return {
      groups: round,
      groupsScores: groupScores,
      total: groupScores.reduce((sum, next) => sum + next, 0),
    };
  }

  function generatePermutation() {
    const people = _.shuffle(_.range(groups * ofSize));
    return _.range(groups).map((i) =>
      _.range(ofSize).map((j) => people[i * ofSize + j])
    );
  }

  function generateMutations(candidates, weights) {
    const mutations = [];
    candidates.forEach((candidate) => {
      const scoredGroups = candidate.groups.map((g, i) => ({
        group: g,
        score: candidate.groupsScores[i],
      }));
      const sortedScoredGroups = _.sortBy(
        scoredGroups,
        (sg) => sg.score
      ).reverse();
      const sorted = sortedScoredGroups.map((ssg) => ssg.group);

      mutations.push(candidate);

      for (let i = 0; i < ofSize; i++) {
        for (let j = ofSize; j < totalSize; j++) {
          mutations.push(score(swap(sorted, i, j), weights));
        }
      }

      for (let i = 0; i < RANDOM_MUTATIONS; i++) {
        mutations.push(score(generatePermutation(), weights));
      }
    });
    return mutations;
  }

  function swap(groups, i, j) {
    const copy = groups.map((group) => group.slice());
    copy[Math.floor(i / ofSize)][i % ofSize] =
      groups[Math.floor(j / ofSize)][j % ofSize];
    copy[Math.floor(j / ofSize)][j % ofSize] =
      groups[Math.floor(i / ofSize)][i % ofSize];
    return copy;
  }

  function updateWeights(round, weights) {
    for (const group of round) {
      forEachPair(group, (a, b) => {
        weights[a][b] = weights[b][a] = weights[a][b] + 1;
      });
    }
  }

  const weights = _.range(totalSize).map(() => _.range(totalSize).fill(0));

  forbiddenPairs.forEach((group) => {
    forEachPair(group, (a, b) => {
      if (a >= totalSize || b >= totalSize) return;
      weights[a][b] = weights[b][a] = Infinity;
    });
  });

  discouragedGroups.forEach((group) => {
    forEachPair(group, (a, b) => {
      if (a >= totalSize || b >= totalSize) return;
      weights[a][b] = weights[b][a] = weights[a][b] + 1;
    });
  });

  const rounds = [];
  const roundScores = [];

  for (let round = 0; round < forRounds; round++) {
    let topOptions = _.range(5).map(() =>
      score(generatePermutation(), weights)
    );
    let generation = 0;
    while (generation < GENERATIONS && topOptions[0].total > 0) {
      const candidates = generateMutations(topOptions, weights);
      let sorted = _.sortBy(candidates, (c) => c.total);
      const bestScore = sorted[0].total;
      topOptions = sorted.slice(
        0,
        sorted.findIndex((opt) => opt.total > bestScore)
      );
      topOptions = _.shuffle(topOptions).slice(0, MAX_DESCENDANTS_TO_EXPLORE);
      generation++;
    }
    const bestOption = topOptions[0];
    rounds.push(bestOption.groups);
    roundScores.push(bestOption.total);
    updateWeights(bestOption.groups, weights);

    yield {
      rounds,
      roundScores,
      weights,
      done: round + 1 >= forRounds,
    };
  }
}

function forEachPair(array, callback) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      callback(array[i], array[j]);
    }
  }
}
