import { initializeKinesis } from "./index";

function createDistanceGrid(rows: number, cols: number) {
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("distance-grid");

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const distanceItem = document.createElement("div");
      distanceItem.classList.add("distance-item");
      distanceItem.setAttribute("data-kinesisdistance-item", "");
      distanceItem.setAttribute("data-ks-transform", "translate");
      distanceItem.setAttribute("data-ks-strength", "-100");
      distanceItem.setAttribute("data-ks-startdistance", "300");
      distanceItem.setAttribute("data-ks-velocity", "acceleration");

      gridContainer.appendChild(distanceItem);
    }
  }

  document.body.appendChild(gridContainer);
}

// Wait for DOM to load before creating the grid and initializing Kinesis.js
document.addEventListener("DOMContentLoaded", () => {
  // Create a 10x10 grid
  createDistanceGrid(10, 10);

  // Initialize Kinesis after the grid has been added to the DOM
  initializeKinesis();
  console.log("Kinesis.js has been initialized");
});