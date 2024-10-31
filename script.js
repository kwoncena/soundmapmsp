let dots = [];
let audioFiles = [];
let draggingDot = null;
let dotsVisible = false;  // Toggle state for dots visibility

// Preload audio files
function preload() {
  for (let i = 1; i <= 17; i++) {  // Updated to load 17 audio files
    let fileName = `MSP${i}.mp3`;   // Updated to .mp3
    let audio = new Audio(fileName);
    audio.addEventListener("canplaythrough", () => {
      console.log(`Loaded successfully: ${fileName}`);
    });
    audio.addEventListener("error", () => {
      console.error(`Failed to load: ${fileName}`);
      alert(`Failed to load: ${fileName}`);
    });
    audioFiles.push(audio);
  }
}

// Function to initialize the canvas and dots
function setup() {
  const canvasContainer = d3.select("#canvas-container");
  const width = parseInt(canvasContainer.style("width"));
  const height = parseInt(canvasContainer.style("height"));

  // Check if all audio files are loaded
  if (audioFiles.length < 17) {  // Adjusted for 17 files
    console.warn("Not all audio files loaded. Check console for errors.");
    return;
  }

  // Create dots with random positions and assign audio files
  for (let i = 0; i < 17; i++) {  // Adjusted for 17 dots
    const x = Math.random() * (width - 50) + 25;
    const y = Math.random() * (height - 50) + 25;
    const color = `rgb(${Math.random() * 100}, ${Math.random() * 155 + 100}, ${Math.random() * 100})`;

    const dot = {
      id: i,
      x,
      y,
      color,
      sound: audioFiles[i],
    };
    dots.push(dot);

    // Append dot as a div element
    const dotElement = canvasContainer
      .append("div")
      .attr("class", "dot")
      .style("background-color", dot.color)
      .style("left", `${dot.x}px`)
      .style("top", `${dot.y}px`);

    // Add drag functionality
    dotElement.call(
      d3.drag()
        .on("start", (event) => onDragStart(event, dot))
        .on("drag", (event) => onDrag(event, dot))
        .on("end", onDragEnd)
    );

    // Add click functionality to play sound
    dotElement.on("click", () => playSound(dot));
  }
}

// Map button functionality to toggle dots visibility
document.getElementById("map-button").addEventListener("click", () => {
  dotsVisible = !dotsVisible;
  d3.selectAll(".dot").style("display", dotsVisible ? "block" : "none");
});

// Start dragging
function onDragStart(event, dot) {
  draggingDot = dot;
}

// During dragging
function onDrag(event, dot) {
  draggingDot.x = event.x;
  draggingDot.y = event.y;
  d3.select(event.sourceEvent.target)
    .style("left", `${event.x}px`)
    .style("top", `${event.y}px`);
}

// End dragging
function onDragEnd() {
  draggingDot = null;
}

// Play sound
function playSound(dot) {
  if (!dot.sound.paused) {
    dot.sound.pause();
    dot.sound.currentTime = 0;
  }
  dot.sound.play();
}

// Call preload and setup
preload();
document.addEventListener("DOMContentLoaded", setup);
