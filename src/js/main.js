/**
 * This is the main JS-File for the project.
 */

import * as flagReader from './util/flagReader.js';
import * as canvasUtil from './util/canvasUtil.js';
import * as light from './environment/lighting.js';
import * as controls from './control/trackball.js';
import * as basicShapes from './objects/basicShapes.js';
import * as cfg from './util/Config.js';
import { getBasePlate } from './objects/Hangar.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
    const debugMode = flagReader.isDebug();
    const showStats = flagReader.isStats();
    const canvas = document.querySelector('#c');
    const cfg_scene = cfg.WORLD_CONFIG.SCENE;

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

    app.scene.background = new THREE.Color('#002746');

    const groundPlane = basicShapes.getWorldPlate(app.renderer);
    groundPlane.rotation.x = Math.PI / 2;
    groundPlane.position.set(0, 0, 0);
    app.scene.add(groundPlane);

    const sun = light.getNewDirectionalLightSource(cfg_scene.SUN_INTENSITY, '#fad8d8', groundPlane);
    sun.position.set(15, 30, 0);
    app.scene.add(sun);

    //For debuging added a sun under the groundPlane
    if (debugMode) {
        const sun1 = light.getNewDirectionalLightSource(1, '#FFFFFF', groundPlane);
        sun1.position.set(0, -10, 0);
        app.scene.add(sun1);
    }

    const floor = getBasePlate();
    floor.position.set(
        cfg.WORLD_CONFIG.Hangar.POS_X,
        cfg.WORLD_CONFIG.Hangar.POS_Z,
        cfg.WORLD_CONFIG.Hangar.POS_Y
    );
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
            app.scene.traverse((node) => {
                if (node.isMesh || node.isGroup) {
                    // X = RED, Y = GREEN, Z = BLUE
                    const axesHelper = new THREE.AxesHelper(50);
                    node.add(axesHelper);
                }
            });
            app.stats.update();
        }

        requestAnimationFrame(render);
        app.renderer.render(app.scene, app.camera);
    }
}
