import re
from collections import defaultdict

# Copy your corpus sentences here (all lines before the &probabilities& line)
corpus = '''
तुम कार बुक करो (eos)
मैं किताब पढ़ूँगा (eos)
किताब मेरी है (eos)
किताब मेरी है और मैं पढ़ूँगा (eos)
पढ़ूँगा मैं किताब (eos)
मेरी किताब है (eos)
किताब है मेरी (eos)
मैं किताब पढ़ूँगा, मेरी कार है (eos)
किताब है मेरी कार (eos)
पढ़ूँगा किताब है (eos)
किताब मेरी पढ़ूँगा (eos)
है मेरी किताब (eos)
तुम किताब पढ़ूँगा (eos)
किताब पढ़ूँगा मेरी (eos)
पढ़ूँगा मेरी कार (eos)
मेरी कार बुक (eos)
कार बुक करो (eos)
बुक करो मैं (eos)
करो मैं किताब (eos)
मैं किताब है (eos)
मेरी किताब पढ़ूँगा (eos)
किताब पढ़ूँगा तुम (eos)
पढ़ूँगा तुम कार (eos)
कार किताब है (eos)
किताब है करो (eos)
'''.replace('\n', ' ')

order = ["(eos)", "तुम", "कार", "बुक", "करो", "मैं", "किताब", "पढ़ूँगा", "मेरी", "है"]

# Count bigram transitions
bigram_counts = defaultdict(lambda: defaultdict(int))
for sentence in re.split(r'\(eos\)', corpus):
    words = [w.strip() for w in sentence.split() if w.strip()]
    words.append("(eos)")
    for i in range(len(words)-1):
        bigram_counts[words[i]][words[i+1]] += 1

# Calculate probabilities
probabilities = []
for w1 in order:
    total = sum(bigram_counts[w1].values())
    for w2 in order:
        prob = bigram_counts[w1][w2] / total if total > 0 else 0
        probabilities.append(str(round(prob, 3)))

print("&" + ",".join(probabilities) + "&")