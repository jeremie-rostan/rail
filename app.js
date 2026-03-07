const SECTION_CONFIG = {
  incidents: {
    start: "AI-Based Incidents: Categories and Examples",
    end: "AI-Based Incident: Prevention, Response and Consequences"
  },
  response: {
    start: "AI-Based Incident: Prevention, Response and Consequences",
    end: "EU AI Act Alignment"
  },
  eu: {
    start: "EU AI Act Alignment",
    end: "ISP Digital Citizenship Curriculum Map"
  },
  curriculum: {
    start: "ISP Digital Citizenship Curriculum Map",
    end: null
  },
  full: {
    start: null,
    end: null
  }
};

const pageType = document.body.dataset.page;
const contentRoot = document.querySelector("#doc-content");
const status = document.querySelector("#status");
const jumpList = document.querySelector("#jump-list");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector("#clear-btn");
const gradeFilter = document.querySelector("#grade-filter");
const unitFilter = document.querySelector("#unit-filter");
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

let activeMarks = [];
let sourceDoc = null;

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

function setStatus(message) {
  if (status) status.textContent = message;
}

function removeMarks() {
  activeMarks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
  activeMarks = [];
}

function markInNode(node, regex) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.trim()) {
      textNodes.push(walker.currentNode);
    }
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    regex.lastIndex = 0;
    if (!regex.test(text)) return;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      const start = match.index;
      const end = start + match[0].length;
      frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      const mark = document.createElement("mark");
      mark.className = "search-hit";
      mark.textContent = text.slice(start, end);
      activeMarks.push(mark);
      frag.appendChild(mark);
      lastIndex = end;
    }
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function cloneRange(nodes, startText, endText) {
  if (!startText && !endText) return nodes.map((n) => n.cloneNode(true));

  let inRange = false;
  const collected = [];
  for (const node of nodes) {
    const text = (node.textContent || "").trim();
    if (!inRange && startText && text.includes(startText)) {
      inRange = true;
    }

    if (inRange || (!startText && !endText)) {
      collected.push(node.cloneNode(true));
    }

    if (inRange && endText && text.includes(endText) && !text.includes(startText)) {
      collected.pop();
      break;
    }
  }

  return collected;
}

function tidyContent(root) {
  root.querySelectorAll("style, meta, title").forEach((el) => el.remove());

  const nodes = root.querySelectorAll("p, li");
  nodes.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) {
      if (el.tagName.toLowerCase() === "p") {
        el.remove();
      }
      return;
    }

    if (
      /^AI-Based Incidents: Categories and Examples$/i.test(text) ||
      /^ISP Digital Citizenship Curriculum Map$/i.test(text)
    ) {
      el.tagName.toLowerCase() === "p" && el.classList.add("doc-heading");
    }
  });

  // Remove repeated consecutive lines (for example, duplicated section titles from DOCX export).
  let prev = null;
  Array.from(root.querySelectorAll("p, li, td, th")).forEach((el) => {
    const text = (el.textContent || "").trim().replace(/\s+/g, " ");
    if (!text) return;
    if (prev && prev === text) {
      el.remove();
      return;
    }
    prev = text;
  });
}

function removeLeadingStartTitle(root, startText) {
  if (!startText) return;
  const nodes = Array.from(root.querySelectorAll("p, li, td, th"));
  for (const el of nodes) {
    const text = (el.textContent || "").trim().replace(/\s+/g, " ");
    if (!text) continue;
    if (text === startText) {
      el.remove();
      continue;
    }
    break;
  }
}

function buildJumpLinks() {
  if (!jumpList || !contentRoot) return;
  jumpList.innerHTML = "";

  const candidates = Array.from(contentRoot.querySelectorAll("p, td, th"));
  const seen = new Set();

  candidates.forEach((el, idx) => {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    const isUseful =
      /^Unit\s+[1-5]:/i.test(text) ||
      /AI-Based Incident/i.test(text) ||
      /EU AI Act Alignment/i.test(text) ||
      /Prohibited AI Practices/i.test(text) ||
      /High-Risk AI Systems/i.test(text) ||
      /Grades?\s+\d/i.test(text);

    if (!isUseful || seen.has(text) || text.length > 120) return;
    seen.add(text);

    const id = `jump-${idx}`;
    el.id = id;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = text;
    li.appendChild(a);
    jumpList.appendChild(li);
  });
}

function attachCurriculumFilters() {
  if (pageType !== "curriculum") return;
  if (!gradeFilter || !unitFilter || !contentRoot) return;

  const rows = Array.from(contentRoot.querySelectorAll("table tr"));
  if (!rows.length) return;

  const applyFilters = () => {
    const gradeValue = gradeFilter.value;
    const unitValue = unitFilter.value;

    rows.forEach((row, idx) => {
      if (idx === 0) {
        row.style.display = "";
        return;
      }

      const text = row.textContent;
      const gradeMatch = !gradeValue || text.includes(gradeValue);
      const unitMatch = !unitValue || text.includes(unitValue);
      row.style.display = gradeMatch && unitMatch ? "" : "none";
    });
  };

  gradeFilter.addEventListener("change", applyFilters);
  unitFilter.addEventListener("change", applyFilters);
}

function attachSearch() {
  if (!searchBtn || !searchInput || !contentRoot) return;

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    removeMarks();

    if (!query) {
      setStatus("Type a keyword to highlight matches on this page.");
      return;
    }

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    markInNode(contentRoot, regex);

    if (!activeMarks.length) {
      setStatus(`No matches found for "${query}".`);
      return;
    }

    setStatus(`${activeMarks.length} match(es) highlighted for "${query}".`);
    activeMarks[0].scrollIntoView({ behavior: "smooth", block: "center" });
  });

  clearBtn?.addEventListener("click", () => {
    removeMarks();
    searchInput.value = "";
    setStatus("Highlights cleared.");
  });
}

async function loadSourceDoc() {
  const res = await fetch("./source.html");
  if (!res.ok) throw new Error(`Failed to load source document: ${res.status}`);
  const html = await res.text();
  const parser = new DOMParser();
  sourceDoc = parser.parseFromString(html, "text/html");
}

async function renderPage() {
  if (!contentRoot || !pageType) return;
  setStatus("Loading document content...");

  await loadSourceDoc();

  const config = SECTION_CONFIG[pageType] || SECTION_CONFIG.full;
  const bodyNodes = Array.from(sourceDoc.body.children);
  const fragmentNodes = cloneRange(bodyNodes, config.start, config.end);

  if (!fragmentNodes.length) {
    setStatus("No section content was found for this page.");
    return;
  }

  const fragment = document.createDocumentFragment();
  fragmentNodes.forEach((n) => fragment.appendChild(n));
  contentRoot.innerHTML = "";
  contentRoot.appendChild(fragment);

  tidyContent(contentRoot);
  if (pageType !== "full") {
    removeLeadingStartTitle(contentRoot, config.start);
  }
  buildJumpLinks();
  attachSearch();
  attachCurriculumFilters();

  const count = contentRoot.querySelectorAll("p, li, tr").length;
  setStatus(`Loaded ${count} content elements from the original document.`);
}

renderPage().catch((err) => {
  setStatus("Could not load source document. Please run with a local web server.");
  if (contentRoot) {
    contentRoot.innerHTML = `<p>${err.message}</p>`;
  }
});
