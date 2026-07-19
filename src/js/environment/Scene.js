import { getDirectionalLightSource, getSpotLightSource } from './Lighting.js';
import * as cfg from '../util/Config.js';
import { getWorldPlane } from './World.js';
import { getHangar } from '../objects/Hangar.js';
import { getGLBModel } from '../util/ModelLoader.js';
import { AirplaneController } from '../control/AirplaneController.js';
import ASSET_PATHS from '../util/Paths.js';
import { getPlane } from '../objects/BasicShapes.js';
import { getMaterial } from '../util/TextureLoader.js';
const CFG_SCENE = cfg.WORLD_CONFIG.SCENE;
const CFG_HANGAR = cfg.WORLD_CONFIG.HANGAR;
export function initDefaultScene(isDebug, gl) {
    const scene = new THREE.Scene();

    const groundPlane = getWorldPlane(gl, CFG_SCENE.SIZE, CFG_SCENE.SIZE);
    groundPlane.rotation.x = Math.PI / 2;
    scene.add(groundPlane);

    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    groundPlane.add(target);

    const sun = getSun(groundPlane, 0.0003, scene);
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
    const hangar = getHangar(true);
    const hangar2 = getHangar(false, 0, 0.001, -60);
    const hangar3 = getHangar(false, 0, 0.001, 60);

    scene.add(hangar, hangar2, hangar3);

    // Create a path (Runway/Taxiway)

    const pathWay = getPlane(110, 15, 256);
    pathWay.rotation.x = Math.PI / 2;
    pathWay.position.set(-CFG_HANGAR.FOUNDATION_LENGTH - 10, 0.01, 0);
    const map = getMaterial(ASSET_PATHS.PATHWAY_DIFF);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(15, 15);
    map.minFilter = THREE.NearestFilter;

    const normalMap = getMaterial(ASSET_PATHS.PATHWAY_NORM);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(15, 15);
    map.minFilter = THREE.NearestFilter;
    const material = new THREE.MeshStandardMaterial({
        map: map,
        normal: normalMap,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0.2,
    });
    pathWay.material = material;
    pathWay.receiveShadow = true;

    const pathWay2 = pathWay.clone();
    pathWay2.position.z -= 60;
    const pathWay3 = pathWay.clone();
    pathWay3.position.z += 60;

    scene.add(pathWay, pathWay2, pathWay3);

    const taxiWay = getPlane(CFG_SCENE.SIZE, 15, 256);
    taxiWay.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    taxiWay.position.set(-100, 0.01, 0);
    taxiWay.material = material;
    taxiWay.receiveShadow = true;
    scene.add(taxiWay);

    const parkingArea = getPlane(30, 20, 256);
    parkingArea.rotation.x = Math.PI / 2;
    parkingArea.position.set(-70, 0.01, 15);
    parkingArea.material = material;

    scene.add(parkingArea);

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

        const parkingJet = jet.clone();
        parkingJet.position.set(-60, 0 - box.min.y, 20);
        parkingJet.rotation.y = Math.PI / 2;

        const parkingJet2 = jet.clone();
        parkingJet2.position.set(-70, 0 - box.min.y, 20);
        parkingJet2.rotation.y = Math.PI / 2;

        const parkingJet3 = jet.clone();
        parkingJet3.position.set(-80, 0 - box.min.y, 20);
        parkingJet3.rotation.y = Math.PI / 2;

        const movingJet = parkingJet.clone();
        movingJet.rotation.y = -Math.PI / 2;
        movingJet.position.set(-100, 0 - box.min.y, 0);

        let time = 0;
        function animate() {
            requestAnimationFrame(animate);

            time += 1;

            movingJet.position.z += 0.03;
            if (movingJet.position.z >= 120) {
                movingJet.position.z = -125;
            }
        }

        animate();

        scene.add(jet, parkingJet, parkingJet2, parkingJet3, movingJet);
        globalThis.airplaneController = new AirplaneController(jet);
    }, ASSET_PATHS.JETPLANE);

    getGLBModel((gltf) => {
        const tower = gltf.scene;
        tower.position.set(60, 0.001, -80);
        tower.scale.set(0.5, 0.5, 0.5);
        enableShadow(tower);
        scene.add(tower);
    }, ASSET_PATHS.AIRPORT_TOWER);

    return scene;
}

function enableShadow(object, type = 'cast') {
    if (type === 'cast') {
        object.traverse((node) => {
            node.castShadow = true;
            if (node.isMesh) {
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                }
            }
        });
    } else {
        object.traverse((node) => {
            node.receiveShadow = true;
            if (node.isMesh) {
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                }
            }
        });
    }
}

function getSun(target, deltaTime, scene) {
    const sun = getSpotLightSource(CFG_SCENE.SUN_INTENSITY, '#fde1b9', target, 0, Math.PI / 4, 0.3);
    sun.position.set(-CFG_SCENE.SIZE, 120, -CFG_SCENE.SIZE);

    let time = 0;
    const radius = CFG_SCENE.SIZE; // Distance from center
    function animate() {
        requestAnimationFrame(animate);

        time += deltaTime; // Adjust speed here

        // Circular motion in the XZ plane or XY plane
        // Here we move it along the X and Y axes for a 360 effect
        sun.position.x = Math.cos(time) * radius;
        sun.position.y = Math.sin(time) * radius;

        const y = sun.position.y;
        const nightSky = new THREE.Color('#050505');
        const twilight = new THREE.Color('#2d1b33'); // Violett-Ton für die Dämmerung
        const riseOrSet = new THREE.Color('#ff7550'); // Sanfteres Orange
        const daylight = new THREE.Color('#002746');

        if (y < -30) {
            scene.background = nightSky;
            sun.intensity = 0;
        } else if (y < 0) {
            // Nacht zu Dämmerung
            scene.background = nightSky.clone().lerp(twilight, (y + 30) / 30);
            sun.intensity = 1;
        } else if (y < 30) {
            // Dämmerung zu Orange-Phase
            scene.background = twilight.clone().lerp(riseOrSet, y / 30);
            sun.intensity = 2;
        } else if (y < 80) {
            // Orange-Phase zu Tag
            scene.background = riseOrSet.clone().lerp(daylight, (y - 30) / 50);
            sun.intensity = 3;
        } else {
            scene.background = daylight;
            sun.intensity = CFG_SCENE.SUN_INTENSITY;
        }
    }

    animate();

    return sun;
}
