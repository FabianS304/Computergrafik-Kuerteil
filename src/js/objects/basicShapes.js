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

export function getHalfCylinder(width, height, depth, shadowOpt = [1, 1]) {
    const geometry = new THREE.CylinderGeometry(
        width / 2, // Radius oben (entspricht halber Hangar-Breite)
        width / 2, // Radius unten
        depth, // Die Länge des Hangars (Tiefe)
        32, // Segmente (glatter machen)
        height, // Höhe-Segmente
        true, // Open-ended
        0, // Start-Winkel
        Math.PI // thetaLength: Math.PI sorgt für ein Halbrund!
    );

    const cylinder = new THREE.Mesh(geometry);
    cylinder.reciveShadow = shadowOpt[0];
    cylinder.castShadow = shadowOpt[1];

    return cylinder;
}