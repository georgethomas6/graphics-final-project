import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeCourt } from './court.js';
import { ballBounceCurve, racquetX } from './animation.js';
import { addFence, addSpotlights } from './courtExtras.js';
import {createRacquet} from './racquet.js';

var dt = 0.010;
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

const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshPhongMaterial({ color: 'white' })
);
center.position.set(0,0,0);
scene.add(center);
let t = 0;
let reverse = false;

let r1 = createRacquet(1,2);
let r2 = createRacquet(1,2);

r1.scale.set(0.25,0.25,0.25);
r2.scale.set(0.25,0.25,0.25);

r1.position.set(0, 3, 10);
r2.position.set(0, 3, -10);

scene.add(r1);
scene.add(r2);

let x_previous = -1;
let x_initial = -1;
let x_final = -1;

function animate() {
    requestAnimationFrame(animate);

    if (x_initial === -1 && x_final === -1) {
        x_initial = Math.random() * 6; 
        x_final = Math.random() * 6; 
        x_previous = x_initial;
    }
    
    t += dt;

    let raquetHeight = Math.abs( Math.sin( 1 * Math.PI + Math.PI / 4)) * 5;
    if (reverse) {

    r1.position.set(racquetX(t, x_previous, x_final), raquetHeight, 10);
    } else {
    r2.position.set(racquetX(t, x_previous, x_final), raquetHeight, -10);
    }


    if (t >= 1 ) {
        reverse = !reverse;
        x_previous = x_initial;
        x_initial = x_final;
        x_final = Math.random() * 6; 
        if (Math.random() > 0.5) {
            x_final *= -1;
        }
        t = 0;
    }

    ball.position.copy(ballBounceCurve(t, reverse, x_initial, x_final));
    controls.update();
    renderer.render(scene, camera);
}
animate();

addFence(scene);
addSpotlights(scene);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
