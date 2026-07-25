import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";

import { canvasSizes } from "./canvasSizes";
import { cameraConfig } from "./cameraConfig";
import {
  ballGeometryConfig,
  ballMaterialConfig,
  getInitialPoints,
} from "./ballConfig";

import { createText, textAnimConfig, updateTimeText } from "./textConfig";

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
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

const group = new THREE.Group();
group.add(ballMesh);
group.rotation.z = -Math.PI * 0.1;
scene.add(group);

/**
 * ======================================== Bend texts
 */
const curve = new THREE.CatmullRomCurve3(getInitialPoints(), true);

const bendedMeshesArr = [];
const flowsArr = [];
for (let i = 1; i <= textAnimConfig.totalTexts; i++) {
  const flow = new Flow(createText().textMesh);
  flow.updateCurve(0, curve);
  flow.moveAlongCurve(i / 3);

  bendedMeshesArr.push(flow.object3D);
  flowsArr.push(flow);
}

bendedMeshesArr.forEach((mesh) => {
  scene.add(mesh);
});

/**
 * ======================================== Animate
 */

const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  // rotate ball
  ballMesh.rotation.y = -elapsedTime * 0.5;

  // rotate text
  bendedMeshesArr.forEach((mesh) => {
    updateTimeText(mesh, elapsedTime);
  });
  flowsArr.forEach((flow) => {
    flow.moveAlongCurve(textAnimConfig.textSpeed);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
