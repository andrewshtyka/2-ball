import * as THREE from "three";

/**
 * ======================================== Textures
 */
let appliedType = "watermelon"; // "watermelon" | "disco"

const texturePaths = {
  color: (type) => `/${type}/color.webp` ?? null,
  height: (type) => `/${type}/height.webp` ?? null,
  normal: (type) => `/${type}/normal.webp` ?? null,
  roughness: (type) => `/${type}/roughness.webp` ?? null,
  ao: (type) => `/${type}/ambientOcclusion.webp` ?? null,
};

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const ballColorTexture = textureLoader.load(texturePaths.color(appliedType));
ballColorTexture.colorSpace = THREE.SRGBColorSpace;

const ballHeightTexture = textureLoader.load(texturePaths.height(appliedType));
const ballNormalTexture = textureLoader.load(texturePaths.normal(appliedType));
const ballRoughnessTexture = textureLoader.load(
  texturePaths.roughness(appliedType),
);
const ballAOTexture = textureLoader.load(texturePaths.ao(appliedType));

/**
 * ======================================== Geometry
 */
export const ballGeometryConfig = {
  radius: 1,
  widthSegments: 32,
  heightSegments: 32,
};

/**
 * ======================================== Material
 */
export const ballMaterialConfig = {
  map: ballColorTexture,

  displacementMap: ballHeightTexture,
  displacementScale: 0.1,

  roughnessMap: ballRoughnessTexture,
  normalMap: ballNormalTexture,

  aoMap: ballAOTexture,
  aoMapIntensity: 1,
};

/**
 * ======================================== Curved line
 */

const initialPointsConfig = {
  radius: 1.35,
  segments: 64,
};

export function getInitialPoints() {
  const initialPoints = [];

  for (let i = 0; i < initialPointsConfig.segments; i++) {
    const theta = (i / initialPointsConfig.segments) * Math.PI * 2;
    initialPoints.push(
      new THREE.Vector3(
        Math.cos(theta) * initialPointsConfig.radius,
        Math.sin(theta) * initialPointsConfig.radius,
        0,
      ),
    );
  }

  return initialPoints;
}
