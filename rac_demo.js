
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
import {createRacquet} from './racquet.js';

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 28, 48);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight('white', 0.15));
const body = document.querySelector('body');

var r1 = createRacquet(1,2);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // REQUIRED when enableDamping = true
  renderer.render(scene, camera);
}


const axesHelper = new THREE.AxesHelper(5); // 5 is the size
scene.add(axesHelper);

scene.add(r1);
animate();

renderer.render(scene, camera);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
