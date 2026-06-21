import ASSET_PATHS from '../util/Paths.js';
import * as basicShape from './BasicShapes.js';
import { getMaterial, getConfiguredTexture } from '../util/TextureLoader.js';
import { WORLD_CONFIG } from '../util/Config.js';
import { getSpotLightSource } from '../environment/Lighting.js';
import { getGLBModel } from '../util/ModelLoader.js';
/**
 * Baseplate
 */

const CFG_HANGAR = WORLD_CONFIG.HANGAR;

function getFoundation() {
    const cube = basicShape.getCube(
        CFG_HANGAR.FOUNDATION_LENGTH,
        CFG_HANGAR.FOUNDATION_HEIGHT,
        CFG_HANGAR.FOUNDATION_WIDTH,
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

    const repeatFront = [CFG_HANGAR.WALL_HEIGHT / 2, 1];
    const repeatSide = [wallLength / 5, 2];
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

    const norm = getMaterial(ASSET_PATHS.ROOF_NORM);
    norm.wrapS = THREE.RepeatWrapping;
    norm.wrapT = THREE.RepeatWrapping;
    norm.repeat.set(4, 1);
    norm.minFilter = THREE.NearestFilter;

    const material = new THREE.MeshStandardMaterial({
        map: map,
        normalMap: norm,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0.5,
    });

    roof.material = material;
    roof.rotation.z = Math.PI / 2;

    roof.castShadow = true;

    const backGable = basicShape.getGableWall(width / 2, width - 15);
    backGable.position.y = -CFG_HANGAR.FOUNDATION_LENGTH / 2;

    backGable.rotation.x = Math.PI / 2;
    backGable.rotation.z = Math.PI / 2;

    const backMap = getMaterial(ASSET_PATHS.ROOF_DIFF);
    backMap.wrapS = THREE.RepeatWrapping;
    backMap.wrapT = THREE.RepeatWrapping;
    backMap.repeat.set(2, 2);
    backMap.minFilter = THREE.NearestFilter;

    const backNorm = getMaterial(ASSET_PATHS.ROOF_NORM);
    backNorm.wrapS = THREE.RepeatWrapping;
    backNorm.wrapT = THREE.RepeatWrapping;
    backNorm.repeat.set(2, 2);
    backNorm.minFilter = THREE.NearestFilter;

    const backWallMaterial = new THREE.MeshStandardMaterial({
        map: backMap,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0.5,
        normalMap: norm,
    });

    backGable.castShadow = true;
    backGable.material = backWallMaterial;

    roof.add(backGable);

    const frontGable = basicShape.getGableWall(width / 2, width - 15);
    frontGable.position.y = CFG_HANGAR.FOUNDATION_LENGTH / 2;

    frontGable.rotation.x = Math.PI / 2;
    frontGable.rotation.z = Math.PI / 2;

    frontGable.castShadow = true;
    frontGable.material = backWallMaterial;
    roof.add(frontGable);

    return roof;
}

function getDoor() {
    const door = basicShape.getCube(
        CFG_HANGAR.FOUNDATION_WIDTH / 2,
        CFG_HANGAR.WALL_HEIGHT + CFG_HANGAR.FOUNDATION_HEIGHT,
        0.3,
        126
    );

    const doorMap = getMaterial(ASSET_PATHS.DOOR_DIFF);
    doorMap.wrapS = THREE.RepeatWrapping;
    doorMap.wrapT = THREE.RepeatWrapping;
    // Stelle hier das Repeat ein, das FÜR DIE WAND passt (z.B. 1, 1 oder 2, 1)
    doorMap.repeat.set(5, 5);
    doorMap.minFilter = THREE.NearestFilter;

    const doorMaterial = new THREE.MeshStandardMaterial({
        map: doorMap,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0.5,
    });

    door.material = doorMaterial;

    door.castShadow = true;

    return door;
}

export function getHangar() {
    const hangar = getFoundation(); // Das ist unser Fundament-Mesh

    // Liste der Wände, die wir hinzufügen wollen
    const walls = [
        {
            length: CFG_HANGAR.FOUNDATION_LENGTH,
            rotationDir: 'x',
            zPos: CFG_HANGAR.FOUNDATION_LENGTH / 2 - CFG_HANGAR.WALL_WIDTH - 2,
        },
        {
            length: CFG_HANGAR.FOUNDATION_LENGTH,
            rotationDir: 'x',
            zPos: -CFG_HANGAR.FOUNDATION_LENGTH / 2 + CFG_HANGAR.WALL_WIDTH + 2,
        },
        {
            length: CFG_HANGAR.FOUNDATION_WIDTH - CFG_HANGAR.WALL_WIDTH * 2,
            rotationDir: 'y',
            zPos: -CFG_HANGAR.FOUNDATION_LENGTH / 2 + CFG_HANGAR.WALL_WIDTH + 2,
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
            wall.position.x = CFG_HANGAR.FOUNDATION_LENGTH / 2 - 0.5;
            wall.position.z = 0;
        }

        // Zur Szene hinzufügen
        hangar.add(wall);
    }

    const roof = getBarrelRoof(CFG_HANGAR.FOUNDATION_WIDTH, 5, CFG_HANGAR.FOUNDATION_LENGTH);
    const box = new THREE.Box3().setFromObject(roof);
    roof.position.y = CFG_HANGAR.FOUNDATION_HEIGHT / 2 + CFG_HANGAR.WALL_HEIGHT - box.min.y;

    hangar.add(roof);

    const spot = getSpotLightSource(5, '#fcd8a6', hangar, 0, Math.PI / 2.5, 1);
    spot.position.set(0, 10, 0);
    hangar.add(spot);

    const doorLeft = getDoor();
    doorLeft.position.set(
        -CFG_HANGAR.FOUNDATION_WIDTH / 2 - 2.7,
        CFG_HANGAR.WALL_HEIGHT / 2,
        -CFG_HANGAR.FOUNDATION_LENGTH / 4
    );
    doorLeft.rotation.y = Math.PI / 2;

    hangar.add(doorLeft);

    const doorRight = getDoor();
    doorRight.position.set(
        -CFG_HANGAR.FOUNDATION_WIDTH / 2 - 2.7,
        CFG_HANGAR.WALL_HEIGHT / 2,
        CFG_HANGAR.FOUNDATION_LENGTH / 4
    );
    doorRight.rotation.y = Math.PI / 2;

    hangar.add(doorRight);

    globalThis.hangarController = new HangarController(hangar, doorLeft, doorRight, spot);

    return setUpProps(hangar);
}

function setUpProps(hangar) {
    const poster = basicShape.getPlane(3, 2, 128);

    const posterMap = getMaterial(ASSET_PATHS.POSTER);
    posterMap.wrapS = THREE.RepeatWrapping;
    posterMap.wrapT = THREE.RepeatWrapping;
    posterMap.repeat.set(1, 1);
    posterMap.minFilter = THREE.NearestFilter;
    const posterMaterial = new THREE.MeshStandardMaterial({
        map: posterMap,
        side: THREE.DoubleSide,
        roughness: 1,
    });

    poster.material = posterMaterial;
    poster.position.set(0, 2, -CFG_HANGAR.FOUNDATION_WIDTH / 2 + CFG_HANGAR.WALL_WIDTH + 0.001);

    hangar.add(poster);

    getGLBModel((gltf) => {
        const desk = gltf.scene;
        desk.position.set(
            0,
            CFG_HANGAR.FOUNDATION_HEIGHT / 2 + 0.001,
            -CFG_HANGAR.FOUNDATION_WIDTH / 2 + CFG_HANGAR.WALL_WIDTH * 1.5 + 0.001
        );

        enableShadow(desk);

        const desk2 = desk.clone();
        desk2.position.x += 2;
        const desk3 = desk.clone();
        desk3.position.x -= 2;
        hangar.add(desk, desk2, desk3);
    }, ASSET_PATHS.METAL_DESK);

    getGLBModel((gltf) => {
        const chair = gltf.scene;
        chair.position.set(
            0,
            CFG_HANGAR.FOUNDATION_HEIGHT / 2 + 0.001,
            -CFG_HANGAR.FOUNDATION_WIDTH / 2 + CFG_HANGAR.WALL_WIDTH * 1.5 + 0.001 + 1
        );
        enableShadow(chair);

        const chair2 = chair.clone();
        chair2.position.x += 2;
        chair2.position.z -= 0.7;
        chair2.rotation.y = Math.PI;

        const chair3 = chair2.clone();
        chair3.position.x -= 4;

        chair.rotation.y = Math.PI / 2 + 40;
        hangar.add(chair, chair2, chair3);
    }, ASSET_PATHS.WOODEN_CHAIR);

    getGLBModel((gltf) => {
        const cart = gltf.scene;
        cart.position.set(
            5,
            CFG_HANGAR.FOUNDATION_HEIGHT / 2 + 0.001,
            -CFG_HANGAR.FOUNDATION_WIDTH / 2 + CFG_HANGAR.WALL_WIDTH * 1.5 + 0.05
        );
        enableShadow(cart);
        hangar.add(cart);
    }, ASSET_PATHS.COFFEE_CART);

    getGLBModel((gltf) => {
        const baseRack = gltf.scene;

        const rackCount = 5; // Anzahl der Regale
        const startX = -10; // Startposition X
        const spacing = 1; // Abstand zwischen den Regalen
        baseRack.position.set(
            startX,
            CFG_HANGAR.FOUNDATION_HEIGHT / 2 + 0.001,
            -CFG_HANGAR.FOUNDATION_WIDTH / 2 + CFG_HANGAR.WALL_WIDTH * 1.2
        );
        enableShadow(baseRack);
        hangar.add(baseRack);
        for (let i = 0; i < rackCount; i++) {
            const rack = baseRack.clone();

            // Position berechnen: Startwert + (Index * Abstand)
            rack.position.set(startX + i * spacing, baseRack.position.y, baseRack.position.z);

            hangar.add(rack);
        }
    }, ASSET_PATHS.METAL_RACK_1);

    getGLBModel((gltf) => {
        const baseRack = gltf.scene;

        const rackCount = 15; // Anzahl der Regale
        const startX = -10; // Startposition X
        const spacing = 1; // Abstand zwischen den Regalen
        baseRack.position.set(
            startX,
            CFG_HANGAR.FOUNDATION_HEIGHT / 2 + 0.001,
            CFG_HANGAR.FOUNDATION_WIDTH / 2 - CFG_HANGAR.WALL_WIDTH * 1.2
        );
        enableShadow(baseRack);
        hangar.add(baseRack);
        for (let i = 0; i < rackCount; i++) {
            const rack = baseRack.clone();

            // Position berechnen: Startwert + (Index * Abstand)
            rack.position.set(startX + i * spacing, baseRack.position.y, baseRack.position.z);

            hangar.add(rack);
        }
    }, ASSET_PATHS.METAL_RACK_1);

    return hangar;
}

function enableShadow(object, type = 'cast') {
    if (type === 'cast') {
        object.traverse((node) => {
            node.castShadow = true;
            if (node.isMesh) {
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                }
            }
        });
    } else {
        object.traverse((node) => {
            node.receiveShadow = true;
            if (node.isMesh) {
                if (node.material) {
                    node.material.side = THREE.DoubleSide;
                }
            }
        });
    }
}

export class HangarController {
    constructor(hangar, doorLeft, doorRight, spot) {
        this.hangar = hangar;
        this.controls = {
            lightIntensity: 5,
            doorOpening: 6,
        };

        this.initGUI();

        this.doorLeft = doorLeft;
        this.doorRight = doorRight;
        this.spotLight = spot;
        console.log(this.doorLeft, this.doorRight, this.spotLight); // Falls vorhanden
    }

    initGUI() {
        this.gui = new dat.GUI();
        this.gui.add(this.controls, 'lightIntensity', 0, 5).name('Lichtintensität');
        this.gui.add(this.controls, 'doorOpening', 6, 13).name('Tür Öffnung');
    }

    update() {
        // Beispiel-Aktualisierungen
        if (this.doorLeft) {
            this.doorLeft.position.z = this.controls.doorOpening;
        }
        if (this.doorRight) {
            this.doorRight.position.z = -this.controls.doorOpening;
        }
        if (this.spotLight) {
            this.spotLight.intensity = this.controls.lightIntensity;
        }
    }
}