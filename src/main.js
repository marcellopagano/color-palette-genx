import { tilesGen } from "./utils.js";
import { generateColorPalette } from "./colors.js";
import { nRange } from "./range.js";
import touch from "./touch.js";
import readFile from "./readFile.js";
import canvasLoad from "./canvas-load.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const progressCalc = document.getElementById("progress-calc");
const rangeColors = document.getElementById("range-colors");
const imageInput = document.getElementById("imageInput");
const btnGenColor = document.getElementById("btn-gen-palette");
const paletteContainer = document.getElementById("palette-container");
const exportCode = document.getElementById("export");

async function init() {
  let imgData = undefined;
  let paletteColors = 5;

  canvas.addEventListener("click", () => {
    imageInput.click();
  });
  // evita l'apertura del browser con l'immagine trascinata sulla canvas
  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  // evento range
  rangeColors.addEventListener("change", (e) => {
    paletteColors = e.target.value;
  });

  // evento drop apre il file immagine trascinato sulla canvas
  canvas.addEventListener("drop", async (e) => {
    e.preventDefault();

    const type = e.dataTransfer.files[0].type;
    // verifica se il file trascinato è un'immagine
    if (type.includes("image")) {
      const file = e.dataTransfer.files[0];
      imgData = await readFile(ctx, file);
      btnGenColor.click();
    }
  });

  // evento imageinput
  imageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    imgData = await readFile(ctx, file);
    btnGenColor.click();
  });
  // evento bottone che genera i colori della palette
  btnGenColor.addEventListener("click", async () => {
    if (imgData === undefined || imgData.length == 0) return;
 
    try {
      paletteContainer.innerHTML = "";
      progressCalc.style.visibility = "visible";
      exportCode.style.visibility = "visible";
      btnGenColor.disabled = true;
      // estrae colori da canvas
      const colorPalette = await generateColorPalette(imgData, paletteColors);
       // generazione tiles colors + generazione export
      await tilesGen(colorPalette, paletteContainer, paletteColors);
      touch();
    } catch (error) {
      console.log(error.message);
    } finally {
      btnGenColor.disabled = false;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    // disegno plus su canvas
    canvasLoad(ctx);
    // attiva numeri sul range
    nRange();
  });
}
init();
