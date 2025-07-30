// --- Instructions Panel Collapse/Expand Logic (Word Analysis Style) ---
function setupInstructionsPanel() {
  const header = document.querySelector(".instructions-header");
  const content = document.querySelector(".instructions-content");
  if (!header || !content) return;
  // Only one arrow, always ▼, rotation handled by CSS
  const arrow = header.querySelector(".arrow-icon");
  if (content.classList.contains("collapsed")) {
    header.classList.add("collapsed");
  } else {
    header.classList.remove("collapsed");
  }
  header.addEventListener("click", function () {
    const collapsed = content.classList.toggle("collapsed");
    if (collapsed) {
      header.classList.add("collapsed");
    } else {
      header.classList.remove("collapsed");
    }
  });
}

// Call setupInstructionsPanel on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  setupInstructionsPanel();
});
class CorpusManager {
  constructor() {
    this.corpusFiles = [
      { name: "English Corpus", file: "corpus-english.txt" },
      { name: "Hindi Corpus", file: "corpus-hindi.txt" },
    ];
    this.selectedCorpus = null;
    this.corpusData = null;
  }

  populateDropdown() {
    const select = document.getElementById("corpus");
    select.innerHTML = '<option value="">Select Corpus...</option>';
    this.corpusFiles.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.file;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
    select.disabled = false;
  }

  async loadCorpus(file) {
    // Clear outputs first
    var outputTable = document.getElementById("output-table-container");
    if (outputTable) outputTable.innerHTML = "";
    var btnRow = document.querySelector(".button-container");
    if (btnRow) btnRow.innerHTML = "";
    var feedbackDiv = document.getElementById("feedback");
    if (feedbackDiv) feedbackDiv.innerHTML = "";
    var answerDiv = document.getElementById("answerContainer");
    if (answerDiv) answerDiv.innerHTML = "";

    // Left pane: corpus sentences and button
    const sentencesDiv = document.getElementById("corpus-sentences");
    let btnContainer = document.getElementById("find-bigram-btn-container");
    sentencesDiv.innerHTML = '<div class="loading">Loading corpus...</div>';
    if (!btnContainer) {
      // Fallback: create container if missing
      btnContainer = document.createElement("div");
      btnContainer.id = "find-bigram-btn-container";
      btnContainer.className = "button-container";
      sentencesDiv.parentNode.insertBefore(
        btnContainer,
        sentencesDiv.nextSibling
      );
    }
    btnContainer.innerHTML = "";
    btnContainer.style.display = "flex";
    btnContainer.style.justifyContent = "center";
    btnContainer.style.visibility = "visible";
    this.corpusData = null;
    try {
      if (file.endsWith(".jpg") || file.endsWith(".png")) {
        sentencesDiv.innerHTML = `<img src="/data/corpora/${file}" alt="${file}" style="max-width:100%;" />`;
      } else {
        const response = await fetch(`data/corpora/${file}`);
        // const response = await fetch(`simulation/data/corpora/${file}`);
        if (!response.ok) throw new Error("File not found");
        const text = await response.text();
        // Expecting corpus, bigrams, order separated by '&' (as in PHP)
        const parts = text.split("&");
        const corpus = parts[0] ? parts[0].trim() : "";
        const bigrams = parts[1] ? parts[1].trim() : "";
        const order = parts[2] ? parts[2].trim() : "";
        this.corpusData = { corpus, bigrams, order };
        // Improved sentence display: split on (eos) and show each sentence separately
        const sentences = corpus
          .split("(eos)")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        let html = '<div class="corpus-content">';
        sentences.forEach((sentence) => {
          html += `<div class="corpus-sentence">${sentence}</div>`;
        });
        html += "</div>";
        if (sentencesDiv) sentencesDiv.innerHTML = html;
      }
    } catch (err) {
      if (sentencesDiv)
        sentencesDiv.innerHTML = `<div class="error">Error loading corpus: ${err.message}</div>`;
    }
    // Always render the button for debugging
    if (btnContainer) {
      btnContainer.innerHTML = `<button id="bigramBtn" class="sim-button btn-primary" style="display:inline-block;">Find Bigram Probabilities</button>`;
      btnContainer.style.display = "block";
      btnContainer.style.visibility = "visible";
      btnContainer.style.background = "#f9f9ff";
      btnContainer.style.border = "1px solid #e2e8f0";
      btnContainer.style.minHeight = "48px";
      const bigramBtn = document.getElementById("bigramBtn");
      if (bigramBtn) bigramBtn.onclick = () => this.renderBigramTable();
    }
  }

