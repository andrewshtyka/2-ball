import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { canvasSizes } from "./canvasSizes";
import { cameraConfig } from "./cameraConfig";
import { ballGeometryConfig, ballMaterialConfig } from "./ballConfig";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { getTextGeometryConfig, letterSpacing, updateTimeText } from "./textConfig";

/**
 * ======================================== Resize handler
 */
window.addEventListener("resize", () => {
  // update sizes
  canvasSizes.width = window.innerWidth;
  canvasSizes.height = window.innerHeight;
  canvasSizes.aspect = window.innerWidth / window.innerHeight;

  // update camera
  camera.aspect = canvasSizes.aspect;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(canvasSizes.width, canvasSizes.height);

  // update pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * ======================================== Scene
 */
const scene = new THREE.Scene();

/**
 * ======================================== Camera
 */
const { fov, aspect, near, far, position } = cameraConfig;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(position.x, position.y, position.z);
camera.lookAt(scene.position);
scene.add(camera);

/**
 * ======================================== Renderer
 */
const canvas = document.querySelector("canvas.webgl");

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvasSizes.width, canvasSizes.height);
renderer.render(scene, camera);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * ======================================== Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 200);
pointLight.position.set(3, 3, 6);
scene.add(pointLight);

/**
 * ======================================== Object: ball
 */
const { radius, widthSegments, heightSegments } = ballGeometryConfig;
const { map, displacementMap, displacementScale, roughnessMap, normalMap } =
  ballMaterialConfig;

const ballMesh = new THREE.Mesh(
  new THREE.SphereGeometry(radius, widthSegments, heightSegments),
  new THREE.MeshStandardMaterial({
    map,
    displacementMap,
    displacementScale,
    roughnessMap,
    normalMap,
  }),
);
scene.add(ballMesh);

/**
 * ======================================== Object: text
 */
const fontLoader = new FontLoader();
const font = await fontLoader.loadAsync(
  "/fonts/helvetiker_regular.typeface.json",
);

// increase letter-spacing
for (const glyphKey in font.data.glyphs) {
  font.data.glyphs[glyphKey].ha *= letterSpacing;
}

const now = new Date();
const textGeometry = new TextGeometry(now.toLocaleTimeString(), {
  ...getTextGeometryConfig(font),
});
textGeometry.center();
textGeometry.rotateX(Math.PI * 0.5);

const textMaterial = new THREE.MeshBasicMaterial();
const textMesh = new THREE.Mesh(textGeometry, textMaterial);
textGeometry.computeBoundingBox();

/**
 * ======================================== Bend text
 */
const radiusLine = 1.25;
const segments = 64;

const initialPoints = [];
for (let i = 0; i < segments; i++) {
  const theta = (i / segments) * Math.PI * 2;
  initialPoints.push(
    new THREE.Vector3(
      Math.cos(theta) * radiusLine,
      Math.sin(theta) * radiusLine,
      0,
    ),
  );
}

const curve = new THREE.CatmullRomCurve3(initialPoints, true, "chordal");
const flow = new Flow(textMesh);
flow.updateCurve(0, curve);
scene.add(flow.object3D);

/**
 * ======================================== Animate
 */

const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  // rotate ball
  ballMesh.rotation.y = elapsedTime;
  ballMesh.rotation.x = elapsedTime * 0.5;

  // rotate text
    flow.moveAlongCurve(-0.001);
  updateTimeText(font, flow.object3D, elapsedTime);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
