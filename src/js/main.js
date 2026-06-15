/**
 * This is the main JS-File for the project.
 */

import * as flagReader from './util/flagReader.js';
import * as canvasUtil from './util/canvasUtil.js';
import * as light from './environment/lighting.js';
import * as controls from './control/trackball.js';
import * as basicShapes from './objects/basicShapes.js';
import { getBasePlate } from './objects/Hangar.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
    const debugMode = flagReader.isDebug();
    const showStats = flagReader.isStats();
    const canvas = document.querySelector('#c');
    if (!canvas) {
        throw new Error('Canvas #c not found');
    }

    if (debugMode) {
        console.log('Debug mode enabled via ?debug=true');
    }

    // init Renderer, Camera and stats (if debugMode is enabled)
    const app = {
        renderer: canvasUtil.initRenderer(canvas),
        camera: canvasUtil.initCamera(canvas),
        stats: debugMode ? canvasUtil.initStats() : null,
        scene: new THREE.Scene(),
    };

    app.scene.background = new THREE.Color('#89CCFF')

    const groundPlane = basicShapes.getWorldPlane(app.renderer);
    groundPlane.rotation.x = Math.PI / 2;
    groundPlane.position.set(0,0,0);
    app.scene.add(groundPlane);

    const sun = light.getNewDirectionalLightSource(2.5, '#FFFFFF', groundPlane);
    sun.position.set(25, 30, -15);
    app.scene.add(sun);

    //For debuging added a sun under the groundPlane
    if(debugMode){
        const sun1 = light.getNewDirectionalLightSource(1, '#FFFFFF', groundPlane);
        sun1.position.set(0, -10, 0);
        app.scene.add(sun1);
    }
    
    const floor = getBasePlate();
    floor.position.set(100,-1.5, 180);
    console.log(floor);
    app.scene.add(floor);

    const cameraTrackball = controls.initCameraControls(app.camera, app.renderer);
    const clock = new THREE.Clock();

    render();

    function render() {
        cameraTrackball.update(clock.getDelta());
        if (showStats && app.stats) {
            app.stats.update();
        }

        if (debugMode) {
            app.scene.traverse((node => {
                if (node.isMesh || node.isGroup){
                    // X = RED, Y = GREEN, Z = BLUE
                    const axesHelper = new THREE.AxesHelper(50);
                    node.add(axesHelper);
                }
            }))
            app.stats.update();
        }

        requestAnimationFrame(render);
        app.renderer.render(app.scene, app.camera);
    }
}
