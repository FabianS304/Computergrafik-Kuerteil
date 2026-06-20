import ASSET_PATHS from '../util/Paths.js';
import * as basicShape from './BasicShapes.js';
import { getMaterial, getConfiguredTexture } from '../util/TextureLoader.js';
import { WORLD_CONFIG } from '../util/Config.js';
/**
 * Baseplate
 */

const CFG_HANGAR = WORLD_CONFIG.Hangar;

function getFoundation() {
    const cube = basicShape.getCube(CFG_HANGAR.X, CFG_HANGAR.Z, CFG_HANGAR.Y, 150);

    const map = getMaterial(ASSET_PATHS.FLOOR_DIFF);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 2);
    map.minFilter = THREE.NearestFilter;

    const planeNorm = getMaterial(ASSET_PATHS.FLOOR_NORM);
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(2, 2);

    const material = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        normalMap: planeNorm,
        roughness: 0.8,
    });

    cube.material = material;
    cube.position.set(CFG_HANGAR.POS_X, CFG_HANGAR.POS_Y, CFG_HANGAR.POS_Z);

    return cube;
}

function createWallMaterial(repeat = [1,1]) {
    return new THREE.MeshStandardMaterial({
        map: getConfiguredTexture(ASSET_PATHS.WALL_DIFF, repeat[0], repeat[1]),
        normalMap: getConfiguredTexture(ASSET_PATHS.WALL_NORM, repeat[0], repeat[1]),
        side: THREE.DoubleSide,
        roughness: 5,
    });
}

function getWall(wallLength, rotationDir) {
    const wall = basicShape.getCube(wallLength, CFG_HANGAR.WALL_WIDTH, CFG_HANGAR.WALL_HEIGHT, 256);

    const repeatFront = [2,1];
    const repeatSide = [wallLength / 5, 1];
    const repeatTop = [10,1];

    
    const materials = [
        createWallMaterial(repeatFront), // front
        createWallMaterial(repeatFront), // back
        createWallMaterial(repeatSide), // outside
        createWallMaterial(repeatSide), // inside
        createWallMaterial(repeatTop), // top
        createWallMaterial(repeatTop), // bottom
    ];

    wall.material = materials;

    if (rotationDir === 'x') {
        wall.rotation.x = Math.PI / 2;
    } else {
        wall.rotation.x = Math.PI / 2;
        wall.rotation.z = Math.PI / 2;
    }
    //Durch einen AchorPoint ersetzen!
    wall.position.y = CFG_HANGAR.Z * 2 + 0.25;

    return wall;
}

export function getBarrelRoof(width, height, depth) {
    // 1. Zylinder-Geometrie (Radius oben, Radius unten, Höhe, Segmente)
    // Damit es ein "Halbrund" wird, nutzen wir thetaLength: Math.PI
    const roof = basicShape.getHalfCylinder(width, height, depth);

    const map = getMaterial(ASSET_PATHS.ROOF_DIFF);
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(4, 1);
    map.minFilter = THREE.NearestFilter;

     const material = new THREE.MeshStandardMaterial({
        map: map,
        side: THREE.DoubleSide,
        roughness: 0.8,
    });


    roof.material = material;

    
    // 2. Ausrichtung: 
    // Cylinder liegt standardmäßig auf der Y-Achse, wir müssen ihn kippen
    roof.rotation.z = Math.PI / 2;
    roof.rotation.X = Math.PI / 2;
    roof.position.y = CFG_HANGAR.WALL_HEIGHT
    return roof;
}

export function getHangar() {
    const hangar = getFoundation(); // Das ist unser Fundament-Mesh

    // Liste der Wände, die wir hinzufügen wollen
    const walls = [
        {
            length: CFG_HANGAR.X,
            rotationDir: 'x',
            zPos: CFG_HANGAR.X / 2 - CFG_HANGAR.WALL_WIDTH - 2,
        },
        {
            length: CFG_HANGAR.X,
            rotationDir: 'x',
            zPos: -CFG_HANGAR.X / 2 + CFG_HANGAR.WALL_WIDTH + 2,
        },
        {
            length: CFG_HANGAR.Y - CFG_HANGAR.WALL_WIDTH * 2,
            rotationDir: 'y',
            zPos: -CFG_HANGAR.X / 2 + CFG_HANGAR.WALL_WIDTH + 2,
        },
    ];

    // Schleife über alle Wände
    for (const element of walls) {
        const wallData = element;
        let wall = getWall(wallData.length, wallData.rotationDir);

        // Positionierung in Z (bleibt wie vorher)
        wall.position.z = wallData.zPos;

        if (wallData.rotationDir != 'x') {
            wall.position.x = CFG_HANGAR.X / 2 - 0.5;
            wall.position.z = 0;
        }

        // Zur Szene hinzufügen
        hangar.add(wall);
    }

    hangar.add(getBarrelRoof(CFG_HANGAR.Y, 2, CFG_HANGAR.X));
    return hangar;
}
