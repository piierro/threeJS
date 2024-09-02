import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './init';
import Site3dThree from './Site3dThree';
import './style.css';

const { sizes, camera, scene, controls, renderer } = init();
camera.position.set(0, 1, 3);

const setupLighting = () => {
    const hemLight = new THREE.HemisphereLight(0xffffff, 0.6);
    hemLight.position.set(0, 50, 0);
    scene.add(hemLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-8, 12, -8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);
};

const site3d = new Site3dThree();

const loadModel = async (path) => {
    const loader = new GLTFLoader();
    try {
        const gltf = await new Promise((resolve, reject) => {
            loader.load(path, resolve, undefined, reject);
        });
        
        const model = gltf.scene;
        scene.add(model);

        site3d.object3dToBoundCenter(model);
        displayBoundingBoxes(model);

        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
};

const displayBoundingBoxes = (model) => {
    const meshes = site3d.getObject3dMeshes(model);
    meshes.forEach((mesh) => {
        const boundingBox = getBoundingBox(mesh);
        if (boundingBox) {
            const boxWorld = boundingBox.clone().applyMatrix4(mesh.matrixWorld);
            const boxHelper = new THREE.Box3Helper(boxWorld, new THREE.Color(0xff0000));
            scene.add(boxHelper);
        }
    });
};

const getBoundingBox = (mesh) => {
    mesh.geometry.computeBoundingBox();
    return mesh.geometry.boundingBox;
};

const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

window.addEventListener('resize', () => {
    const sizes = { width: window.innerWidth, height: window.innerHeight };
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// Основной код
setupLighting();
loadModel('/models/model1.glb');
animate();