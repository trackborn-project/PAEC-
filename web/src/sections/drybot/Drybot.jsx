import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useReduce } from '../../deck/MotionPref.jsx';
import { RELIEVE, RENDER, SIM, VERT } from './drybotShaders.js';


const WORD = 'DRYBOT';
const FLUID_STRENGTH = 1.0; // cuánto se deforman las letras con el líquido (0.4 sutil … 1.6 exagerado)
const MAX_DISPLACEMENT = 0.05; // tope suave de la deformación, en fracción de la pantalla
const SPLAT_FORCE = 0.55; // empuje por unidad de movimiento del puntero (más = reacciona más fuerte)
const SPLAT_RADIUS = 0.085; // radio del "dedo", en fracción del lado corto de la pantalla
const WAVE_SPEED = 0.2; // propagación de la onda entre texels (estable hasta ~0.25)
const STIFFNESS = 0.018; // resorte que regresa las letras a su forma (más = vuelve más rápido)
const DISSIPATION = 0.955; // amortiguación por paso (más bajo = se calma antes; 0.9 … 0.985)
const GLOW_COLOR = [57 / 255, 255 / 255, 136 / 255]; // #39ff88, el verde del proyecto
const GLOW_INTENSITY = 0.8; // brillo del halo y de la estela (0 apaga)
const TRAIL_GAIN = 60; // cuánto brilla el líquido en movimiento (estela)
const SPARKLE_DENSITY = 0.02; // fracción de celdas del borde que destellan cerca del cursor
const RELIEF_LIGHT = 0.11; // cuánto ilumina el cursor el relieve del fondo
const RELIEF_CELLS = 15; // número de "gotas" del relieve por alto de pantalla
const INTRO_MS = 850; // duración de la entrada (≤ 900 ms)
const TEXT_WIDTH = 0.8; // ancho de la palabra respecto a la pantalla (horizontal)
const TEXT_WIDTH_PORTRAIT = 0.88; // ancho de la palabra en pantallas verticales (celular)
const TEXT_HEIGHT = 0.42; // alto máximo de la palabra respecto a la pantalla
const SIM_MIN_SIDE = 160; // resolución de la simulación en el lado corto (más = ondas más finas)
const MAX_DPR = 2;
const SETTLE_MS = 4500; // tras este tiempo sin mover el puntero, el render se pausa (el líquido ya se calmó)
// ─────────────────────────────────────────────────────────────────────

const easeOutQuad = (t) => 1 - (1 - t) ** 2;

function soportaWebGL2() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    const ok = !!gl && !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

export default function Drybot() {
  const reduce = useReduce();
  const [modo, setModo] = useState(() => (soportaWebGL2() ? 'gl' : 'svg'));

  return (
    <div className="relative h-full w-full" data-sin-estrellas data-testid="drybot" data-modo={reduce ? 'reducido' : modo}>
      {reduce ? (
        <DrybotEstatico />
      ) : (
        <>
          <h2 className="sr-only">{WORD}</h2>
          {modo === 'gl' ? <DrybotGL onFallo={() => setModo('svg')} /> : <DrybotSVG />}
        </>
      )}
    </div>
  );
}

