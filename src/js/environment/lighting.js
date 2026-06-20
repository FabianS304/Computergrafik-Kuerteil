/**
 * Used for anything with lighting
 */

export function getDirectionalLightSource(intensity, color = 0xffffff) {
    const light = new THREE.DirectionalLight(color, intensity);

    light.castShadow = true;

    return light;
}

export function getSpotLightSource(intensity, color, target, distance = 0, angle = Math.PI/4, preumbra = 1) {
    const light = new THREE.SpotLight(color, intensity, distance, angle, preumbra);

    if (target) {
        light.target = target;
    }

    light.castShadow = true;
    light.receiveShadow= true;

    // SCHATTEN-QUALITÄT ERHÖHEN
    light.shadow.mapSize.width = 2048; // Standard ist oft 512
    light.shadow.mapSize.height = 2048;
    
    // Reichweite anpassen (WICHTIG!)
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;


    return light;
}
