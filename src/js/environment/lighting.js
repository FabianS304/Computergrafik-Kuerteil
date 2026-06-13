/**
 * Used for anything with lighting
 */

export function getNewDirectionalLightSource(intesity, color = 0xffffff, target = null) {

    const light = new THREE.DirectionalLight(color, intesity);
    if (target) {
        light.target = target;
    }

    return light;
}

