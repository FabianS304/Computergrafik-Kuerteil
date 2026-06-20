import ASSET_PATHS from '../util/paths.js';

export function getAirplane(callback) {
    const path = ASSET_PATHS.JETPLANE;
    console.log('Versuche Modell zu laden von:', path);

    // Wir prüfen, ob GLTFLoader global verfügbar ist
    // Oft ist es direkt 'GLTFLoader' oder 'THREE.GLTFLoader'
    const LoaderClass = THREE.GLTFLoader !== 'undefined' ? THREE.GLTFLoader : GLTFLoader;

    if (!LoaderClass) {
        console.error('GLTFLoader ist nicht definiert! Prüfe die Einbindung in der index.html.');
        return;
    }

    const loader = new LoaderClass();

     loader.load(
        path,
        (gltf) => {
            console.log('Modell erfolgreich geladen!');
            callback(gltf); 
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% geladen');
        },
        (error) => {
            console.error('Konnte Modell nicht laden:', error);
        }
    );
}

