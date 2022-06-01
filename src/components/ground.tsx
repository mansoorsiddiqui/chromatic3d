import { Plane, useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

type GroundProps = {
  opacity: number;
};

export default function Ground(props: GroundProps) {
  const { opacity } = props;
  const maps = useTexture({
    map: "textures/Plastic_003_basecolor.jpg",
    normalMap: "textures/Plastic_003_normal.jpg",
    roughnessMap: "textures/Plastic_003_roughness.jpg",
    aoMap: "textures/Plastic_003_ambientOcclusion.jpg",
    metalnessMap: "textures/Plastic_003_metallic.jpg",
  });
  const textureRepeat = 10;
  // eslint-disable-next-line no-multi-assign
  maps.map.wrapS = maps.map.wrapT = THREE.RepeatWrapping;
  maps.map.repeat.set(textureRepeat, textureRepeat);
  // eslint-disable-next-line no-multi-assign
  maps.normalMap.wrapS = maps.normalMap.wrapT = THREE.RepeatWrapping;
  maps.normalMap.repeat.set(textureRepeat, textureRepeat);
  // eslint-disable-next-line no-multi-assign
  maps.roughnessMap.wrapS = maps.roughnessMap.wrapT = THREE.RepeatWrapping;
  maps.roughnessMap.repeat.set(textureRepeat, textureRepeat);
  // eslint-disable-next-line no-multi-assign
  maps.aoMap.wrapS = maps.aoMap.wrapT = THREE.RepeatWrapping;
  maps.aoMap.repeat.set(textureRepeat, textureRepeat);
  // eslint-disable-next-line no-multi-assign
  maps.metalnessMap.wrapS = maps.metalnessMap.wrapT = THREE.RepeatWrapping;
  maps.metalnessMap.repeat.set(textureRepeat, textureRepeat);
  return (
    <Plane
      receiveShadow
      rotation-x={-Math.PI / 2}
      args={[5, 5]}
      position={[0, -0.8, 0]}
    >
      <meshStandardMaterial
        {...maps}
        color="#333"
        emissive="#444"
        emissiveIntensity={0.5}
        roughness={1}
        metalness={0.4}
        opacity={opacity + 0.4}
        transparent
      />
    </Plane>
  );
}