// ───────────────────────── Versión WebGL2 ─────────────────────────
function DrybotGL({ onFallo }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const falloRef = useRef(onFallo);
  falloRef.current = onFallo;

  useEffect(() => {
    let motor = null;
    let cancelado = false;
    // La palabra se dibuja con la fuente del proyecto: hay que esperarla antes de crear la textura.
    const fuente = document.fonts?.load(`900 100px "Archivo Variable"`) ?? Promise.resolve();
    fuente
      .catch(() => {})
      .then(() => {
        if (cancelado) return;
        try {
          motor = crearMotor(canvasRef.current, wrapRef.current);
        } catch (e) {
          console.info('DRYBOT: WebGL2 no disponible, se usa la versión SVG.', e?.message);
          falloRef.current();
        }
      });
    return () => {
      cancelado = true;
      motor?.destruir();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 select-none" style={{ touchAction: 'none' }}>
      <canvas ref={canvasRef} className="block h-full w-full" data-testid="drybot-canvas" aria-hidden />
    </div>
  );
}

function crearMotor(canvas, el) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: 'high-performance',
  });
  if (!gl) throw new Error('sin webgl2');
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) throw new Error('sin render a float');

  // ── Programas ──
  const compilar = (tipo, src) => {
    const sh = gl.createShader(tipo);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const vs = compilar(gl.VERTEX_SHADER, VERT);
  const programa = (fsrc) => {
    const p = gl.createProgram();
    const fs = compilar(gl.FRAGMENT_SHADER, fsrc);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      const nombre = info.name.replace(/\[0\]$/, '');
      u[nombre] = gl.getUniformLocation(p, info.name);
    }
    return { p, u };
  };
  const pSim = programa(SIM);
  const pRelieve = programa(RELIEVE);
  const pRender = programa(RENDER);

  // Triángulo que cubre la pantalla.
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // ── Texturas y framebuffers ──
  const textura = (w, h, interno, formato, tipo, datos = null) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, interno, w, h, 0, formato, tipo, datos);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const destino = (tex) => {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('framebuffer incompleto');
    return fb;
  };

  let sim = null; // { tex:[a,b], fb:[a,b], w, h, lee }
  let relieve = null; // { tex, fb, w, h }
  let texTexto = null;
  const lienzoTexto = document.createElement('canvas');

  const liberarTamano = () => {
    if (sim) {
      sim.tex.forEach((t) => gl.deleteTexture(t));
      sim.fb.forEach((f) => gl.deleteFramebuffer(f));
    }
    if (relieve) {
      gl.deleteTexture(relieve.tex);
      gl.deleteFramebuffer(relieve.fb);
    }
    if (texTexto) gl.deleteTexture(texTexto);
    sim = relieve = texTexto = null;
  };

  const dibujarTexto = (w, h) => {
    // Máscara desenfocada: al aplicar un umbral en el shader, las letras quedan con bordes
    // suaves y redondeados (aspecto líquido) y el halo/los destellos saben dónde está el borde.
    const k = Math.min(1, 2048 / Math.max(w, h));
    const tw = Math.max(2, Math.round(w * k));
    const th = Math.max(2, Math.round(h * k));
    lienzoTexto.width = tw;
    lienzoTexto.height = th;
    const c = lienzoTexto.getContext('2d');
    c.fillStyle = '#000';
    c.fillRect(0, 0, tw, th);
    const familia = '"Archivo Variable", system-ui, sans-serif';
    let size = th * TEXT_HEIGHT;
    c.font = `900 ${size}px ${familia}`;
    if ('letterSpacing' in c) c.letterSpacing = `${-0.02 * size}px`;
    const ancho = c.measureText(WORD).width;
    size = Math.min(size, (size * tw * (tw >= th ? TEXT_WIDTH : TEXT_WIDTH_PORTRAIT)) / ancho);
    c.font = `900 ${size}px ${familia}`;
    if ('letterSpacing' in c) c.letterSpacing = `${-0.02 * size}px`;
    const met = c.measureText(WORD);
    const y = th / 2 + (met.actualBoundingBoxAscent - met.actualBoundingBoxDescent) / 2;
    // Se dibuja solo la sombra (desplazada al lienzo visible): equivale a un desenfoque gaussiano.
    c.textAlign = 'center';
    c.textBaseline = 'alphabetic';
    c.fillStyle = '#fff';
    c.shadowColor = '#fff';
    c.shadowBlur = Math.max(2, size * 0.05);
    c.shadowOffsetX = tw;
    c.fillText(WORD, tw / 2 - tw, y);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    texTexto = textura(tw, th, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, lienzoTexto);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  };

  let W = 1;
  let H = 1;
  let aspecto = 1;
  const redimensionar = () => {
    const r = el.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    W = Math.max(2, Math.round(r.width * dpr));
    H = Math.max(2, Math.round(r.height * dpr));
    if (canvas.width === W && canvas.height === H && sim) return;
    canvas.width = W;
    canvas.height = H;
    aspecto = W / H;
    liberarTamano();

    // Simulación a baja resolución (suave y barata), con la misma proporción que la pantalla.
    const sw = Math.round(aspecto >= 1 ? SIM_MIN_SIDE * aspecto : SIM_MIN_SIDE);
    const sh = Math.round(aspecto >= 1 ? SIM_MIN_SIDE : SIM_MIN_SIDE / aspecto);
    const ta = textura(sw, sh, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
    const tb = textura(sw, sh, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT);
    sim = { tex: [ta, tb], fb: [destino(ta), destino(tb)], w: sw, h: sh, lee: 0 };
    for (const fb of sim.fb) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    // Relieve del fondo: se genera una vez por tamaño.
    const rw = Math.max(2, Math.round(W / 2));
    const rh = Math.max(2, Math.round(H / 2));
    const tr = textura(rw, rh, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
    relieve = { tex: tr, fb: destino(tr), w: rw, h: rh };
    gl.bindFramebuffer(gl.FRAMEBUFFER, relieve.fb);
    gl.viewport(0, 0, rw, rh);
    gl.useProgram(pRelieve.p);
    gl.uniform1f(pRelieve.u.uAspect, aspecto);
    gl.uniform1f(pRelieve.u.uCells, RELIEF_CELLS);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    dibujarTexto(W, H);
    despertar(true);
  };

  // ── Puntero ──
  const puntero = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, dentro: false, ultimo: null, mov: -1e9 };
  let pendientes = []; // tramos acumulados entre cuadros: [x, y, dx, dy]
  let on = 0;

  // El radio se mide sobre el lado corto: en un celular vertical el "dedo" no cubre media pantalla.
  const radio = () => SPLAT_RADIUS * Math.min(1, aspecto);
  const aUv = (e) => {
    const r = el.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  };
  const mover = (e) => {
    const [x, y] = aUv(e);
    puntero.x = x;
    puntero.y = y;
    puntero.dentro = true;
    puntero.mov = performance.now();
    const u = puntero.ultimo;
    if (u) {
      // Tramos cortos a lo largo del recorrido: sin huecos aunque el puntero vaya muy rápido.
      const dx = x - u[0];
      const dy = y - u[1];
      const largo = Math.hypot(dx * aspecto, dy);
      // Un salto enorme entre dos eventos no es un gesto (p. ej. el dedo aparece en otro lado): no empuja.
      if (largo < 0.35) {
        const n = Math.min(8, Math.max(1, Math.ceil(largo / (radio() * 0.5))));
        for (let i = 1; i <= n; i++) pendientes.push([u[0] + (dx * i) / n, u[1] + (dy * i) / n, dx / n, dy / n]);
      }
    } else {
      puntero.sx = x;
      puntero.sy = y;
    }
    puntero.ultimo = [x, y];
    despertar();
  };
  const salir = () => {
    puntero.dentro = false;
    puntero.ultimo = null;
  };
  const bajar = (e) => {
    puntero.ultimo = null;
    mover(e);
  };
  el.addEventListener('pointermove', mover, { passive: true });
  el.addEventListener('pointerdown', bajar, { passive: true });
  el.addEventListener('pointerleave', salir, { passive: true });
  const soltar = (e) => e.pointerType !== 'mouse' && salir();
  el.addEventListener('pointerup', soltar, { passive: true });
  el.addEventListener('pointercancel', salir, { passive: true });

  // ── Bucle ──
  let raf = 0;
  let prev = 0;
  let introT = -1; // ms de entrada transcurridos (se cuenta por cuadro: un arranque lento no se la salta)
  let cuadros = 0;
  const splats = new Float32Array(32);

  const pasoSim = (lista) => {
    const n = Math.min(8, lista.length);
    for (let i = 0; i < n; i++) splats.set(lista[i], i * 4);
    gl.useProgram(pSim.p);
    gl.uniform1i(pSim.u.uState, 0);
    gl.uniform2f(pSim.u.uTexel, 1 / sim.w, 1 / sim.h);
    gl.uniform1f(pSim.u.uWave, WAVE_SPEED);
    gl.uniform1f(pSim.u.uStiff, STIFFNESS);
    gl.uniform1f(pSim.u.uDamp, DISSIPATION);
    gl.uniform1f(pSim.u.uAspect, aspecto);
    gl.uniform1f(pSim.u.uRadius, radio());
    gl.uniform1f(pSim.u.uForce, SPLAT_FORCE);
    gl.uniform1i(pSim.u.uSplats, n);
    gl.uniform4fv(pSim.u.uSplat, splats);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim.tex[sim.lee]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, sim.fb[1 - sim.lee]);
    gl.viewport(0, 0, sim.w, sim.h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    sim.lee = 1 - sim.lee;
  };

  const cuadro = (ahora) => {
    raf = 0;
    if (!sim) return;
    const dt = Math.min(50, ahora - prev || 16.7);
    prev = ahora;
    introT = introT < 0 ? 0 : introT + Math.min(dt, 34);
    const intro = easeOutQuad(Math.min(1, introT / INTRO_MS));

    // Pasos fijos (~120 Hz) para que la física no dependa de los fps de la pantalla.
    const pasos = Math.min(4, Math.max(1, Math.round(dt / 8.33)));
    let lista = pendientes;
    pendientes = [];
    for (let i = 0; i < pasos; i++) {
      // Los empujes se reparten entre los pasos para que el primer movimiento responda al instante.
      const parte = lista.splice(0, Math.ceil(lista.length / (pasos - i)));
      pasoSim(parte.length > 8 ? fusionar(parte) : parte);
    }

    // Luz del cursor: sigue al puntero casi sin retraso y se apaga suave al quedarse quieto.
    const k = Math.min(1, dt / 22);
    puntero.sx += (puntero.x - puntero.sx) * k;
    puntero.sy += (puntero.y - puntero.sy) * k;
    const objetivo = puntero.dentro && ahora - puntero.mov < 2200 ? 1 : 0;
    on += (objetivo - on) * Math.min(1, dt / (objetivo ? 90 : 600));

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(pRender.p);
    const u = pRender.u;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim.tex[sim.lee]);
    gl.uniform1i(u.uState, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texTexto);
    gl.uniform1i(u.uText, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, relieve.tex);
    gl.uniform1i(u.uRelief, 2);
    gl.uniform2f(u.uReliefTexel, 1 / relieve.w, 1 / relieve.h);
    gl.uniform1f(u.uAspect, aspecto);
    gl.uniform2f(u.uPointer, puntero.sx, puntero.sy);
    gl.uniform1f(u.uPointerOn, on);
    gl.uniform1f(u.uTime, (ahora / 1000) % 1000);
    gl.uniform1f(u.uIntro, intro);
    gl.uniform3fv(u.uGlow, GLOW_COLOR);
    gl.uniform1f(u.uStrength, FLUID_STRENGTH);
    gl.uniform1f(u.uMaxDisp, MAX_DISPLACEMENT);
    gl.uniform1f(u.uGlowI, GLOW_INTENSITY);
    gl.uniform1f(u.uTrail, TRAIL_GAIN);
    gl.uniform1f(u.uSpark, SPARKLE_DENSITY);
    gl.uniform1f(u.uReliefLight, RELIEF_LIGHT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    cuadros++;
    canvas.dataset.cuadros = String(cuadros);
    canvas.dataset.intro = intro.toFixed(2);
    // Mientras haya algo que animar sigue el bucle; si no, se pausa hasta el siguiente movimiento.
    const ocupado = intro < 1 || ahora - puntero.mov < SETTLE_MS || on > 0.003 || pendientes.length > 0;
    if (ocupado && !document.hidden) raf = requestAnimationFrame(cuadro);
    canvas.dataset.estado = raf ? 'activo' : 'pausado';
  };

  function despertar(forzar = false) {
    if (raf || document.hidden) return;
    if (forzar) puntero.mov = Math.max(puntero.mov, performance.now() - SETTLE_MS + 400);
    prev = performance.now();
    raf = requestAnimationFrame(cuadro);
    canvas.dataset.estado = 'activo';
  }

  const visibilidad = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      canvas.dataset.estado = 'pausado';
    } else despertar(true);
  };
  document.addEventListener('visibilitychange', visibilidad);

  const ro = new ResizeObserver(redimensionar);
  ro.observe(el);
  redimensionar();

  return {
    destruir() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      document.removeEventListener('visibilitychange', visibilidad);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerdown', bajar);
      el.removeEventListener('pointerleave', salir);
      el.removeEventListener('pointerup', soltar);
      el.removeEventListener('pointercancel', salir);
      liberarTamano();
      [pSim, pRelieve, pRender].forEach(({ p }) => gl.deleteProgram(p));
      gl.deleteShader(vs);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      canvas.dataset.estado = 'liberado';
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

// Si llegan más de 8 tramos en un paso, se agrupan conservando el empuje total.
function fusionar(lista) {
  const grupos = [];
  const tam = Math.ceil(lista.length / 8);
  for (let i = 0; i < lista.length; i += tam) {
    const g = lista.slice(i, i + tam);
    const ult = g[g.length - 1];
    grupos.push([ult[0], ult[1], g.reduce((s, t) => s + t[2], 0), g.reduce((s, t) => s + t[3], 0)]);
  }
  return grupos;
}

// ───────────────────────── Respaldo sin WebGL2 ─────────────────────────
// SVG con feTurbulence + feDisplacementMap: la escala de la distorsión sigue la velocidad
// del puntero con un resorte; un brillo verde radial sigue al cursor.
function DrybotSVG() {
  const wrapRef = useRef(null);
  const dispRef = useRef(null);
  const turbRef = useRef(null);
  const luzRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    let raf = 0;
    let escala = 0;
    let vel = 0;
    let objetivo = 0;
    let ultimo = null;
    let t = 0;
    const cuadro = () => {
      raf = 0;
      t += 1;
      vel += (objetivo - escala) * 0.18;
      vel *= 0.72;
      escala += vel;
      objetivo *= 0.9;
      dispRef.current?.setAttribute('scale', escala.toFixed(2));
      turbRef.current?.setAttribute('baseFrequency', `${(0.012 + Math.sin(t * 0.03) * 0.002).toFixed(4)} 0.03`);
      if (Math.abs(escala) > 0.05 || objetivo > 0.05) raf = requestAnimationFrame(cuadro);
    };
    const mover = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (ultimo) objetivo = Math.min(70, objetivo + Math.hypot(x - ultimo[0], y - ultimo[1]) * 0.6);
      ultimo = [x, y];
      if (luzRef.current) {
        luzRef.current.style.opacity = '1';
        luzRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (!raf && !document.hidden) raf = requestAnimationFrame(cuadro);
    };
    const salir = () => {
      ultimo = null;
      if (luzRef.current) luzRef.current.style.opacity = '0';
    };
    el.addEventListener('pointermove', mover, { passive: true });
    el.addEventListener('pointerleave', salir, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        touchAction: 'none',
        background:
          'radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.025), transparent 40%), radial-gradient(ellipse at center, #121715, #0a0c0b 75%)',
      }}
    >
      <div
        ref={luzRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[38vmin] w-[38vmin] rounded-full opacity-0 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgb(57 255 136 / 0.16), transparent 70%)' }}
      />
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 562"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }}
      >
        <defs>
          <filter id="drybot-liquido" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="4" result="ruido" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="ruido" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text
          x="500"
          y="281"
          textAnchor="middle"
          dominantBaseline="central"
          textLength="800"
          lengthAdjust="spacingAndGlyphs"
          fontSize="230"
          fontWeight="900"
          fill="#eef1ef"
          filter="url(#drybot-liquido)"
          style={{ fontFamily: '"Archivo Variable", system-ui, sans-serif' }}
        >
          {WORD}
        </text>
      </motion.svg>
    </div>
  );
}

// ───────────────────────── Movimiento reducido ─────────────────────────
// DRYBOT estático con un brillo verde suave. La tecla M activa el efecto completo.
function DrybotEstatico() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #121715, #0a0c0b 75%)' }}
    >
      <h2
        className="font-black leading-none tracking-[-0.03em] text-hueso"
        style={{
          fontSize: 'min(17vw, 34vh)',
          textShadow: '0 0 28px rgb(57 255 136 / 0.28), 0 0 2px rgb(57 255 136 / 0.5)',
        }}
      >
        {WORD}
      </h2>
    </div>
  );
}
