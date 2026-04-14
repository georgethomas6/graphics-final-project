import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addFence, addSpotlights } from './courtExtras.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 28, 48);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight('white', 0.5));
const sun = new THREE.DirectionalLight('white', 1.2);
sun.position.set(20, 40, 20);
sun.castShadow = true;
scene.add(sun);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 'darkgreen' })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

const court = new THREE.Mesh(
    new THREE.BoxGeometry(11, 0.2, 24),
    new THREE.MeshPhongMaterial({ color: 'purple' })
);
scene.add(court);

function makeLine(w, d, x, z) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.02, d),
        new THREE.MeshPhongMaterial({ color: 'white' })
    );
    line.position.set(x, 0.11, z);
    scene.add(line);
}

makeLine(11, 0.07, 0,  12);
makeLine(11, 0.07, 0, -12);
makeLine(0.07, 24,  5.5, 0);
makeLine(0.07, 24, -5.5, 0);
makeLine(0.07, 24,  4.13, 0);
makeLine(0.07, 24, -4.13, 0);
makeLine(8.26, 0.07, 0,  5.49);
makeLine(8.26, 0.07, 0, -5.49);
makeLine(0.07, 10.98, 0, 0);
makeLine(0.5, 0.07, 0,  11.75);
makeLine(0.5, 0.07, 0, -11.75);

const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.07, 12);
const postMat = new THREE.MeshPhongMaterial({ color: 'gray' });

const leftPost = new THREE.Mesh(postGeo, postMat);
leftPost.position.set(-5.95, 0.635, 0);
scene.add(leftPost);

const rightPost = new THREE.Mesh(postGeo, postMat);
rightPost.position.set(5.95, 0.635, 0);
scene.add(rightPost);

const band = new THREE.Mesh(
    new THREE.BoxGeometry(11.9, 0.07, 0.05),
    new THREE.MeshPhongMaterial({ color: 'white' })
);
band.position.set(0, 1.07, 0);
scene.add(band);

const netMat = new THREE.LineBasicMaterial({ color: 'black' });
for (let i = 0; i <= 30; i++) {
    const x = -5.95 + (i / 30) * 11.9;
    scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, 0.1, 0),
            new THREE.Vector3(x, 1.07, 0)
        ]), netMat
    ));
}
for (let i = 0; i <= 8; i++) {
    const y = 0.1 + (i / 8) * 0.97;
    scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-5.95, y, 0),
            new THREE.Vector3( 5.95, y, 0)
        ]), netMat
    ));
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
addFence(scene);
addSpotlights(scene);
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
