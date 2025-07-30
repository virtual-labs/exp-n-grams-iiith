N-Gram models are fundamental tools in Natural Language Processing (NLP) for modeling the probability of word sequences. They help us understand and generate language by assigning probabilities to strings of words, making it possible to distinguish between likely and unlikely sentences.

---

### 1. What is an N-Gram?

An **N-Gram** is a contiguous sequence of N items (typically words or tokens) from a given text. For example:

- **Unigram (N=1):** "I", "read", "books"
- **Bigram (N=2):** "I read", "read books"
- **Trigram (N=3):** "I read books"

---

### 2. The Markov Assumption

Calculating the probability of a sentence by considering all possible word dependencies is computationally expensive. The **Markov assumption** simplifies this by stating that the probability of a word depends only on the previous (N-1) words:

> **P(w₁, w₂, ..., wₙ) ≈ Π P(wᵢ | wᵢ₋₁, ..., wᵢ₋₍ₙ₋₁₎)**

For a bigram model (N=2):

> **P(w₁, w₂, ..., wₙ) ≈ P(w₁) × P(w₂|w₁) × P(w₃|w₂) × ... × P(wₙ|wₙ₋₁)**

---

### 3. Building an N-Gram Table

To estimate these probabilities, we count how often word sequences occur in a corpus. For example, a bigram table for the corpus:

> (eos) You book a flight (eos) I read a book (eos) You read (eos)

Might look like:

|        | (eos) | you  | book | a   | flight | I    | read |
| ------ | ----- | ---- | ---- | --- | ------ | ---- | ---- |
| (eos)  | 0     | 0.33 | 0    | 0   | 0      | 0.25 | 0    |
| you    | 0     | 0    | 0.5  | 0   | 0      | 0    | 0.5  |
| book   | 0.5   | 0    | 0    | 0.5 | 0      | 0    | 0    |
| a      | 0     | 0    | 0.5  | 0   | 0.5    | 0    | 0    |
| flight | 1     | 0    | 0    | 0   | 0      | 0    | 0    |
| I      | 0     | 0    | 0    | 0   | 0      | 0    | 1    |
| read   | 0.5   | 0    | 0    | 0.5 | 0      | 0    | 0    |

---

### 4. Calculating Sentence Probability

To calculate the probability of a sentence using a bigram model:

> **P((eos) you read a book (eos)) = P(you|eos) × P(read|you) × P(a|read) × P(book|a) × P(eos|book)**

For the example above:

> 0.33 × 0.5 × 0.5 × 0.5 × 0.5 = 0.020625

---

### 5. Applications and Limitations

- **Applications:** Language modeling, speech recognition, spelling correction, text prediction.
- **Limitations:** Data sparsity, inability to capture long-range dependencies, zero probabilities for unseen N-Grams (solved by smoothing techniques).

---

N-Gram models provide a simple yet powerful way to model language, forming the basis for many NLP applications and more advanced models.
