import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeCourt } from './court.js';
import { ballBounceCurve } from './animation.js';
import { addFence, addSpotlights } from './courtExtras.js';

var dt = 0.05;
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

const court = makeCourt();
scene.add(court);

const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshPhongMaterial({ color: 'yellow' })
);
ball.position.set(0, 3, 10);
scene.add(ball);

let t = 0;
let reverse = false;


function animate() {
    requestAnimationFrame(animate);

    t += dt;

    if (t >= 2 * Math.PI) {
        reverse = !reverse;
        t = 0;
    }

    ball.position.copy(ballBounceCurve(t, reverse));
    controls.update();
    renderer.render(scene, camera);    renderer.render(scene, camera);
}
animate();

addFence(scene);
addSpotlights(scene);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
