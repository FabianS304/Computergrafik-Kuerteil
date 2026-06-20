import { WORLD_CONFIG } from "../util/Config.js";

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

export function getHalfCylinder(width, height, depth, openEnded = true) {
    const geometry = new THREE.CylinderGeometry(
        width / 2, // Radius oben (entspricht halber Hangar-Breite)
        width / 2, // Radius unten
        depth, // Die Länge des Hangars (Tiefe)
        32, // Segmente (glatter machen)
        height, // Höhe-Segmente
        openEnded, // Open-ended
        0, // Start-Winkel
        Math.PI // thetaLength: Math.PI sorgt für ein Halbrund!
    );

    const cylinder = new THREE.Mesh(geometry);



    return cylinder;
}

export function getGableWall(radius) {

    // 1. Radius
    // 2. Segmente (z.B. 32 für ein glattes Rund)
    // 3. thetaStart: Bei PI (9 Uhr) starten
    // 4. thetaLength: PI (180 Grad) weit zeichnen
    const geometry = new THREE.CircleGeometry(radius, 32, Math.PI, Math.PI);
    
    // Keine manuelle UV-Manipulation mehr hier!
    const wall = new THREE.Mesh(geometry);
    

    return wall;
}


export function getGableDoor(radius) {

    // 1. Radius
    // 2. Segmente (z.B. 32 für ein glattes Rund)
    // 3. thetaStart: Bei PI (9 Uhr) starten
    // 4. thetaLength: PI (180 Grad) weit zeichnen
    const geometry = new THREE.CircleGeometry(radius, 32, Math.PI, Math.PI / 2);

    
    // Keine manuelle UV-Manipulation mehr hier!
    const leftUpper = new THREE.Mesh(geometry);
    leftUpper.rotation.x = Math.PI / 2;
    leftUpper.rotation.z = Math.PI / 2;

    const planeGeometry = getPlane(WORLD_CONFIG.HANGAR.WALL_HEIGHT, WORLD_CONFIG.HANGAR.WALL_WIDTH, 126).geometry;
    const leftDowner = new THREE.Mesh(planeGeometry);

    leftUpper.add(leftDowner);

    const rightUpper = new THREE.Mesh(geometry);
    rightUpper.rotation.x = Math.PI /2;
    rightUpper.rotation.z = Math.PI;
    
    
    return leftDowner ;
}
