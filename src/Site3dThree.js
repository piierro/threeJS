import * as THREE from 'three';

export class Site3dThree {
  getObject3dMeshes(object3d, options = undefined)
  {
    if (object3d.isMesh)
    {
      return [object3d];
    }
    
    const exceptions = options?.exceptions ?? [];
    
    const result = [];
    
    object3d.traverse(child =>
    {
      if (child.isMesh && exceptions.find(name => name === child.name) === undefined)
      {
        result.push(child);
      }
    });
    
    return result;
  }

  object3dToBoundCenter(object3d, options = undefined)
  {
    this.getObject3dMeshes(object3d).forEach(mesh =>
    {
      this.meshToBoundCenter(mesh);
    });
  }

  meshInitParams(mesh)
  {
    mesh.userData.initParams = {
      position: mesh.position.clone(),
      scale: mesh.scale.clone(),
      rotation: mesh.rotation.clone()
    };
  }
  
meshToBoundCenter(mesh, options = undefined) {
   if (mesh.isSkinnedMesh || mesh.userData.isBoundCenter === true) {
        return mesh.position;
    }

    // Сохранение начальных параметров
    this.meshInitParams(mesh);

    const geometry = mesh.geometry;
    const center = new THREE.Vector3();

    // Обновление матрицы мира
    mesh.updateMatrixWorld(true);
    
    // Вычисляем bounding box геометрии
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;

    if (boundingBox) {
        // Применяем матрицу трансформации меша к Bounding Box
        boundingBox.applyMatrix4(mesh.matrixWorld);
        boundingBox.getCenter(center);
        
        // Перемещение меша в центр
        const offset = new THREE.Vector3().subVectors(center, mesh.position);
        mesh.position.add(offset);
    }
    
    // Установка флага о центровке
    mesh.userData.isBoundCenter = true;

    this.meshInitParams(mesh);

    return center;
}
}