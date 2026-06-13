export function initStats(type) {

    let panelType = (type !== undefined && type) && (!Number.isNaN(type)) ? Number.parseInt(type) : 0;
    const stats = new Stats();

    stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    return stats;
}

export function initRenderer(
    canvas,
    antialias = true,
    color = new THREE.Color(0xFF0000),
    shadowMap = true) {


    const renderer = new THREE.WebGLRenderer({
        canvas, antialias: antialias
    });


    renderer.setSize(window.innerWidth, window.innerHeight);


    return renderer;
}

export function initCamera(canvas) {
    const angleOfView = 75;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 180, 430);

    return camera;
}
