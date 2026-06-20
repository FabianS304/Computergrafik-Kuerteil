import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getAirplane } from '../objects/Airplane.js';
import { AirplaneController } from '../control/AirplaneController.js';
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
    const sun = getSpotLightSource(CFG_SCENE.SUN_INTENSITY, '#fcd8a6', target);

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

    getAirplane((gltf) => {
        const jet = gltf.scene;

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
        jet.rotation.y = -Math.PI / 2;

        const lElevator = jet.getObjectByName('Object_187');
        const rElevator = jet.getObjectByName('Object_182');

        scene.add(jet);
        globalThis.airplaneController = new AirplaneController(jet);
    });

    const spot = getSpotLightSource(CFG_SCENE.SUN_INTENSITY, '#fcd8a6', target);
    spot.position.set(0, 15, 0);

    scene.add(spot);
    return scene;
}
