/**
 * Used for anything with lighting
 */
import ASSET_PATHS from '../util/paths.js';
import { getGLBModel } from '../util/ModelLoader.js';

export function getDirectionalLightSource(intensity, color = 0xffffff) {
    const light = new THREE.DirectionalLight(color, intensity);

    light.castShadow = true;

    return light;
}

export function getSpotLightSource(
    intensity,
    color,
    target,
    distance = 0,
    angle = Math.PI / 4,
    preumbra = 1
) {
    const light = new THREE.SpotLight(color, intensity, distance, angle, preumbra);

    if (target) {
        light.target = target;
    }

    light.castShadow = true;

    // SCHATTEN-QUALITÄT ERHÖHEN
    light.shadow.mapSize.width = 2048; // Standard ist oft 512
    light.shadow.mapSize.height = 2048;

    // Reichweite anpassen (WICHTIG!)
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 750;
    light.castShadow = true;

    return light;
}

export function getWarningLight(
    intensity,
    color,
    rotationDir,
    distance = 0,
    angle = 1,
    preumbra = 0.1
) {
    const beacon = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3);
    const material = new THREE.MeshBasicMaterial({ color: 0x444444 });
    const base = new THREE.Mesh(geometry, material);
    beacon.add(base);

    const geo = new THREE.CylinderGeometry(0.09, 0.09, 0.3, 32, 1, false, 0, Math.PI); // Nur 180 Grad
    const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const reflector = new THREE.Mesh(geo, mat);

    beacon.add(reflector); // Reflektor ist Teil der rotierenden Gruppe

    let light = getSpotLightSource(intensity, color, reflector, distance, angle, preumbra);

    light.position.set(0.2, 0, 0);
    light.castShadow = true;

    beacon.add(light);

    function animate() {
        requestAnimationFrame(animate);
        if (rotationDir >= 0) {
            beacon.rotation.y += 0.03;
            reflector.rotation.y += 0.03;
        } else {
            beacon.rotation.y -= 0.03;
            reflector.rotation.y += 0.03;
        }
    }

    animate();
    return beacon;
}

export function getPathWayLight(color, x, z) {
    let target = new THREE.Object3D();
    target.position.set(x, z, 10);

    let light = getSpotLightSource(1, color, target, 5, Math.PI / 2, 0.5);

    getGLBModel((gltf) => {
        const model = gltf.scene;
        model.position.set(x, 0.002, z);
        light.add(model);
    }, ASSET_PATHS.FLOOR_LAMP);

    return light;
}
