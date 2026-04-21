import * as THREE from 'three';

export function makeConcreteTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#a0a09a';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 4000; i++) {
        const v = Math.floor(Math.random() * 40 - 20);
        const g = 160 + v;
        ctx.fillStyle = `rgb(${g},${g},${g - 4})`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 3, 3);
    }

    ctx.strokeStyle = 'rgba(80,80,75,0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 128; i < size; i += 128) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

export function makeGrassTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    for (let row = 0; row < size; row += 16) {
        ctx.fillStyle = (Math.floor(row / 16) % 2 === 0) ? '#2d6e1f' : '#357a25';
        ctx.fillRect(0, row, size, 16);
    }

    ctx.fillStyle = 'rgba(80,200,40,0.18)';
    for (let i = 0; i < 300; i++) {
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

export function makeCourtTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2e5f9e';
    ctx.fillRect(0, 0, size, size);

    for (let y = 0; y < size; y += 3) {
        for (let x = 0; x < size; x += 3) {
            const v = Math.floor(Math.random() * 24 - 12);
            ctx.fillStyle = `rgba(${128 + v},${128 + v},${255},0.05)`;
            ctx.fillRect(x, y, 3, 3);
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

export function makeTennisBallTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#c8c832';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 800; i++) {
        ctx.fillStyle = 'rgba(160,160,0,0.35)';
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let seam = 0; seam < 2; seam++) {
        const phase = seam * Math.PI;
        ctx.beginPath();
        for (let x = 0; x <= size; x++) {
            const y = size / 2 + Math.sin((x / size) * Math.PI * 2 + phase) * 52;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
}