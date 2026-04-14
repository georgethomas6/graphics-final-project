
import * as THREE from 'three';

export function ballBounceCurve(t, reverse) {

    let z;
    if (reverse) {
        z = -10 + 10 * t / Math.PI; 
    } else {
        z = 10 - 10 * t / Math.PI; 
    }
    const y = Math.abs(Math.cos(t)) * 3;
    

    return new THREE.Vector3(0, y, z);
}
