import { tilesColor, exportColor } from "./utils.js";
import { generateColorPalette } from "./colors.js";
import eventsTileCode from "./events-tile-code.js";
import readFile from "./readFile.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const progressCalc = document.getElementById("progress-calc");
const rangeColors = document.getElementById("range-colors");
const imageInput = document.getElementById("imageInput");
const btnGenColor = document.getElementById("btn-gen-palette");
const paletteContainer = document.getElementById("palette-container");
const exportCode = document.getElementById("export");

export default async function events() {
  let imgData = undefined;
  let paletteColors = 5;

  // evento range
  rangeColors.addEventListener("change", (e) => {
    paletteColors = e.target.value;
  });
  // evento imageinput
  imageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    imgData = await readFile(ctx, file);
    btnGenColor.click();
  });
  // ******************************
  // **** BOTTONE GENX EVENTO *****
  // ******************************
  // evento bottone che rigenera i colori della palette
  btnGenColor.addEventListener("click", async () => {
    if (imgData === undefined || imgData.length == 0) return;

    try {
      paletteContainer.innerHTML = "";
      progressCalc.style.visibility = "visible";
      exportCode.style.visibility = "visible";
      btnGenColor.disabled = true;
      // estrae colori hex da canvas
      const colorPalette = await generateColorPalette(imgData, paletteColors);
      // generazione tiles color
      await tilesColor(colorPalette, paletteContainer, paletteColors);
      // generazione export codes color
      await exportColor();
      eventsTileCode();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      btnGenColor.disabled = false;
    }
  });
  // ******************************
  // ******** CANVAS EVENTI *******
  // ******************************
  canvas.addEventListener("click", () => {
    imageInput.click();
  });
  // evita l'apertura del browser con l'immagine trascinata sulla canvas
  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  // canvas evento drop - apre il file immagine trascinato
  canvas.addEventListener("drop", async (e) => {
    e.preventDefault();
    try {
      const type = e.dataTransfer.files[0].type;
      // verifica se il file trascinato è un'immagine
      if (type.includes("image")) {
        // rimuove classe css effetto drag over
        canvas.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        imgData = await readFile(ctx, file);
        btnGenColor.click();
      } else {
        canvas.classList.remove("drag-over-error");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  });
  // canvas evento dragover gestione bordi canvas in base al file trascinato
  canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
    const type = e.dataTransfer.items[0].type;
    if (!type.includes("image")) {
      canvas.classList.add("drag-over-error");
    } else {
      canvas.classList.add("drag-over");
    }
  });
  // canvas evento dragleave gestione bordi canvas in base al file trascinato
  canvas.addEventListener("dragleave", function () {
    canvas.classList.remove("drag-over");
  });
}
