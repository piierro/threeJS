import * as THREE from 'three';

class Site3dThree {
	constructor() {
		this.meshes = []; // Список мешей
	}

	// Метод для получения мешей из Object3D
	getObject3dMeshes(object3d, options = {}) {
		if (!object3d || !object3d.isObject3D) {
			throw new Error('Invalid Object3D');
		}

		const exceptions = options.exceptions || [];
		const result = [];

		object3d.traverse((child) => {
			if (child.isMesh && !exceptions.includes(child.name)) {
				result.push(child);
			}
		});

		return result;
	}

	// Метод для установки центра объекта
	object3dToBoundCenter(object3d, options = {}) {
		this.getObject3dMeshes(object3d, options).forEach((mesh) => {
			this.meshToBoundCenter(mesh);
		});
	}

	// Метод для инициализации параметров меша
	meshInitParams(mesh) {
		// создание нового объекта вместо изменения оригинала
		const initParams = {
			position: mesh.position.clone(),
			scale: mesh.scale.clone(),
			rotation: mesh.rotation.clone(),
		};
		mesh.userData.initParams = initParams; // присваиваем новое значение
	}

	// Метод центрирования меша
	meshToBoundCenter(mesh) {
		if (mesh.isSkinnedMesh || mesh.userData.isBoundCenter) {
			return mesh.position;
		}

		this.meshInitParams(mesh);
		const { geometry } = mesh;

		geometry.computeBoundingBox();
		const { boundingBox } = geometry;

		if (boundingBox) {
			const center = new THREE.Vector3();
			boundingBox.getCenter(center);

			const currentBoxCenter = new THREE.Vector3();
			boundingBox.getCenter(currentBoxCenter);

			const worldPosition = new THREE.Vector3();
			mesh.getWorldPosition(worldPosition);

			// Обновление позиции меша
			mesh.position.copy(center).sub(currentBoxCenter)
      // .add(worldPosition);

			geometry.computeBoundingBox();
		}

		mesh.userData.isBoundCenter = true;
		this.meshInitParams(mesh);

		return mesh.position;
	}
}

export default Site3dThree;
