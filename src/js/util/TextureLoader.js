//reuseable Texture-Loader

export function getMaterial(path) {
    if (!path || typeof path !== 'string') {
        throw new Error('getMaterial: invalid path');
    }
    return new THREE.TextureLoader().load(path);
}