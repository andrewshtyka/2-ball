import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/Addons.js";

/**
 * ======================================== Load font
 */
const fontLoader = new FontLoader();
const font = await fontLoader.loadAsync(
  "/fonts/helvetiker_regular.typeface.json",
);

/**
 * ======================================== Increase letter-spacing
 */
for (const glyphKey in font.data.glyphs) {
  font.data.glyphs[glyphKey].ha *= 1.05;
}

/**
 * ======================================== Configure text
 */
const textGeometryConfig = {
  font: font,
  size: 0.2,
  depth: 0.001,
  curveSegments: 12,
};

export const textAnimConfig = {
  textSpeed: -0.00025,
  totalTexts: 3,
};

/**
 * ======================================== Create text
 */

export function createText() {
  const now = new Date();
  const textGeometry = new TextGeometry(now.toLocaleTimeString(), {
    ...textGeometryConfig,
  });
  textGeometry.rotateX(Math.PI * 0.5);

  const textMaterial = new THREE.MeshBasicMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  return {
    textGeometry,
    textMaterial,
    textMesh,
  };
}

/**
 * ======================================== Animate text
 */
const lastUpdateMap = new WeakMap();

export function updateTimeText(textMesh, elapsedTime) {
  const last = lastUpdateMap.get(textMesh) ?? 0;

  // update once per second
  if (elapsedTime - last < 1) return;
  lastUpdateMap.set(textMesh, elapsedTime);

  const now = new Date();
  const newGeometry = new TextGeometry(now.toLocaleTimeString(), {
    ...textGeometryConfig,
  });
  newGeometry.rotateX(Math.PI * 0.5);

  textMesh.geometry.dispose();
  textMesh.geometry = newGeometry;
}
