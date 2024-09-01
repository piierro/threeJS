import * as THREE from 'three';

class Site3dThree {
  getObject3dMeshes(object3d, options = undefined) {
    if (object3d.isMesh) {
      return [object3d];
    }

    const exceptions = options?.exceptions ?? [];

    const result = [];

    object3d.traverse((child) => {
      if (
        child.isMesh &&
        exceptions.find((name) => name === child.name) === undefined
      ) {
        result.push(child);
      }
    });

    return result;
  }

  object3dToBoundCenter(object3d, options = undefined) {
    this.getObject3dMeshes(object3d).forEach((mesh) => {
      this.meshToBoundCenter(mesh);
    });
  }

  meshInitParams(mesh) {
    mesh.userData.initParams = {
      position: mesh.position.clone(),
      scale: mesh.scale.clone(),
      rotation: mesh.rotation.clone(),
    };
  }

  meshToBoundCenter(mesh, options = undefined) {
    if (mesh.isSkinnedMesh || mesh.userData.isBoundCenter === true) {
      return mesh.position;
    }

    this.meshInitParams(mesh);
    const { geometry } = mesh;

    geometry.computeBoundingBox();
    const { boundingBox } = geometry;

    if (boundingBox) {
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);

      const worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);

      mesh.position
        .copy(center)
        .sub(mesh.geometry.boundingBox.getCenter(new THREE.Vector3()))
        .add(worldPosition);
    }

    mesh.userData.isBoundCenter = true;
    this.meshInitParams(mesh);
    return mesh.position;
  }
}

export default Site3dThree;