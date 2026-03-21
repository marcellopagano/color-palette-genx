import { rgbToHex } from "./colors.js";

const jsId = document.getElementById("code-js");
const pythonId = document.getElementById("code-python");
const ccId = document.getElementById("code-cc");
const javaId = document.getElementById("code-java");

const codeJsTag = document.createElement("code");
const codePythonTag = document.createElement("code");
const codeCCTag = document.createElement("code");
const codeJavaTag = document.createElement("code");

let orderHexColors = [];
// genera le tiles color palette
async function tilesGen(rgbColors, paletteContainer, paletteColors) {
  orderHexColors = [];
  // ordinamento colori dal più scuro al più chiaro
  rgbColors.forEach((color) => {
    const col = rgbToHex(color, paletteContainer, paletteColors);
    orderHexColors.push(col);
  });
  // ordinamento hex colors
  orderHexColors.sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
  // ciclo assegnazione tiles
  orderHexColors.forEach((hexColor) => {
    const tile = document.createElement("div");
    const tileText = document.createElement("div");

    tileText.textContent = `#${hexColor}`;
    tileText.classList.add("tile-color-text");
    tile.classList.add("tile-color");
    tile.style.width = `${paletteContainer.width / paletteColors}%`;
    tile.style.backgroundColor = `#${hexColor}`;
    tile.appendChild(tileText);
    paletteContainer.appendChild(tile);
  });
  exportColors();
}
// esporta i colori esadecimali in variabili di vari linguaggi
async function exportColors() {
  // reset dei contenuti tag code
  codeJsTag.textContent = "";
  codePythonTag.textContent = "";
  codeCCTag.textContent = "";
  codeJavaTag.textContent = "";
  // correzione stringa per codice Java,C/C++
  const ccJavaFix = String(JSON.stringify(orderHexColors)).replace(
    /[\[\]]/g,
    "",
  );
  // formattazione codice testo da esporre al tag code
  const js = `const palette=${JSON.stringify(orderHexColors)}`;
  const python = `palette=${JSON.stringify(orderHexColors)}`;
  const cc = `const char* palette[]={${ccJavaFix}}`;
  const java = `string[] palette={${ccJavaFix}}`;
  // inserimento codice formattato su tag code
  codeJsTag.textContent = js;
  codePythonTag.textContent = python;
  codeCCTag.textContent = cc;
  codeJavaTag.textContent = java;
  // aggiunta codici su tabs (DOM)
  jsId.appendChild(codeJsTag);
  pythonId.appendChild(codePythonTag);
  ccId.appendChild(codeCCTag);
  javaId.appendChild(codeJavaTag);
  // clipboardcopy fn
  async function clipBoardCopy(code) {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.log(error.message);
    }
  }
  // gestore eventi per copia appunti su tabs codice
  jsId.addEventListener("click", async () => {
    await clipBoardCopy(codeJsTag.textContent);
  });
  pythonId.addEventListener("click", async () => {
    await clipBoardCopy(codePythonTag.textContent);
  });
  ccId.addEventListener("click", async () => {
    await clipBoardCopy(codeCCTag.textContent);
  });
  javaId.addEventListener("click", async () => {
    await clipBoardCopy(codeJavaTag.textContent);
  });
}
export { tilesGen };
