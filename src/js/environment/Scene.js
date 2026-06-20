import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getF16Jet } from '../objects/F16Jet.js';
import { getMaterial } from '../util/TextureLoader.js';
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

        jet.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;

                if (node.material) {
                    // Die PBR-Extension führt oft dazu, dass Specular (Spiegelung) auf weiß steht.
                    // Wir dämpfen das Specular-Licht:
                    if (node.material.specular) {
                        node.material.specular.setHex(0x333333); // Dämpft das Glänzen
                    }

                    // Wenn es weiterhin zu stark spiegelt, zwingen wir die Roughness hoch:
                    node.material.roughness = 0.8;
                    node.material.metalness = 0.2;

                    node.material.needsUpdate = true;
                }
            }

            if (isDebug) {
                const keywords = ['Parent', 'Flap', 'Rudder', 'Stab', 'Canopy', 'Gear', 'Pilot'];

                if (keywords.some((k) => node.name.includes(k))) {
                    console.log('Haupt-Objekt gefunden:', node.name);
                }
            }
        });

        let frontGearDoor = [];

        frontGearDoor.push(jet.getObjectByName('Object_177'), jet.getObjectByName('Object_116'));

        frontGearDoor.forEach((door) => {
            door.rotation.z = Math.PI / 2;
            door.position.x += 0.6;
            door.position.y += -0.5;
        });

        const leftGearDoor = [];
        leftGearDoor.push(jet.getObjectByName('Object_120'), jet.getObjectByName('Object_122'));
        leftGearDoor.forEach((door) => {
            door.rotation.z = Math.PI / 2;
        });
        const rightGearDoor = [];
        rightGearDoor.push(jet.getObjectByName('Object_137'), jet.getObjectByName('Object_139'));
        rightGearDoor.forEach((door) => {
            door.rotation.z = -Math.PI / 2;
        });

        let rightGear = jet.getObjectByName('FrontWheel_137');
        rightGear.rotation.x = Math.PI / 2;

        let rightSlats = jet.getObjectByName('Object_458');
        rightSlats.rotation.y = -0.628;

        let leftSlats = jet.getObjectByName('Object_452');
        leftSlats.rotation.y = 0.61;

        let toIgnore = [];
        toIgnore.push(jet.getObjectByName('Object_7'), jet.getObjectByName('Object_77'));
        toIgnore.forEach((obj) => {
            obj.visible = false;
        });

        const box = new THREE.Box3().setFromObject(jet);

        // exakt auf der bodenOberkante liegt.
        jet.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 - box.min.y;
        jet.rotation.y = -Math.PI / 2;
    });

    return scene;
}
