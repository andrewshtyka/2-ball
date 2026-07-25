import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export const letterSpacing = 1.05;

export const getTextGeometryConfig = (font) => ({
  font: font,
  size: 0.15,
  depth: 0.001,
  curveSegments: 12,
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
