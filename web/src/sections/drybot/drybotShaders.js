// Shaders GLSL ES 3.00 (WebGL2) de la diapositiva DRYBOT.
// Simulación: campo de desplazamiento D (xy) y velocidad V (zw) por texel. Cada paso aplica
//   V += onda·laplaciano(D) − resorte·D + empujes del puntero;  V *= amortiguación;  D += V
// Resultado: el movimiento del puntero empuja el "líquido", la onda se propaga y el resorte
// regresa las letras a su forma con un rebote suave (no lineal).

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const COMUN = /* glsl */ `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
vec2 hash22(vec2 p) {
  float n = hash21(p);
  return vec2(n, hash21(p + n + 17.17));
}
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
`;

export const SIM = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uWave;
uniform float uStiff;
uniform float uDamp;
uniform float uAspect;
uniform float uRadius;
uniform float uForce;
uniform int uSplats;
uniform vec4 uSplat[8]; // xy = posición (uv), zw = desplazamiento del puntero en este tramo (uv)

void main() {
  vec4 s = texture(uState, vUv);
  vec2 D = s.xy;
  vec2 V = s.zw;
  vec2 lap = texture(uState, vUv - vec2(uTexel.x, 0.0)).xy
           + texture(uState, vUv + vec2(uTexel.x, 0.0)).xy
           + texture(uState, vUv - vec2(0.0, uTexel.y)).xy
           + texture(uState, vUv + vec2(0.0, uTexel.y)).xy
           - 4.0 * D;
  V += uWave * lap - uStiff * D;
  for (int i = 0; i < 8; i++) {
    if (i >= uSplats) break;
    vec2 d = vUv - uSplat[i].xy;
    d.x *= uAspect;
    float w = exp(-dot(d, d) / (uRadius * uRadius));
    V += uSplat[i].zw * uForce * w;
  }
  V *= uDamp;
  D += V;
  o = vec4(clamp(D, vec2(-0.2), vec2(0.2)), V);
}`;

// Relieve orgánico (gotas/membrana): se genera una sola vez por tamaño de pantalla.
export const RELIEVE = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform float uAspect;
uniform float uCells;
${COMUN}
void main() {
  vec2 p = vUv * vec2(uAspect, 1.0) * uCells;
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 r = g + hash22(i + g) * 0.85 - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  d1 = sqrt(d1);
  d2 = sqrt(d2);
  float gota = 1.0 - smoothstep(0.0, 0.75, d1);        // protuberancias redondeadas
  float membrana = smoothstep(0.0, 0.22, d2 - d1);     // valles finos entre gotas
  vec2 q = vUv * vec2(uAspect, 1.0) * 7.0;
  float fino = vnoise(q) * 0.6 + vnoise(q * 2.3) * 0.3 + vnoise(q * 5.1) * 0.1;
  float h = gota * 0.62 * membrana + fino * 0.38;
  o = vec4(h, h, h, 1.0);
}`;

export const RENDER = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform sampler2D uText;     // máscara de "DRYBOT" desenfocada: 0 fuera, 1 dentro
uniform sampler2D uRelief;
uniform vec2 uReliefTexel;
uniform float uAspect;
uniform vec2 uPointer;       // uv del puntero (suavizado)
uniform float uPointerOn;    // 0..1, se apaga suave cuando el puntero se queda quieto o sale
uniform float uTime;
uniform float uIntro;        // 0..1, entrada "condensación"
uniform vec3 uGlow;
uniform float uStrength;
uniform float uMaxDisp;
uniform float uGlowI;
uniform float uTrail;
uniform float uSpark;
uniform float uReliefLight;
${COMUN}

float mascara(vec2 uv) { return texture(uText, uv).r; }

