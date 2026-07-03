import * as THREE from 'three';

export function createBodyMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.02,
  });
}

export function createDarkPlastic(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#0e0e14',
    roughness: 0.18,
    metalness: 0.04,
  });
}

export function createGlass(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#060612',
    roughness: 0.02,
    metalness: 0.10,
    transparent: true,
    opacity: 0.96,
  });
}

export function createLensOptic(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#020208',
    roughness: 0.0,
    metalness: 0.20,
    transparent: true,
    opacity: 0.99,
  });
}

export function createLed(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.8,
  });
}

export function createMetalRing(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: '#1c1c24',
    roughness: 0.22,
    metalness: 0.65,
  });
}
