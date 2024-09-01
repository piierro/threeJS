import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './init';
import Site3dThree from './Site3dThree';
import './style.css';

const { sizes, camera, scene, controls, renderer } = init();
camera.position.set(0, 1, 3);

// Настройка освещения
const setupLighting = () => {
    const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemLight.position.set(0, 50, 0);
    scene.add(hemLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-8, 12, -8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);
};

const site3d = new Site3dThree();

// Загрузка модели GLTF
const loadModel = (path) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);

                // Метод object3dToBoundCenter
                site3d.object3dToBoundCenter(model);

                // Отображение Bounding Box'ов для всех мешей
                displayBoundingBoxes(model);

                resolve(model);
            },
            undefined,
            (error) => {
                reject(error);
            },
        );
    });
};

// const displayBoundingBoxes = (model) => {
//     const meshes = site3d.getObject3dMeshes(model);
//     meshes.forEach((mesh) => {
//         mesh.geometry.computeBoundingBox();

//         const box = new THREE.Box3().setFromObject(mesh);
//         const boxHelper = new THREE.Box3Helper(box, new THREE.Color(0xff0000));
//         boxHelper.visible = true;
//         scene.add(boxHelper);
//     });
// };

const displayBoundingBoxes = (model) => {
    const meshes = site3d.getObject3dMeshes(model);
    meshes.forEach((mesh) => {
        mesh.geometry.computeBoundingBox();
		const boundingBox = mesh.geometry.boundingBox;

       if (boundingBox) {
            const boxWorld = boundingBox.clone().applyMatrix4(mesh.matrixWorld);
            const boxHelper = new THREE.Box3Helper(boxWorld, new THREE.Color(0xff0000));
			boxHelper.visible = true; 
            scene.add(boxHelper);
        }
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
});

// Основной код
setupLighting();
loadModel('/models/model1.glb')
    .then(() => console.log('Model loaded successfully'))
    .catch((error) => console.error(error));

animate();