void main() {
  vec2 uv = vUv;
  vec4 s = texture(uState, uv);
  vec2 D = s.xy;
  vec2 V = s.zw;
  float intro = uIntro;

  // Entrada: el líquido se condensa en letras (umbral alto + ondas de ruido que se calman).
  vec2 ar = vec2(uAspect, 1.0);
  vec2 nw = vec2(vnoise(uv * ar * 4.0 + uTime * 0.8), vnoise(uv * ar * 4.0 + vec2(19.7, 3.1) - uTime * 0.8)) - 0.5;
  // Tope suave (tanh): un movimiento muy rápido estira las letras, pero nunca las desarma.
  vec2 Dd = D * uStrength;
  float ld = length(Dd);
  Dd = ld > 1e-5 ? Dd / ld * uMaxDisp * tanh(ld / uMaxDisp) : vec2(0.0);
  vec2 tuv = uv - Dd - nw * (1.0 - intro) * 0.07;
  float m = mascara(tuv);
  float th = 0.5;
  // Condensación: las zonas con menos ruido aparecen primero como gotas que se unen en letras.
  float cond = (1.0 - intro) * (0.72 + 0.6 * vnoise(uv * ar * 9.0 + 3.7));
  float me = m - cond;
  float aa = max(fwidth(m) * 1.1, 0.003);
  float a = smoothstep(th - aa, th + aa, me);

  // Puntero
  vec2 dp = (uv - uPointer) * ar;
  float d2 = dot(dp, dp);
  float cerca = exp(-d2 / 0.03) * uPointerOn;
  float foco = exp(-d2 / 0.0045) * uPointerOn;

  // Fondo: relieve oscuro iluminado levemente por la luz verde del cursor.
  float h = texture(uRelief, uv).r;
  float hx = texture(uRelief, uv + vec2(uReliefTexel.x, 0.0)).r - texture(uRelief, uv - vec2(uReliefTexel.x, 0.0)).r;
  float hy = texture(uRelief, uv + vec2(0.0, uReliefTexel.y)).r - texture(uRelief, uv - vec2(0.0, uReliefTexel.y)).r;
  vec3 N = normalize(vec3(-hx * 3.2, -hy * 3.2, 1.0));
  vec3 L = normalize(vec3(-dp, 0.16));
  float dif = max(dot(N, L), 0.0);
  float amb = max(dot(N, normalize(vec3(-0.35, 0.55, 0.75))), 0.0);
  vec3 base = vec3(0.040, 0.047, 0.045) + h * 0.016;
  vec3 bg = base * (0.72 + 0.4 * amb)
          + uGlow * dif * exp(-d2 / 0.06) * uPointerOn * uReliefLight
          + uGlow * foco * 0.025;

  // Estela: el líquido en movimiento brilla y se apaga con la amortiguación.
  float estela = clamp(length(V) * uTrail, 0.0, 1.0);
  estela *= estela;

  // Letras: hueso, con tinte verde donde el líquido está deformado o cerca de la luz.
  vec3 letra = vec3(0.933, 0.945, 0.937);
  float disp = clamp(length(Dd) / uMaxDisp, 0.0, 1.0);
  letra = mix(letra, mix(letra, uGlow, 0.35), disp * 0.3 + cerca * 0.14);
  letra *= 0.92 + 0.08 * smoothstep(0.0, 1.0, vUv.y);

  // Halo neón suave en el borde exterior de las letras.
  float halo = smoothstep(th - 0.38, th, me) * (1.0 - a) * intro;

  vec3 col = mix(bg, letra, a);
  col += uGlow * (halo * (0.04 + cerca * 0.38) + estela * 0.2 * (1.0 - 0.7 * a)) * uGlowI;

  // Destellos: pocos, en el borde de las letras cercano al puntero.
  vec2 g = uv * ar * 64.0;
  vec2 celda = floor(g);
  vec2 f = fract(g) - 0.5;
  float tic = floor(uTime * 6.0);
  float r = hash21(celda + tic * 7.13);
  vec2 centro = (celda + 0.5) / (ar * 64.0);
  float mc = mascara(centro - Dd);
  float borde = smoothstep(th - 0.32, th - 0.08, mc) * (1.0 - smoothstep(th + 0.02, th + 0.18, mc));
  vec2 q = f - (hash22(celda + tic) - 0.5) * 0.5;
  float estrella = exp(-dot(q, q) * 140.0)
                 + 0.55 * exp(-abs(q.x) * 70.0) * exp(-abs(q.y) * 10.0)
                 + 0.55 * exp(-abs(q.y) * 70.0) * exp(-abs(q.x) * 10.0);
  float vida = sin(fract(uTime * 6.0) * 3.14159);
  float chispa = step(1.0 - uSpark, r) * borde * cerca * vida * estrella;
  col += (uGlow * 0.8 + 0.35) * chispa;

  // Viñeta para enmarcar.
  float vig = smoothstep(1.3, 0.35, length((vUv - 0.5) * ar));
  col *= mix(0.78, 1.0, vig);

  o = vec4(col, 1.0);
}`;
