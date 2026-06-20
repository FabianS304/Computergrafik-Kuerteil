import ASSET_PATHS from '../util/Paths.js';
import * as basicShape from './BasicShapes.js';
import { getMaterial, getConfiguredTexture } from '../util/TextureLoader.js';
import { WORLD_CONFIG } from '../util/Config.js';
import { getSpotLightSource } from '../environment/Lighting.js';
/**
 * Baseplate
 */

const CFG_HANGAR = WORLD_CONFIG.HANGAR;

function getFoundation() {
    const cube = basicShape.getCube(
        CFG_HANGAR.LENGTH,
        CFG_HANGAR.FOUNDATION_HEIGHT,
        CFG_HANGAR.WIDTH,
        150
    );

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
        side: THREE.FrontSide,
        normalMap: planeNorm,
        roughness: 0.8,
    });

    cube.material = material;
    // Positionierung: Wenn die Höhe FOUNDATION_HEIGHT ist,
    // dann ist die Oberfläche bei FOUNDATION_HEIGHT / 2 (da Box zentriert ist)
    cube.position.set(CFG_HANGAR.POS_X, CFG_HANGAR.POS_Y, CFG_HANGAR.POS_Z);

    cube.receiveShadow = true;
    cube.castShadow = true;
    return cube;
}

function createWallMaterial(repeat = [1, 1]) {
    return new THREE.MeshStandardMaterial({
        map: getConfiguredTexture(ASSET_PATHS.WALL_DIFF, repeat[0], repeat[1]),
        normalMap: getConfiguredTexture(ASSET_PATHS.WALL_NORM, repeat[0], repeat[1]),
        side: THREE.FrontSide,
        roughness: 1,
    });
}

function getWall(wallLength, rotationDir) {
    const wall = basicShape.getCube(wallLength, CFG_HANGAR.WALL_WIDTH, CFG_HANGAR.WALL_HEIGHT, 256);

    const repeatFront = [2, 1];
    const repeatSide = [wallLength / 5, 1];
    const repeatTop = [10, 1];

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

    wall.receiveShadow = true;
    wall.castShadow = true;

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
        roughness: 1,
        metalness: 0.5,
    });

    roof.material = material;
    roof.rotation.z = Math.PI / 2;

    roof.castShadow = true;

    return roof;
}

export function getHangar() {
    const hangar = getFoundation(); // Das ist unser Fundament-Mesh

    // Liste der Wände, die wir hinzufügen wollen
    const walls = [
        {
            length: CFG_HANGAR.LENGTH,
            rotationDir: 'x',
            zPos: CFG_HANGAR.LENGTH / 2 - CFG_HANGAR.WALL_WIDTH - 2,
        },
        {
            length: CFG_HANGAR.LENGTH,
            rotationDir: 'x',
            zPos: -CFG_HANGAR.LENGTH / 2 + CFG_HANGAR.WALL_WIDTH + 2,
        },
        {
            length: CFG_HANGAR.WIDTH - CFG_HANGAR.WALL_WIDTH * 2,
            rotationDir: 'y',
            zPos: -CFG_HANGAR.LENGTH / 2 + CFG_HANGAR.WALL_WIDTH + 2,
        },
    ];

    // Schleife über alle Wände
    for (const element of walls) {
        const wallData = element;
        let wall = getWall(wallData.length, wallData.rotationDir);

        // Positionierung in Z (bleibt wie vorher)
        wall.position.z = wallData.zPos;
        //Positioning the Walls ontop of the foundation
        const box = new THREE.Box3().setFromObject(wall);
        wall.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 - box.min.y;

        if (wallData.rotationDir != 'x') {
            wall.position.x = CFG_HANGAR.LENGTH / 2 - 0.5;
            wall.position.z = 0;
        }

        // Zur Szene hinzufügen
        hangar.add(wall);
    }

    const roof = getBarrelRoof(CFG_HANGAR.WIDTH, 5, CFG_HANGAR.LENGTH);
    const box = new THREE.Box3().setFromObject(roof);
    roof.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 + CFG_HANGAR.WALL_HEIGHT - box.min.y;

    hangar.add(roof);

    const spot = getSpotLightSource(1, '#fcd8a6', hangar, 0, Math.PI / 3, 0);
    spot.position.set(0, 14, 0);
    hangar.add(spot);

    return hangar;
}

