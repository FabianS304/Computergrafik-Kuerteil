import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getF16Jet } from '../objects/F16Jet.js';

const CFG_SCENE = cfg.WORLD_CONFIG.SCENE;
export function initDefaultScene(isDebug, gl) {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color('#002746');

    const groundPlane = getWorldPlane(gl);
    groundPlane.rotation.x = Math.PI / 2;
    scene.add(groundPlane);

    const hangar = getHangar();
    const target = new THREE.Object3D();
    target.position.x = CFG_SCENE.SIZE / 2;
    target.position.y = CFG_SCENE.SIZE / 2;
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

    getF16Jet((jet) => {
        scene.add(jet);
        // Hier kannst du auch weitere Anpassungen vornehmen,
        // z.B. Positionierung oder Animation starten
        jet.position.set(0, 1, 0);
        jet.rotation.x = MATH.PI / 2;
    });

    return scene;
}