import { canvasSizes } from "./canvasSizes";

export const cameraConfig = {
  fov: 40,
  aspect: canvasSizes.aspect,
  near: 0.1,
  far: 100,
  position: {
    x: 0,
    y: 0,
    z: 6,
  },
};
