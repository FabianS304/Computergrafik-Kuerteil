/**
 * This is the main JS-File for the project.
 */

import * as flagReader from './util/FlagReader.js';
import * as canvasUtil from './util/CanvasUtil.js';

import * as controls from './control/Trackball.js';

import { initDefaultScene } from './environment/Scene.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
    const isDebug = flagReader.isDebug();
    const isAxis = flagReader.isAxis();
    const canvas = document.querySelector('#c');

    if (!canvas) {
        throw new Error('Canvas #c not found');
    }

    if (isDebug) {
        console.log('Debug mode enabled via ?debug=true');
    }

    // init Renderer, Camera and stats (if debugMode is enabled)
    const app = {
        renderer: canvasUtil.initRenderer(canvas),
        camera: canvasUtil.initCamera(canvas),
        stats: isDebug ? canvasUtil.initStats() : null,
        scene: new THREE.Scene(),
    };

    app.scene = initDefaultScene(isDebug, app.renderer);
    const cameraTrackball = controls.initCameraControls(app.camera, app.renderer);
    const clock = new THREE.Clock();

    render();

    function render() {
        const delta = clock.getDelta();

        cameraTrackball.update(delta);
        if (isDebug && app.stats) {
            app.stats.update();
        }

        if (isAxis) {
            app.scene.traverse((node) => {
                if (node.isMesh || node.isGroup) {
                    // X = RED, Y = GREEN, Z = BLUE
                    const axesHelper = new THREE.AxesHelper(50);
                    node.add(axesHelper);
                }
            });
            app.stats.update();
        }
        if (globalThis.airplaneController) {
            globalThis.airplaneController.update();
        }
        if (globalThis.hangarController) {
            globalThis.hangarController.update();
        }
        

        requestAnimationFrame(render);
        app.renderer.render(app.scene, app.camera);
    }
}

