import Portada from './01-portada/Portada.jsx';
import Problema from './02-problema/Problema.jsx';
import Solucion from './03-solucion/Solucion.jsx';
import Diseno from './04-diseno/Diseno.jsx';
import Anatomia from './05-anatomia/Anatomia.jsx';
import Detector from './06-detector/Detector.jsx';
import Despiece from './07-filtro/Despiece.jsx';
import Demo from './08-demo/Demo.jsx';
import Costos from './09-costos/Costos.jsx';
import Resultados from './10-resultados/Resultados.jsx';
import Aprendizajes from './11-aprendizajes/Aprendizajes.jsx';
import Mejoras from './12-mejoras/Mejoras.jsx';
import Conclusion from './13-conclusion/Conclusion.jsx';
import Paec from './paec/Paec.jsx';
import Objetivos from './objetivos/Objetivos.jsx';
import Bocetos from './bocetos/Bocetos.jsx';
import Diagramas from './diagramas/Diagramas.jsx';
import Esperados from './esperados/Esperados.jsx';

// id de sección (content/sections.js) → componente.
export const sectionComponents = {
  portada: Portada,
  problema: Problema,
  solucion: Solucion,
  diseno: Diseno,
  anatomia: Anatomia,
  detector: Detector,
  filtro: Despiece,
  demo: Demo,
  costos: Costos,
  resultados: Resultados,
  aprendizajes: Aprendizajes,
  mejoras: Mejoras,
  conclusion: Conclusion,
  paec: Paec,
  objetivos: Objetivos,
  bocetos: Bocetos,
  diagramas: Diagramas,
  esperados: Esperados,
};
