import * as THREE from 'three';
import init from './init';

const { scene } = init();

export const setupLighting = () => {
	const hemLight = new THREE.HemisphereLight(0xffffff, 0.6);
	hemLight.position.set(5, 5, 5).normalize();
	scene.add(hemLight);

	const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLight.position.set(-8, 12, -8);
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.set(1024, 1024);
	scene.add(dirLight);
};
