
import * as THREE from 'three';
export function makeCourt() {

    const courtGroup = new THREE.Group();
    const court = new THREE.Mesh(
        new THREE.BoxGeometry(11, 0.2, 24),
        new THREE.MeshPhongMaterial({ color: 'purple' })
    );
    const lines = 
        [
            makeLine(11, 0.07, 0,  12),
            makeLine(11, 0.07, 0, -12),
            makeLine(0.07, 24,  5.5, 0),
            makeLine(0.07, 24, -5.5, 0),
            makeLine(0.07, 24,  4.13, 0),
            makeLine(0.07, 24, -4.13, 0),
            makeLine(8.26, 0.07, 0,  5.49),
            makeLine(8.26, 0.07, 0, -5.49),
            makeLine(0.07, 10.98, 0, 0),
            makeLine(0.5, 0.07, 0,  11.75),
            makeLine(0.5, 0.07, 0, -11.75),
        ]

    const leftPost = createPost(-1);
    const rightPost = createPost(1);
    const net = createNet();

    courtGroup.add(court);
    courtGroup.add(net);
    courtGroup.add(rightPost);
    courtGroup.add(leftPost);
    lines.forEach((line) => courtGroup.add(line));

    return courtGroup;
}

function makeLine(w, d, x, z) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.02, d),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    line.position.set(x, 0.11, z);
    return line;
}


function createPost(side) {

    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.07, 12);
    const postMat = new THREE.MeshPhongMaterial({ color: 'gray' });

    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(side * 5.95, 0.635, 0);
    return post;
}


function createNet() {
    const net = new THREE.Group();
    const band = new THREE.Mesh(
        new THREE.BoxGeometry(11.9, 0.07, 0.05),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    band.position.set(0, 1.07, 0);

    net.add(band);
    const netMat = new THREE.LineBasicMaterial({ color: 'black' });
    for (let i = 0; i <= 30; i++) {
        const x = -5.95 + (i / 30) * 11.9;
        net.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x, 0.1, 0),
                new THREE.Vector3(x, 1.07, 0)
            ]), netMat
        ));
    }
    for (let i = 0; i <= 8; i++) {
        const y = 0.1 + (i / 8) * 0.97;
        net.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-5.95, y, 0),
                new THREE.Vector3( 5.95, y, 0)
            ]), netMat
        ));
    }

    return net;
}

