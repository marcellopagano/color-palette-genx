import { nRange } from "./range.js";
import canvasFirstImage from "./canvas-first-image.js";
import events from "./events.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function init() {
  document.addEventListener("DOMContentLoaded", function () {
    // disegna la prima immagine /icona
    canvasFirstImage(ctx);
    // attiva la bubble numeri sull'input range
    nRange();
    // gestore eventi
    events();
  });
}
init();
