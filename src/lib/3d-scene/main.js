import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";

import { canvasSizes } from "./canvasSizes";
import { cameraConfig } from "./cameraConfig";
import { ballGeometryConfig, ballMaterialConfig } from "./ballConfig";

import {
  createText,
  textAnimConfig,
  updateTimeText,
  getInitialPoints,
  textGeometryConfig,
} from "./textConfig";

/**
 * ======================================== Debug UI
 */

export const gui = new GUI({
  width: 340,
  title: "DEBUG UI",
});
gui.close();

export const debugObject = {
  reset: () => {
    window.location.reload();
  },

  rotationDirection: 1,
  setOppositeBallDirection: () => {
    debugObject.rotationDirection = -debugObject.rotationDirection;
  },

  textDirection: 1,
  setOppositeTextDirection: () => {
    debugObject.textDirection = -debugObject.textDirection;
  },

  reactOnCursor: 1, // 1 = true, 0 = false
  stop: () => {
    debugObject.reactOnCursor = 0;
  },
  resume: () => {
    debugObject.reactOnCursor = 1;
  },

  ballSpeed: 1,
  textSpeed: 1,
  textSize: 1,
};

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

const ballGroup = new THREE.Group();
ballGroup.add(ballMesh);
ballGroup.rotation.z = -Math.PI * 0.1;
scene.add(ballGroup);

/**
 * ======================================== Master group
 */
const masterGroup = new THREE.Group();
masterGroup.add(ballGroup);
scene.add(masterGroup);

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
  masterGroup.add(mesh);
});

/**
 * ======================================== Animate cursor
 */

const xToRotation = gsap.quickTo(masterGroup.rotation, "y", {
  duration: 1,
  ease: "power2",
});
const yToRotation = gsap.quickTo(masterGroup.rotation, "x", {
  duration: 1,
  ease: "power2",
});

window.addEventListener("mousemove", (e) => {
  xToRotation(
    (e.clientX / window.innerWidth - 0.5) * 0.5 * debugObject.reactOnCursor,
  );
  yToRotation(
    (e.clientY / window.innerHeight - 0.5) * debugObject.reactOnCursor,
  );
});

/**
 * ======================================== Animate scene
 */

const timer = new THREE.Timer();

const animate = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  // rotate ball
  ballMesh.rotation.y =
    -elapsedTime * 0.5 * debugObject.rotationDirection * debugObject.ballSpeed;

  // rotate text
  bendedMeshesArr.forEach((mesh) => {
    updateTimeText(mesh, elapsedTime);
  });
  flowsArr.forEach((flow) => {
    flow.moveAlongCurve(
      textAnimConfig.textSpeed *
        debugObject.textDirection *
        debugObject.textSpeed,
    );
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

/**
 * ======================================== Debug tweaks
 */
gui.add(debugObject, "reset").name("Reset");

const ballTweaks = gui.addFolder("Ball");
ballTweaks
  .add(debugObject, "setOppositeBallDirection")
  .name("Change ball rotation direction");
ballTweaks
  .add(debugObject, "ballSpeed")
  .min(0)
  .max(600)
  .step(0.1)
  .name("Speed of ball rotation");

const textTweaks = gui.addFolder("Text");
textTweaks
  .add(debugObject, "setOppositeTextDirection")
  .name("Change text rotation direction");
textTweaks
  .add(debugObject, "textSpeed")
  .min(0)
  .max(500)
  .step(0.1)
  .name("Speed of text rotation");
textTweaks
  .add(textGeometryConfig, "size")
  .min(0.1)
  .max(0.3)
  .step(0.01)
  .name("Text size")
  .onFinishChange((v) => {
    textGeometryConfig.size = v;
  });

const cursorTweaks = gui.addFolder("Cursor");
cursorTweaks.add(debugObject, "stop").name("Stop reacting to cursor");
cursorTweaks.add(debugObject, "resume").name("Resume reacting to cursor");

gui.add(camera.position, "z").min(1.2).max(50).step(0.1).name("Zoom");