  renderBigramTable() {
    if (!this.corpusData || !this.corpusData.bigrams || !this.corpusData.order)
      return;
    const bigrams = this.corpusData.bigrams.split(",");
    const order = this.corpusData.order.split(",");
    const size = order.length;
    const count = size * size;
    let tableHtml =
      '<table class="ngram-table" cellspacing="-2" cellpadding="4" border="1" style="text-align:center;width:100%;max-width:100%;background:#fff;"><tr><th></th>';
    for (let i = 0; i < size; i++) {
      tableHtml += `<th>${order[i]}</th>`;
    }
    tableHtml += "</tr>";
    let idx = 0;
    for (let k = 0; k < size; k++) {
      tableHtml += `<tr><th>${order[k]}</th>`;
      for (let j = 0; j < size; j++) {
        tableHtml += `<td id="td${idx}"><input type="text" size="3" name="${idx}" id="${idx}" value="0" class="ngram-input" style="background:#fff;width:48px;"/></td>`;
        idx++;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</table>";
    tableHtml += `<div class="button-row" style="display:flex;justify-content:center;gap:12px;width:100%;max-width:100%;margin:0 auto;">
      <button id="submitBigram" class="sim-button btn-primary" style="min-width:120px;">Check</button>
      <button id="showAnswerBtn" class="sim-button btn-secondary" style="min-width:120px;">Show Answer</button>
      <button id="resetBtn" class="sim-button btn-secondary" style="min-width:120px;">Reset</button>
    </div>`;
    tableHtml += `<div id="answerContainer" style="flex:1"></div><div id="sentence"></div>`;
    const outputTable = document.getElementById("output-table-container");
    if (outputTable) {
      outputTable.innerHTML = tableHtml;
      outputTable.style.display = "block";
      outputTable.style.visibility = "visible";
      outputTable.style.height = "auto";
      outputTable.style.width = "100%";
      outputTable.style.maxWidth = "100%";
    }
    document.getElementById("submitBigram").onclick = () =>
      this.checkBigramAnswers(bigrams, count);
    document.getElementById("showAnswerBtn").onclick = () =>
      this.showBigramAnswers(bigrams, idx);
    document.getElementById("resetBtn").onclick = () => this.resetSimulation();
  }
  checkBigramAnswers(bigrams, count) {
    let userAns = [];
    const corAns = bigrams.map((x) => parseFloat(x));
    let allCorrect = true;
    const EPSILON = 1e-6;
    for (let i = 0; i < count; i++) {
      const val = parseFloat(document.getElementById(i).value);
      userAns[i] = val;
      if (Math.abs(val - corAns[i]) >= EPSILON) {
        document.getElementById("td" + i).style.backgroundColor = "#e53935"; // red
        document.getElementById("td" + i).style.color = "#fff";
        document.getElementById("td" + i).style.fontWeight = "bold";
        document.getElementById(
          "td" + i
        ).innerHTML = `<input type="text" size="3" name="${i}" id="${i}" value="${val}" class="ngram-input" style="background:transparent;border:none;color:#fff;font-weight:bold;width:48px;text-align:center;"/>`;
        allCorrect = false;
      } else {
        document.getElementById("td" + i).style.backgroundColor = "#43a047"; // green
        document.getElementById("td" + i).style.color = "#fff";
        document.getElementById("td" + i).style.fontWeight = "bold";
        document.getElementById(
          "td" + i
        ).innerHTML = `<input type="text" size="3" name="${i}" id="${i}" value="${val}" class="ngram-input" style="background:transparent;border:none;color:#fff;font-weight:bold;width:48px;text-align:center;"/>`;
      }
    }
    if (allCorrect) {
      document.getElementById("sentence").innerHTML =
        "<b>All answers are correct!</b>";
    } else {
      document.getElementById("sentence").innerHTML = "";
    }
  }

  showBigramAnswers(bigrams, count) {
    // Show correct answers in a table matching the bigram table
    const order = this.corpusData.order.split(",");
    const size = order.length;
    let idx = 0;
    let html =
      '<table border="1" cellpadding="4" style="text-align:center;width:100%;max-width:100%;margin:0 auto;">';
    html += "<tr><th></th>";
    for (let i = 0; i < size; i++) {
      html += `<th>${order[i]}</th>`;
    }
    html += "</tr>";
    for (let k = 0; k < size; k++) {
      html += `<tr><th>${order[k]}</th>`;
      for (let j = 0; j < size; j++) {
        let val = bigrams[idx];
        // Always show 0 for missing/empty bigram values
        html += `<td>${
          val !== undefined && val !== null && val !== "" ? val : 0
        }</td>`;
        idx++;
      }
      html += "</tr>";
    }
    html += "</table>";
    // Hide feedback only
    const feedbackDiv = document.getElementById("feedback");
    if (feedbackDiv) feedbackDiv.innerHTML = "";
    // Only show answer table
    document.getElementById("answerContainer").innerHTML = html;
  }

  resetSimulation() {
    // Reset everything to initial state
    document.getElementById("corpus").selectedIndex = 0;
    document.getElementById("corpus-sentences").innerHTML = "";
    document.getElementById("find-bigram-btn-container").innerHTML = "";
    document.getElementById("output-table-container").innerHTML = "";
    document.querySelector(".button-container").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    const answerDiv = document.getElementById("answerContainer");
    if (answerDiv) answerDiv.innerHTML = "";
  }
}

const corpusManager = new CorpusManager();

document.addEventListener("DOMContentLoaded", () => {
  corpusManager.populateDropdown();
  document.getElementById("corpus").addEventListener("change", (e) => {
    const file = e.target.value;
    if (file) corpusManager.loadCorpus(file);
    else {
      document.getElementById("corpus-sentences").innerHTML = "";
      document.getElementById("find-bigram-btn-container").innerHTML = "";
      document.getElementById("output-table-container").innerHTML = "";
      document.querySelector(".button-container").innerHTML = "";
      document.getElementById("feedback").innerHTML = "";
    }
  });
});
