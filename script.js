async function loadBooks() {

  const SHEET_BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSO7zteSriNnLpXUFLXajCFIE-L27NalLUSo2PBFhNAMg1ddXYeBV6as8v4MMb3_S6hhIsp2J9uXo2b/pubhtml";

  const response = await fetch(
  `${SHEET_BASE}?gid=${SHEET_GID}&single=true&output=csv`
);

  const csv = await response.text();
  const library = document.getElementById("library");

  // ---- CSV PARSER ROBUSTE ----
  function parseCSV(text) {
    const lines = text.split("\n").filter(l => l.trim() !== "");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      const values = [];
      let current = "";
      let insideQuotes = false;

      for (let char of line) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(current);
          current = "";
        } else {
          current += char;
        }
      }

      values.push(current);

      result.push(values.map(v =>
        (v || "").trim().replace(/"/g, "")
      ));
    }

    return result;
  }

  const rows = parseCSV(csv);

  // ---- OPTIONS RANDOM ----
  const colors = ["red", "blue", "green", "gold", "black", "white", "coral", "orchid", "dodgerblue", "greenyellow"];
  const fonts = ["Cinzel", "National Park", "Henny Penny", "serif", "sans-serif"];
  const sizes = ["12px", "14px", "16px", "18px", "20px", "22px"];
  const widths = ["40%", "50%", "60%", "70%", "80%", "100%", "120%"];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ---- HELPER RANDOM / VALUE ----
  const getValue = (value, fallback) => {
    if (!value || value.trim() === "" || value === "random") {
      return fallback;
    }
    return value.trim();
  };

  // ---- GENERATION ----
  rows.forEach(row => {
    const [
      author,
      title,
      publisher,
      color,
      font,
      size,
      textColor,
      thickness,
      width
    ] = row;

    const book = document.createElement("div");
    book.className = "book";

    // COLOR
    const finalColor = getValue(color, rand(colors));
    book.style.setProperty("--color", finalColor);

    // FONT
    const finalFont = getValue(font, rand(fonts));
    book.style.setProperty("--font", finalFont);

    // SIZE
    let finalSize = getValue(size, rand(sizes));
    if (!finalSize.includes("px")) finalSize += "px";
    book.style.setProperty("--size", finalSize);

    // TEXT COLOR
    const finalTextColor = getValue(textColor, "black");
    book.style.setProperty("--text-color", finalTextColor);

    // THICKNESS
    const finalThickness = getValue(
      thickness,
      Math.floor(Math.random() * 30) + 5
    );
    book.style.setProperty("--thickness", finalThickness + "px");

    // WIDTH
    const finalWidth = getValue(width, rand(widths));
    book.style.setProperty("--width", finalWidth);

    // STACK EFFECT
    book.style.setProperty("--left", Math.floor(Math.random() * 50) + "px");
    book.style.setProperty("--right", Math.floor(Math.random() * 50) + "px");
    book.style.setProperty("--top", Math.floor(Math.random() * 50) + "px");
    book.style.setProperty("--bottom", Math.floor(Math.random() * 50) + "px");

    // CONTENT
    book.innerHTML = `
      <div class="cell">${author || ""}</div>
      <div class="cell">${title || ""}</div>
      <div class="cell">${publisher || ""}</div>
    `;

    library.appendChild(book);
  });
}

loadBooks();








function updateFooter() {
  const booksCount = document.querySelectorAll(".book").length;

  document.getElementById("footer-text").textContent=
    `${booksCount}`;
}

setInterval(updateFooter, 1000);
updateFooter();

function updateDateTime() {
  const now = new Date();
  const hour = now.getHours();

  const date = now.toLocaleDateString("fr-FR");;
  const time = now.toLocaleTimeString("fr-FR");

  document.getElementById("datetime").textContent =
    date + ", il est " + time + "." ;

  document.body.classList.remove(
    "morning",
    "noon",
    "sunset",
    "night"
  );

  if (hour >= 6 && hour < 11) {
    document.body.classList.add("morning");
  } 
  else if (hour >= 11 && hour < 18) {
    document.body.classList.add("noon");
  } 
  else if (hour >= 18 && hour < 22) {
    document.body.classList.add("sunset");
  } 
  else {
    document.body.classList.add("night");
  }
}

setInterval(updateDateTime, 1000);
updateDateTime();
