export function getCube(width, height, depth, subDivFactor) {
    console.log(width, height, depth);
    const geometry = new THREE.BoxGeometry(width, height, depth, subDivFactor, subDivFactor);

    const cube = new THREE.Mesh(geometry);

    

    return cube;
}

export function getPlane(x, y, subDivFactor) {
    const geometry = new THREE.PlaneGeometry(x, y, subDivFactor, subDivFactor);

    const plane = new THREE.Mesh(geometry);
    plane.geometry.computeVertexNormals();

    return plane;
}

export function getHalfCylinder(width, height, depth) {
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



    return cylinder;
}