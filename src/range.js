const nRange = () => {
  const range = document.querySelector(".range");
  const bubble = document.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  // imposta bubble per primo caricamento pagina
  setBubble(range, bubble);

  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }
};

export { nRange };
