import { Plane, useTexture } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

type GroundProps = {
  opacity: number;
};

export default function Ground(props: GroundProps) {
  const { opacity } = props;
  const maps = useTexture({
    map: "textures/Marble 2_BaseColor.jpg",
    normalMap: "textures/Marble 2_Normal.jpg",
    roughnessMap: "textures/Marble 2_Roughness.jpg",
    aoMap: "textures/Marble 2_AmbientOcclusion.jpg",
    metalnessMap: "textures/Marble 2_Metallic.jpg",
    lightMap: "textures/Marble 2_Glossiness.jpg",
  });
  const textureRepeat = 80;
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
      args={[200, 200]}
      position={[0, -0.8, 0]}
    >
      <meshStandardMaterial
        {...maps}
        color="#eee"
        emissive="#ddd"
        emissiveIntensity={0.05}
        roughness={0.3}
        metalness={0.9}
        lightMapIntensity={0.4}
        opacity={opacity}
        transparent
      />
    </Plane>
  );
}
