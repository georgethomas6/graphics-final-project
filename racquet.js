
import * as THREE from 'three';

// creates the head of the racquet
// possible to create racquet head with pattern via pathToTexture
// possible to color racquet via color
// returns the racquet mesh
function createRacquetHead(width, height, pathToTexture = null, color = 0x000000) {
    const ellipse2D = new THREE.EllipseCurve(0, 0, width, height);

    const points2D = ellipse2D.getPoints(100);
    const points3D = points2D.map(p => new THREE.Vector3(p.x, p.y, 0));

    const curve = new THREE.CatmullRomCurve3(points3D, true);

    const headGeo = new THREE.TubeGeometry(
        curve,
        100,
        0.05,
        8,
        true
    );

    let mat;

    if (pathToTexture === null) {
        mat = new THREE.MeshStandardMaterial({ color });
    } else {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(pathToTexture, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            const length = curve.getLength();
            t.repeat.set(length * 0.5, 1);
        }, () => console.log("Texture loaded successfully"),
            undefined,
            () => console.error("Failed to load texture:", pathToTexture));

        mat = new THREE.MeshPhongMaterial({ map: texture });
    }

    return new THREE.Mesh(headGeo, mat);
}

// creates one side of the throat of the racquet and colors it color
function createThroat(headWidth, headHeight, side, pathToTexture= null, color = 0x000000) {
    const neckCurve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -headHeight * 2,0) , new THREE.Vector3(0.5, -2, 0), new THREE.Vector3(0.75, negYCordOnEllipse(0.75, headWidth, headHeight),0) )
    const neckGeo = new THREE.TubeGeometry(
        neckCurve,
        100,  
        0.05,
        8,  
        false 
    );
    let mat;

    if (pathToTexture === null) {
        mat = new THREE.MeshStandardMaterial({ color });
    } else {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(pathToTexture, (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            const length = curve.getLength();
            t.repeat.set(length * 0.5, 1);
        }, () => console.log("Texture loaded successfully"),
            undefined,
            () => console.error("Failed to load texture:", pathToTexture));

        mat = new THREE.MeshPhongMaterial({ map: texture });
    }
    const neck = new THREE.Mesh(neckGeo, mat);
    if (side == -1) {
        neck.scale.x = -1;
    }
    return neck;
}

// creates the handle material
function createHandle(headHeight, color = 0x000000) {
    const handleHeight = headHeight * 1.25;
    const mat = new THREE.MeshStandardMaterial({ color: color});
    const geo = new THREE.CylinderGeometry(0.075, 0.075, handleHeight);
    geo.translate(0, -handleHeight / 2,0);
    return new THREE.Mesh(geo, mat);
}


function negYCordOnEllipse(x, xRadius, yRadius) {
    return -yRadius * Math.sqrt(1 - (x*x)/(xRadius*xRadius));
};


// creates the strings in the racquet
// returns an array of cyliner meshes
function string(headWidth, headHeight, color) {
    // 16 x 19 is common string pattern for tennis racquets
    // we subtract episilon from 2*headWidth to compensate for strings not starting on edge
    const stringDx = (2*headWidth - headWidth / 4 ) / 16;
    const stringDy = (2*headHeight - headHeight / 8) / 19;

    var strings = [];

    const mat = new THREE.MeshStandardMaterial({ color: color });
    for (var x = 0; x < 16; x++) {
        const stringHeight = -2 * negYCordOnEllipse(x * stringDx - headWidth + headWidth / 8, headWidth, headHeight);
        const geo = new THREE.CylinderGeometry(0.02, 0.02, stringHeight);
        geo.translate(0, -stringHeight / 2, 0);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y += stringHeight / 2;
        mesh.position.x = x * stringDx  - headWidth + headWidth / 6;
        strings.push(mesh);
    }

    // horizontal strings are just the vertical strings when the ellipse is rotated
    // copy same functionality as above and then rotate the strings
    for (var x = 0; x < 19; x++){
        const stringWidth = -2 * negYCordOnEllipse(x * stringDy - headHeight + headHeight / 16, headHeight, headWidth);
        const geo = new THREE.CylinderGeometry(0.02, 0.02, stringWidth);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotateZ(Math.PI / 2);
        mesh.position.y = x * stringDy - headHeight + headWidth / 6;
        strings.push(mesh);
    }


    return strings;
};

// creates a racquet with the given parameters
export function createRacquet(headWidth, headHeight, headColor = 0x000000, throatColor= 0x000000, handleColor= 0x000000, stringColor= 0xFF0000) {

    const racquet = new THREE.Group();
    const head = createRacquetHead(headWidth, headHeight, null, headColor);

    const rightThroat = createThroat(headWidth, headHeight, 1, null, throatColor);
    const leftThroat = createThroat(headWidth, headHeight, -1, null, throatColor);
    const handle = createHandle(headHeight, handleColor);
    const strings = string(headWidth, headHeight, stringColor);
    strings.map((string) => racquet.add(string));

    racquet.add(head);
    racquet.add(leftThroat);
    racquet.add(handle);
    racquet.add(rightThroat);
    handle.position.y = -headHeight * 2;
    return racquet;
}

