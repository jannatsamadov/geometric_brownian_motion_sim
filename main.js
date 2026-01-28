import Chart from "chart.js/auto";
import { simulateGBM } from "./gbm.js";
import { getInputs, buildDatasets } from "./ui.js";

let chartInstance = null;

function createOrUpdateChart(times, paths) {
  const ctx = document.getElementById("gbmChart").getContext("2d");
  const datasets = buildDatasets(times, paths);

  const maxY = paths.reduce(
    (acc, p) => Math.max(acc, ...p),
    0
  );

  if (chartInstance) {
    chartInstance.data.datasets = datasets;
    chartInstance.options.scales.x.min = 0;
    chartInstance.options.scales.x.max = times[times.length - 1];
    chartInstance.options.scales.y.min = 0;
    chartInstance.options.scales.y.max = maxY * 1.1;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
          callbacks: {
            title(items) {
              if (!items.length) return "";
              const t = items[0].parsed.x;
              return `t = ${t.toFixed(2)} il`;
            },
            label(item) {
              return `S = ${item.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: "linear",
          title: {
            display: false
          },
          grid: {
            color: "#eee"
          }
        },
        y: {
          title: {
            display: false
          },
          grid: {
            color: "#f1f1f1"
          },
          min: 0,
          max: maxY * 1.1
        }
      },
      interaction: {
        mode: "nearest",
        intersect: false
      },
      elements: {
        line: {
          borderJoinStyle: "round"
        }
      }
    }
  });
}

function runSimulation() {
  const params = getInputs();
  const { times, paths } = simulateGBM(params);
  createOrUpdateChart(times, paths);

  if (paths.length > 0) {
    const lastIndex = times.length - 1;
    const meanFinal =
      paths.reduce((sum, path) => sum + path[lastIndex], 0) / paths.length;
    const theoreticalMean = params.s0 * Math.exp(params.mu * params.T);

    const statsEl = document.getElementById("meanFinalValue");
    if (statsEl) {
      statsEl.textContent =
        `Simulyasiya olunmuş son qiymətlərin orta dəyəri: ` +
        `E[S_T] ≈ ${meanFinal.toFixed(2)}  |  ` +
        `Nəzəri E[S_T] = S₀ · e^{μT} ≈ ${theoreticalMean.toFixed(2)}`;
    }
  }
}

function setup() {
  const button = document.getElementById("simulateButton");
  button.addEventListener("click", runSimulation);

  // Parametrlər dəyişəndə avtomatik yenilə
  ["s0", "mu", "sigma", "T", "steps", "scenarios"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("change", runSimulation);
  });

  runSimulation();
}

document.addEventListener("DOMContentLoaded", setup);

