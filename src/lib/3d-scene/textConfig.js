import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export const getTextGeometryConfig = (font) => ({
  font: font,
  size: 0.2,
  height: 0.2,
  depth: 0.01,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.01,
  bevelOffset: 0,
  bevelSegments: 5,
});

let lastUpdateTime = 0;
export function updateTimeText(font, textMesh, elapsedTime) {
  // update once per second
  if (elapsedTime - lastUpdateTime < 1) return;
  lastUpdateTime = elapsedTime;

  const now = new Date();
  const newGeometry = new TextGeometry(now.toLocaleTimeString(), {
    ...getTextGeometryConfig(font),
  });
  newGeometry.center();
  newGeometry.rotateX(Math.PI * 0.5);

  textMesh.geometry.dispose();
  textMesh.geometry = newGeometry;
}
