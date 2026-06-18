/**
 * Used for anything with lighting
 */

export function getDirectionalLightSource(intensity, color = 0xffffff) {
    const light = new THREE.DirectionalLight(color, intensity);

    light.castShadow = false;

    return light;
}

export function getSpotLightSource(intensity, color, target) {
    const light = new THREE.SpotLight(color, intensity);

    if (target) {
        light.target = target;
    }

    light.castShadow = true;
    return light;
}

