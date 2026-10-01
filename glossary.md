### Core N-Gram and Language Modeling Terms

**N-Gram**: A contiguous sequence of N items (typically words or tokens) from a given text. For example, "the cat" is a bigram (N=2).

**Unigram**: An N-Gram where N=1; a single word or token.

**Bigram**: An N-Gram where N=2; a sequence of two consecutive words or tokens.

**Trigram**: An N-Gram where N=3; a sequence of three consecutive words or tokens.

**Markov Assumption**: The simplifying assumption that the probability of a word depends only on the previous (N-1) words, not the entire sentence history.

**Language Model**: A statistical model that assigns probabilities to sequences of words, often using N-Gram statistics.

**Corpus**: A large and structured set of texts used for building N-Gram models.

**Probability Table (N-Gram Table)**: A lookup table containing the probabilities or counts of N-Gram sequences in a corpus.

**Smoothing**: Techniques used to handle zero probabilities for unseen N-Grams by assigning them small nonzero probabilities.

**Data Sparsity**: The problem that arises when many possible N-Grams do not appear in the training corpus, making probability estimation difficult.

**Context Window**: The number of previous words considered when predicting the next word (N-1 for an N-Gram model).

**Start/End Tokens**: Special tokens (e.g., <s>, </s>, (eos)) used to mark the beginning and end of sentences in N-Gram modeling.

### Related Concepts

**Chain Rule**: A rule in probability theory used to decompose the probability of a sequence into conditional probabilities.

**Smoothing Techniques**: Methods like Laplace smoothing, Good-Turing discounting, and backoff models used to improve N-Gram probability estimates.
