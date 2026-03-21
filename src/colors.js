const progressCalc = document.getElementById("progress-calc");

async function generateColorPalette(imgData, numColors) {
  const data = await imgData.data;
  const pixels = [];

  // Estraiamo i dati RGB dai pixel dell'immagine
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Ignoriamo il canale alpha
    if (r > 0 || g > 0 || b > 0) {
      pixels.push([r, g, b]);
    }
  }
  // Applichiamo K-Means per clusterizzare i pixel
  const centroids = await kMeans(pixels, numColors);
  // Selezioniamo i centroidi come palette di colori univoci
  return centroids.map(
    (centroid) =>
      `rgb(${Math.round(centroid[0])}, ${Math.round(centroid[1])}, ${Math.round(centroid[2])})`,
  );
}
// Funzione helper per mettere in pausa
const sleep = async (ms) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

async function kMeans(data, k, maxIterations = 100) {
  // const n = await data.length;
  // const d = await data[0].length;
  let centroids = chooseRandomCentroids(data, k);

  for (let i = 0; i < maxIterations; i++) {
    const clusters = Array.from({ length: k }, () => []);
    // Assegna ogni punto al cluster più vicino
    for (const point of data) {
      const closestCentroidIndex = findClosestCentroid(point, centroids);
      clusters[closestCentroidIndex].push(point);
    }
    // progress bar aggiornamento
    progressCalc.value = i;

    // Aggiorna i centroidi come la media dei punti nei cluster
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0)
        return centroids[findClosestCentroid(cluster[0], centroids)];
      return averagePoints(cluster);
    });
    // pausa fn per aggiornamento progress bar
    await sleep(10);
  }
  // progress bar reset
  progressCalc.style.visibility = "hidden";
  progressCalc.value = 0;

  return centroids;
}
// centroids rnd fn
function chooseRandomCentroids(data, k) {
  const indices = Array.from({ length: data.length }, (_, i) => i);
  shuffle(indices);
  return indices.slice(0, k).map((index) => data[index]);
}
// shuffle fn
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// centroid fn
function findClosestCentroid(point, centroids) {
  let minDistance = Infinity;
  let closestIndex = -1;

  for (let i = 0; i < centroids.length; i++) {
    const distance = euclideanDistance(point, centroids[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
}
// euclidea fn
function euclideanDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error("Both arguments must be arrays");
  }

  if (a.length !== b.length) {
    throw new Error("Both arrays must have the same length");
  }
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}
// avarange fn
function averagePoints(points) {
  const n = points.length;
  const d = points[0].length;
  const avg = new Array(d).fill(0);

  for (const point of points) {
    for (let i = 0; i < d; i++) {
      avg[i] += point[i];
    }
  }

  return avg.map((value) => value / n);
}
// rgbtohex fn
function rgbToHex(rgb) {
  // Estrai i valori RGB dalla stringa
  const [red, green, blue] = rgb.match(/\d+/g).map(Number);

  // Converte ogni valore in esadecimale e assicurati che sia a due cifre (aggiungi '0' se necessario)
  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  // Combina i componenti esadecimali
  return `${hexRed}${hexGreen}${hexBlue}`.toUpperCase();
}

export { generateColorPalette, rgbToHex };
