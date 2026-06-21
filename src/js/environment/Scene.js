import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getGLBModel } from '../util/ModelLoader.js';
import { AirplaneController } from '../control/AirplaneController.js';
import ASSET_PATHS from '../util/Paths.js';
const CFG_SCENE = cfg.WORLD_CONFIG.SCENE;
const CFG_HANGAR = cfg.WORLD_CONFIG.HANGAR;
export function initDefaultScene(isDebug, gl) {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color('#002746');

    const groundPlane = getWorldPlane(gl);
    groundPlane.rotation.x = Math.PI / 2;
    scene.add(groundPlane);

    const hangar = getHangar();
    const target = new THREE.Object3D();
    target.position.x = 0;
    target.position.y = 0;
    target.position.z = 0;
    groundPlane.add(target);
    const sun = getSpotLightSource(CFG_SCENE.SUN_INTENSITY, '#fcd8a6', target, 0, Math.PI / 4, 0.5);

    sun.position.set(-CFG_SCENE.SIZE, 120, -CFG_SCENE.SIZE);

    scene.add(sun);

    //For debuging added a lightSource under the groundPlane
    if (isDebug) {
        const sun1 = getDirectionalLightSource(1, '#FFFFFF', groundPlane);
        sun1.position.set(0, -10, 0);
        scene.add(sun1);

        const helper = new THREE.CameraHelper(sun.shadow.camera);
        scene.add(helper);

        const axesHelper = new THREE.AxesHelper(50);
        sun.add(axesHelper);
    }
    scene.add(hangar);

    getGLBModel((gltf) => {
        const jet = gltf.scene;
        jet.scale.set(0.1, 0.1, 0.1);

        jet.traverse((node) => {
            node.castShadow = true;
            if (node.isMesh) {
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                }
            }
        });

        const box = new THREE.Box3().setFromObject(jet);

        // exakt auf der bodenOberkante liegt.
        jet.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 - box.min.y;
        jet.rotation.y = Math.PI;

        scene.add(jet);
        globalThis.airplaneController = new AirplaneController(jet);
    }, ASSET_PATHS.JETPLANE);

    return scene;
}
