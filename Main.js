import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeCourt } from './court.js';
import { ballBounceCurve } from './animation.js';
import { addFence, addSpotlights, addBleachers } from './courtExtras.js';
import { makeGrassTexture } from './textures.js';

var dt = 0.05;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setClearColor('black', 0);
document.body.appendChild(renderer.domElement);
document.body.style.backgroundColor = 'black';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 28, 48);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight('white', 0.15));

function random(min, max) {
  return min + Math.random() * (max + 1 - min);
}
const body = document.querySelector('body');
const canvasSize = body.offsetWidth * body.offsetHeight;
const starsFraction = canvasSize / 2000;

for(let i = 0; i < starsFraction; i++) {
  let xPos = random(0, 100);
  let yPos = random(0, 100);
  let alpha = random(0.5, 1);
  let size = random(1, 2);
  let colour = 'white';

  const star = document.createElement('div');
  star.style.position = 'fixed';
  star.style.zIndex = '-1';
  star.style.borderRadius = '50%';
  star.style.left = xPos + '%';
  star.style.top = yPos + '%';
  star.style.opacity = alpha;
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  star.style.backgroundColor = colour;
  document.body.appendChild(star);
}

const grassTex = makeGrassTexture();
grassTex.repeat.set(20, 20);
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ map: grassTex })
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
    renderer.render(scene, camera);
}
animate();

addFence(scene);
addSpotlights(scene);
addBleachers(scene);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
