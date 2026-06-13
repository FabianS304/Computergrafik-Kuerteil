/**
 * This is the main JS-File for the project. 
 */

import * as flagReader from "./util/flagReader.js";
import * as canvasUtil from "./util/canvasUtil.js";
import * as light from "./environment/lighting.js";
import * as controls from "./control/trackball.js"
import { getPlane } from "./basicShapes/plane.js";
import ASSET_PATHS from "./util/paths.js";

document.addEventListener("DOMContentLoaded", main);

function main() {

    const debugMode = flagReader.isDebug();
    const canvas = document.querySelector("#c");
    if (!canvas) {
        throw new Error("Canvas #c not found");
    }

    if (debugMode) {
        console.log("Debug mode enabled via ?debug=true");
    }

    // init Renderer, Camera and stats (if debugMode is enabled)
    const app = {
        renderer: canvasUtil.initRenderer(canvas),
        camera: canvasUtil.initCamera(canvas),
        stats: debugMode ? canvasUtil.initStats() : null,
        scene: new THREE.Scene()
    };



    const groundPlane = getPlane(app.renderer);
    groundPlane.rotation.x = Math.PI / 2;
    app.scene.add(groundPlane);

    const sun = light.getNewDirectionalLightSource(2, 0xffffcc, groundPlane);
    sun.position.set(0, 30, 0);
    app.scene.add(sun);

    const cameraTrackball = controls.initCameraControls(app.camera, app.renderer);
    const clock = new THREE.Clock();


    render();

    function render() {

        cameraTrackball.update(clock.getDelta());
        if (debugMode && app.stats) {
            app.stats.update();
        }

        requestAnimationFrame(render);
        app.renderer.render(app.scene, app.camera);
    }
}
