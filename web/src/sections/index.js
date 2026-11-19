import Portada from './01-portada/Portada.jsx';
import Problema from './02-problema/Problema.jsx';
import Solucion from './03-solucion/Solucion.jsx';
import Diseno from './04-diseno/Diseno.jsx';
import Anatomia from './05-anatomia/Anatomia.jsx';
import Detector from './06-detector/Detector.jsx';
import Filtro from './07-filtro/Filtro.jsx';
import Demo from './08-demo/Demo.jsx';
import Pendiente from './_pendiente/Pendiente.jsx';

// id de sección (content/sections.js) → componente.
export const sectionComponents = {
  portada: Portada,
  problema: Problema,
  solucion: Solucion,
  diseno: Diseno,
  anatomia: Anatomia,
  detector: Detector,
  filtro: Filtro,
  demo: Demo,
  construccion: Pendiente,
  resultados: Pendiente,
  aprendizajes: Pendiente,
  mejoras: Pendiente,
  conclusion: Pendiente,
};
