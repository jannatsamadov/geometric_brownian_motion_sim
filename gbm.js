// GBM simulyasiyası üçün util-lər

function boxMuller() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const r = Math.sqrt(-2.0 * Math.log(u));
  const theta = 2.0 * Math.PI * v;
  return r * Math.cos(theta);
}

/**
 * Euler-Maruyama ilə GBM trayektoriyaları
 * dS = μ S dt + σ S dW
 *
 * @param {number} s0 başlanğıc qiymət
 * @param {number} mu illik drift
 * @param {number} sigma illik volatillik
 * @param {number} T ümumi zaman (illə)
 * @param {number} steps addım sayı
 * @param {number} scenarios trayektoriya sayı
 * @param {"euler"|"milstein"|"exact"} scheme inteqrasiya metodu
 * @returns {{times: number[], paths: number[][]}}
 */
export function simulateGBM({ s0, mu, sigma, T, steps, scenarios, scheme = "euler" }) {
  const dt = T / steps;
  const sqrtDt = Math.sqrt(dt);

  const times = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    times[i] = (i * T) / steps;
  }

  const paths = [];

  const method = scheme === "milstein" || scheme === "exact" ? scheme : "euler";

  for (let j = 0; j < scenarios; j++) {
    const path = new Array(steps + 1);
    let S = s0;
    path[0] = S;

    for (let i = 1; i <= steps; i++) {
      const z = boxMuller();

      if (method === "exact") {
        // Analitik GBM həlli:
        // S_{t+dt} = S_t * exp((μ - 0.5 σ^2) dt + σ √dt Z)
        const expo = (mu - 0.5 * sigma * sigma) * dt + sigma * sqrtDt * z;
        S = S * Math.exp(expo);
      } else if (method === "milstein") {
        // Milstein sxemi:
        // S_{t+dt} = S_t + μ S_t dt + σ S_t dW + 0.5 σ^2 S_t (dW^2 - dt)
        const dW = sqrtDt * z;
        S =
          S +
          mu * S * dt +
          sigma * S * dW +
          0.5 * sigma * sigma * S * (dW * dW - dt);
      } else {
        // Euler–Maruyama:
        // S_{t+dt} = S_t + μ S_t dt + σ S_t √dt Z
        S = S + mu * S * dt + sigma * S * sqrtDt * z;
      }

      if (!Number.isFinite(S) || S <= 0) S = 0;
      path[i] = S;
    }

    paths.push(path);
  }

  return { times, paths };
}

