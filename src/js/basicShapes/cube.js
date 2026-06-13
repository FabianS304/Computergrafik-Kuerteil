export function getCube(cubeSize, map, heightMap, normalMap, roughness, metalness, castShadow, receiveShadow) {

    const GEOMETRY = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );

    const MATERIAL = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: normalMap,
        roughness: roughness,
        displacementMap: heightMap,
        displacementScale: 10,
        metalness: metalness
    });

    const cube = new THREE.Mesh(GEOMETRY, MATERIAL);
    cube.castShadow = castShadow;
    cube.receiveShadow = receiveShadow;

    return cube;
}