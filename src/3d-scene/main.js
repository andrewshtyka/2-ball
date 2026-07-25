import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { canvasSizes } from "./canvasSizes";
import { cameraConfig } from "./cameraConfig";

/**
 * ======================================== Plan
 *
 * Sizes
 * Resize handler
 *
 * Scene
 * Camera
 * Canvas
 * Renderer
 * Pixel ratio
 *
 * Objects
 * Animate
 */

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
const { fov, aspect, near, far } = cameraConfig;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
scene.add(camera);

/**
 * ======================================== Renderer
 */
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvasSizes.width, canvasSizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

/**
 * ======================================== Animate
 */

const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
