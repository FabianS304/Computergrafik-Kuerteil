/**
 * 
 * @param {*} camera 
 * @param {*} renderer 
 * @returns camera Controls
 */

export function initCameraControls(camera, renderer) {

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    trackballControls.rotateSpeed = 1;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];

    return trackballControls;
}