export function getCube(
    width,
    height,
    depth,
    map,
    heightMap,
    normalMap,
    roughness,
    metalness,
    castShadow,
    receiveShadow
) {

    const GEOMETRY = new THREE.BoxGeometry(width, height, depth, 240, 240, 240);

    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(25, 25);
    map.minFilter = THREE.NearestFilter;

    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.minFilter = THREE.NearestFilter;
    normalMap.repeat.set(25, 25);

    roughness.wrapS = THREE.RepeatWrapping;
    roughness.wrapT = THREE.RepeatWrapping;
    roughness.minFilter = THREE.NearestFilter;
    roughness.repeat.set(25, 25);

    heightMap.wrapS = THREE.RepeatWrapping;
    heightMap.wrapT = THREE.RepeatWrapping;
    heightMap.minFilter = THREE.NearestFilter;
    heightMap.repeat.set(25, 25);



    const MATERIAL = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: normalMap,
        roughness: roughness,
        metalness: metalness,
        displacementMap: heightMap,
        displacementScale: 0
    });

    const cube = new THREE.Mesh(GEOMETRY, MATERIAL);
    cube.castShadow = castShadow;
    cube.receiveShadow = receiveShadow;

    return cube;
}

import { getMaterial } from '../util/TextureLoader.js';
import ASSET_PATHS from '../util/paths.js';

export function getWorldPlane(gl, x = 800, y = 500) {
    const GEOMETRY = new THREE.PlaneGeometry(x, y, 256, 256);

    const map = getMaterial(ASSET_PATHS.GROUND_DIFF);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(15, 15);
    map.minFilter = THREE.NearestFilter;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();

    const planeNorm = getMaterial(ASSET_PATHS.GROUND_NORM);
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(15, 15);

    const heightMap = getMaterial(ASSET_PATHS.GROUND_DISP);
    heightMap.wrapS = THREE.RepeatWrapping;
    heightMap.wrapT = THREE.RepeatWrapping;
    heightMap.minFilter = THREE.NearestFilter;
    heightMap.repeat.set(15, 15);

    const MATERIAL = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: planeNorm,
        roughness: 0.8,
        displacementMap: heightMap,
        displacementScale: 4
    });

    const plane = new THREE.Mesh(GEOMETRY, MATERIAL);
    plane.receiveShadow = true;
    plane.geometry.computeVertexNormals();

    return plane;
}
