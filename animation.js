
import * as THREE from 'three';


export function ballBounceCurve(t, reverse, x_initial, x_final) {

    // horizontal motion
    const x = (1 - t) * x_initial + t * x_final;

    const z = reverse
        ? -10 + 20 * t
        : 10 - 20 * t;

    let y = Math.abs( Math.sin( t * Math.PI + Math.PI / 4)) * 5;

    return new THREE.Vector3(x, y, z);
}

export function racquetX(t, x_initial, x_final) {
    return (1 - t) * x_initial + t * x_final;
}
