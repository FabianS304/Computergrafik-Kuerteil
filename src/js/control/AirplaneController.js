export class AirplaneController {
    constructor(jet) {
        this.jet = jet;
        this.controls = {
            rudder: 0,
            canopy: 0,
            falps: 1,
            elevator: 0,
        };

        this.initGUI();

        this.canopy = jet.getObjectByName('Canopy');
        this.rudder = jet.getObjectByName('Rudder');
        this.elevator = jet.getObjectByName('Elevator');
    }

    initGUI() {
        this.gui = new dat.GUI();
        this.gui.add(this.controls, 'rudder', -Math.PI / 4, Math.PI / 4);
        this.gui.add(this.controls, 'canopy', 0, Math.PI / 4);
        this.gui.add(this.controls, 'elevator', -Math.PI / 4, Math.PI / 4);
    }

    update() {
        this.canopy.rotation.y = this.controls.canopy;
        this.rudder.rotation.z = this.controls.rudder;
        this.elevator.rotation.y = this.controls.elevator;
    }
}