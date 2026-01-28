export function getInputs() {
  const s0 = parseFloat(document.getElementById("s0").value) || 0;
  const muPct = parseFloat(document.getElementById("mu").value) || 0;
  const sigmaPct = parseFloat(document.getElementById("sigma").value) || 0;
  const T = parseFloat(document.getElementById("T").value) || 1;
  let steps = parseInt(document.getElementById("steps").value, 10) || 100;
  let scenarios = parseInt(document.getElementById("scenarios").value, 10) || 10;
  const scheme = document.getElementById("scheme")?.value || "euler";

  // Məhdudiyyətlər
  steps = Math.min(Math.max(10, steps), 365);
  scenarios = Math.min(Math.max(1, scenarios), 50);

  document.getElementById("steps").value = steps;
  document.getElementById("scenarios").value = scenarios;

  return {
    s0: Math.max(0.01, s0),
    mu: muPct / 100,
    sigma: sigmaPct / 100,
    T: Math.max(0.01, T),
    steps,
    scenarios,
    scheme
  };
}

export function buildDatasets(times, paths) {
  const colors = [
    "#2f7f4f",
    "#ba4a1f",
    "#b09523",
    "#1c6e8c",
    "#a33f5c",
    "#3b5f2d",
    "#7b4ea3",
    "#c76913"
  ];

  return paths.map((path, idx) => {
    const color = colors[idx % colors.length];
    return {
      label: `Ssenari ${idx + 1}`,
      data: path.map((y, i) => ({ x: times[i], y })),
      borderColor: color,
      pointRadius: 0,
      borderWidth: 1.2,
      tension: 0.1
    };
  });
}

