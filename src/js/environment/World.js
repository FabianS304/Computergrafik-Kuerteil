import { getPlane } from "../objects/BasicShapes.js";
import { getMaterial } from "../util/TextureLoader.js";
import ASSET_PATHS from '../util/Paths.js';
import * as cfg from '../util/Config.js';

const CFG_SCENE = cfg.WORLD_CONFIG.SCENE;

export function getWorldPlane(gl, x = 150, y = 150) {
    const map = getMaterial(ASSET_PATHS.GROUND_DIFF);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(4, 4);
    map.minFilter = THREE.NearestFilter;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();

    const planeNorm = getMaterial(ASSET_PATHS.GROUND_NORM);
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(4, 4);

    const material = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: planeNorm,
        roughness: 2,
    });

    const plane = getPlane(x,y,256);
    plane.material = material;
    plane.receiveShadow = true;

    return plane;
}

