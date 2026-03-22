export default function eventsTileCode() {
  // Seleziona tutti i tile
  const tiles = document.querySelectorAll(".tile-color-text");
  const codex = document.querySelectorAll("code");
  // ******************************
  // ****** CSS TAILS EVENTI ******
  // ******************************
  // animazione testo css "copied" su tiles
  tiles.forEach((tile) => {
    tile.addEventListener("mousedown", () => {
      tile.classList.add("touched");
      navigator.clipboard.writeText(tile.textContent);
    });
    tile.addEventListener("mouseup", () => {
      setTimeout(() => tile.classList.remove("touched"), 2000);
    });
  });
  // ******************************
  // ***** CSS CODEX EVENTI *******
  // ******************************
  // animazione testo css "copied" su codice
  codex.forEach((code) => {
    code.addEventListener("mousedown", () => {
      code.classList.add("touched");
    });
    code.addEventListener("mouseup", () => {
      setTimeout(() => code.classList.remove("touched"), 2000);
    });
  });
}
