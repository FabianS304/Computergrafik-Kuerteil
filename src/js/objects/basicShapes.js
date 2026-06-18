export function getCube(x, y, z, subDivFactor, shadowOpt = [true, true]) {
    const geometry = new THREE.BoxGeometry(x, y, z, subDivFactor, subDivFactor);

    const cube = new THREE.Mesh(geometry);
    cube.reciveShadow = shadowOpt[0];
    cube.castShadow = shadowOpt[1];

    return cube;
}

export function getPlane(x, y, subDivFactor, shadowOpt = [true, true]) {
    const geometry = new THREE.PlaneGeometry(x, y, subDivFactor, subDivFactor);

    const plane = new THREE.Mesh(geometry);
    plane.geometry.computeVertexNormals();

    return plane;
}
