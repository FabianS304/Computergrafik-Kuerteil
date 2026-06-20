import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getF16Jet } from '../objects/F16Jet.js';

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
        if (isDebug) {
            jet.traverse((node) => {
                const keywords = ['Parent', 'Flap', 'Rudder', 'Stab', 'Canopy', 'Gear', 'Pilot'];

                if (keywords.some((k) => node.name.includes(k))) {
                    console.log('Haupt-Objekt gefunden:', node.name);
                }
            });
        }

        const canopy = jet.getObjectByName('Canopy_Parent_F16D_86');

        if (canopy) {
            // Kippe die Haube nach oben (Winkel nach Bedarf anpassen)

            canopy.rotation.x = -Math.PI / 6;
        }

        const box = new THREE.Box3().setFromObject(jet);

        // exakt auf der bodenOberkante liegt.
        jet.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 - box.min.y;
        jet.rotation.y = -Math.PI / 2;
    });
    return scene;
}