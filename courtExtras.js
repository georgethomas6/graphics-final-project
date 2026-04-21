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

export function addBleachers(scene) {
    const seatMat = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const frameMat = new THREE.MeshPhongMaterial({ color: 0x999999 });

    const rows = 5;
    const treadDepth = 1.2;
    const riserHeight = 0.5;
    const length = 28;

    [-1, 1].forEach(side => {
        const startX = side * 11;

        for (let i = 0; i < rows; i++) {
            const seatX = startX + side * (i * treadDepth + treadDepth / 2);
            const seatY = i * riserHeight + 0.1;

            const seat = new THREE.Mesh(
                new THREE.BoxGeometry(treadDepth, 0.12, length),
                seatMat
            );
            seat.position.set(seatX, seatY, 0);
            scene.add(seat);

            if (i > 0) {
                const riserX = startX + side * i * treadDepth;
                const riserY = i * riserHeight - riserHeight / 2 + 0.1;
                const riser = new THREE.Mesh(
                    new THREE.BoxGeometry(0.12, riserHeight, length),
                    frameMat
                );
                riser.position.set(riserX, riserY, 0);
                scene.add(riser);
            }
        }

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(rows * treadDepth, 0.15, length),
            frameMat
        );
        base.position.set(startX + side * (rows * treadDepth / 2), -0.08, 0);
        scene.add(base);
    });
}
