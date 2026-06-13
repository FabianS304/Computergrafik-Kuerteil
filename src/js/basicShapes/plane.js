import { getMaterial } from "../util/TextureLoader.js";
import ASSET_PATHS from "../util/paths.js"

export function getPlane(gl, x = 800, y = 800) {

    const GEOMETRY = new THREE.PlaneGeometry(
        x,
        y,
        256,
        256
    );

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

    const heightMap = getMaterial(ASSET_PATHS.GROUND_DISP);
    heightMap.wrapS = THREE.RepeatWrapping;
    heightMap.wrapT = THREE.RepeatWrapping;
    heightMap.minFilter = THREE.NearestFilter;
    heightMap.repeat.set(16, 16);

    const MATERIAL = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: planeNorm,
        roughness: 0.8,
        displacementMap: heightMap,
        displacementScale: 10,
    });

    const plane = new THREE.Mesh(GEOMETRY, MATERIAL);
    plane.receiveShadow = true;
    plane.geometry.computeVertexNormals();

    return plane;
}