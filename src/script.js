import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './init';
import { Site3dThree } from './Site3dThree';
import './style.css';

// Инициализация сцены
const { sizes, camera, scene, canvas, controls, renderer } = init();
camera.position.set(0, 5, 10);

// Настройка освещения
const setupLighting = () => {
    const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemLight.position.set(0, 50, 0)
    scene.add(hemLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.80);
    dirLight.position.set(-8, 12, -8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);
};

const site3d = new Site3dThree();
let loadedModel = null;

// Загрузка модели GLTF
const loadModel = (path) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            loadedModel = model;

            // Применение метода object3dToBoundCenter
            // site3d.object3dToBoundCenter(model);

            // Отображение Bounding Box'ов для всех мешей
            displayBoundingBoxes(model);

            resolve(model);
        }, undefined, (error) => {
            reject(error);
        });
    });
};

// Отображение Bounding Box'ов
const displayBoundingBoxes = (model) => {
	const meshes = site3d.getObject3dMeshes(model);
	 meshes.forEach(mesh => {
        const box = new THREE.Box3().setFromObject(mesh);
        const boxHelper = new THREE.Box3Helper(box, new THREE.Color(0xff0000));
        scene.add(boxHelper);
    });
};

const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

// Обработчики событий
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Основной код
setupLighting();
loadModel('/models/Flamingo.glb')
    .then(displayBoundingBoxes)
    .catch((error) => console.error(error));

animate();