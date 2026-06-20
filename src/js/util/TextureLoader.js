//reuseable Texture-Loader

export function getMaterial(path) {
    if (!path || typeof path !== 'string') {
        throw new Error('getMaterial: invalid path');
    }
    return new THREE.TextureLoader().load(path);
}

export function getConfiguredTexture(path, repeatX, repeatY) {
    const texture = new THREE.TextureLoader().load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.minFilter = THREE.NearestFilter;
    return texture;
}

