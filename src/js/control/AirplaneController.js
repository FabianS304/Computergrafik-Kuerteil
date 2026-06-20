export class AirplaneController {
    constructor(jet) {
        this.jet = jet;
        this.controls = {
            rudder: 0,
        };
        
        this.initGUI();
    }

    initGUI() {
        this.gui = new dat.GUI();
        this.gui.add(this.controls, 'rudder', -Math.PI / 4, Math.PI / 4);
    }

    update() {
        const lRudder = this.jet.getObjectByName('Object_187');
        const rRudder = this.jet.getObjectByName('Object_182');


        lRudder.rotation.x = this.controls.rudder;
        rRudder.rotation.x = this.controls.rudder;
    }
}