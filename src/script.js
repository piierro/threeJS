import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import init from './js/init';
import Site3dThree from './js/Site3dThree';
import { setupLighting } from './js/Lighting';
import './style.css';

const { camera, scene, controls, renderer } = init();
camera.position.set(0, 1, 3);

const site3d = new Site3dThree();

const getBoundingBox = (mesh) => {
	mesh.geometry.computeBoundingBox();
	return mesh.geometry.boundingBox;
};

const displayBoundingBoxes = (model) => {
	const meshes = site3d.getObject3dMeshes(model);
	meshes.forEach((mesh) => {
		const boundingBox = getBoundingBox(mesh);
		if (boundingBox) {
			const boxWorld = boundingBox.clone().applyMatrix4(mesh.matrixWorld);
			const boxHelper = new THREE.Box3Helper(
				boxWorld,
				new THREE.Color(0xff0000),
			);
			scene.add(boxHelper);
		}
	});
};

const loadModel = (path) => {
	const loader = new GLTFLoader();
	return new Promise((resolve, reject) => {
		loader.load(
			path,
			(gltf) => {
				const model = gltf.scene;
				scene.add(model);
				site3d.object3dToBoundCenter(model);
				displayBoundingBoxes(model);
				resolve();
			},
			undefined,
			(error) => {
				reject(error);
			},
		);
	});
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
