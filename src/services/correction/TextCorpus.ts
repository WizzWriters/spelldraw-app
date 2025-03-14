// @ts-expect-error No type declarations for following package
import { words } from 'popular-english-words'
import { minBy } from 'lodash-es'

export default class TextCorpus {
  private words: string[]

  constructor(length: number = 100000) {
    this.words = words.getMostPopular(length)
  }

  findMostSimilar(word: string) {
    return (
      minBy(this.words, (candidate) => this.similarity(word, candidate)) || word
    )
  }

  similarity(str1: string, str2: string) {
    // Calculate Levenshtein distance in a dynamic fashion
    const m = str1.length
    const n = str2.length

    // Create a 2D array to store distances
    const dp = new Array(m + 1)
    for (let i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1)
    }

    // Initialize the base cases
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j
    }

    // Compute the distance
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1, // insertion
            dp[i - 1][j - 1] + 1 // substitution
          )
        }
      }
    }

    // Return the edit distance between the two strings
    return dp[m][n]
  }
}
