import * as THREE from 'three';
import { makeConcreteTexture } from './textures.js';

export function addFence(scene) {
    const concreteTex = makeConcreteTexture();
    concreteTex.repeat.set(10, 18);
    const concreteFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 36),
        new THREE.MeshPhongMaterial({ map: concreteTex })
    );
    concreteFloor.rotation.x = -Math.PI / 2;
    concreteFloor.position.y = -0.09;
    scene.add(concreteFloor);

    const postMat = new THREE.MeshPhongMaterial({ color: 'gray' });
    const wireMat = new THREE.MeshPhongMaterial({ color: 'silver' });
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 4, 8);

    const xs = [-10, -5, 0, 5, 10];
    const zs = [-18, -10.8, -3.6, 3.6, 10.8, 18];

    xs.forEach(x => [-18, 18].forEach(z => {
        const p = new THREE.Mesh(postGeo, postMat);
        p.position.set(x, 2, z);
        scene.add(p);
    }));

    zs.forEach(z => [-10, 10].forEach(x => {
        const p = new THREE.Mesh(postGeo, postMat);
        p.position.set(x, 2, z);
        scene.add(p);
    }));

    [1, 2, 3].forEach(y => {
        [-18, 18].forEach(z => {
            const r = new THREE.Mesh(new THREE.BoxGeometry(20, 0.05, 0.05), wireMat);
            r.position.set(0, y, z);
            scene.add(r);
        });
        [-10, 10].forEach(x => {
            const r = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 36), wireMat);
            r.position.set(x, y, 0);
            scene.add(r);
        });
    });
}

export function addBleachers(scene) {
    const seatMat = new THREE.MeshPhongMaterial({ color: 'burlywood' });
    const frameMat = new THREE.MeshPhongMaterial({ color: 'dimgray' });

    const numRows = 5;
    const stepW = 1.2;   
    const stepH = 0.5;    
    const seatThick = 0.12;
    const bleacherLen = 30; 

    [-1, 1].forEach(side => {
        const baseX = side * 12;

        for (let i = 0; i < numRows; i++) {
            const seatX = baseX + side * (i * stepW + stepW / 2);
            const seatY = i * stepH + seatThick / 2;

            const seat = new THREE.Mesh(
                new THREE.BoxGeometry(stepW, seatThick, bleacherLen),
                seatMat
            );
            seat.position.set(seatX, seatY, 0);
            scene.add(seat);
        }

        for (let i = 1; i <= numRows; i++) {
            const legX = baseX + side * i * stepW;
            const legH = i * stepH;
            [-bleacherLen / 2, bleacherLen / 2].forEach(z => {
                const leg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, legH, 0.1),
                    frameMat
                );
                leg.position.set(legX, legH / 2, z);
                scene.add(leg);
            });
        }

        for (let i = 1; i <= numRows; i++) {
            const beamX = baseX + side * i * stepW;
            const beamY = i * stepH;
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.1, bleacherLen),
                frameMat
            );
            beam.position.set(beamX, beamY, 0);
            scene.add(beam);
        }
    });
}

export function addSpotlights(scene) {
    const grayMat = new THREE.MeshPhongMaterial({ color: 'gray' });
    const bulbMat = new THREE.MeshPhongMaterial({ color: 'yellow', emissive: 'yellow' });
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);

    const lights = [
        [[-9, -16], [-2.75, 0, -6]],
        [[ 9, -16], [ 2.75, 0, -6]],
        [[-9,  16], [-2.75, 0,  6]],
        [[ 9,  16], [ 2.75, 0,  6]],
    ];

    lights.forEach(([[x, z], target]) => {
        const dir = x < 0 ? 0.6 : -0.6;

        const pole = new THREE.Mesh(poleGeo, grayMat);
        pole.position.set(x, 5, z);
        scene.add(pole);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), grayMat);
        arm.position.set(x, 10, z);
        scene.add(arm);

        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), grayMat);
        housing.position.set(x + dir, 9.85, z);
        scene.add(housing);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), bulbMat);
        bulb.position.set(x + dir, 9.65, z);
        scene.add(bulb);

        const spot = new THREE.SpotLight('white', 150, 60, Math.PI / 5, 0.3);
        spot.position.set(x + dir, 9.65, z);
        spot.target.position.set(...target);
        spot.castShadow = true;
        spot.shadow.mapSize.width = 1024;
        spot.shadow.mapSize.height = 1024;
        scene.add(spot);
        scene.add(spot.target);
    });
}
