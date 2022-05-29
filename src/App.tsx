import {
  Environment,
  Scroll,
  ScrollControls,
  Shadow,
  Sparkles,
  SpotLight,
  useScroll,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Ground from "components/ground";
import PrinterHead from "components/printerhead";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import useRefs from "react-use-refs";
import * as THREE from "three";

const Pages = [
  {
    id: 0,
    cameraPath: {
      position: new THREE.Vector3(0, 1, 4),
      rotation: new THREE.Vector3(Math.PI / 4, 0, 0),
    },
  },
  {
    id: 1,
    cameraPath: {
      position: new THREE.Vector3(0, 0, 3),
      rotation: new THREE.Vector3(0, 0, 0),
    },
  },
  {
    id: 2,
    cameraPath: {
      position: new THREE.Vector3(0, 0, 3),
      rotation: new THREE.Vector3(0, 0, 0),
    },
  },
  {
    id: 3,
    cameraPath: {
      position: new THREE.Vector3(0, -0.4, 0.6),
      rotation: new THREE.Vector3(-Math.PI / 8, 0, 0),
    },
  },
  {
    id: 4,
    cameraPath: {
      position: new THREE.Vector3(0, -0.4, 0.6),
      rotation: new THREE.Vector3(-Math.PI / 8, 0, 0),
    },
  },
  {
    id: 5,
    cameraPath: {
      position: new THREE.Vector3(0, -0.5, 0.5),
      rotation: new THREE.Vector3(-Math.PI / 8, 0, 0),
    },
  },
];

function ScrollContent() {
  const scroll = useScroll();
  const l = Pages.length;
  // const { width, height } = useThree((state) => state.viewport);
  const groundColor = new THREE.Color(0xdddddd);
  const [spotLightOpacity, setSLO] = useState(0);
  const [spotLight, printerHead] =
    useRefs<[THREE.SpotLight, THREE.Group]>(null);
  const [currentPage, setcurrentPage] = useState(0);

  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const setOpacity = (obj: THREE.Object3D, opacity: number) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // eslint-disable-next-line no-param-reassign
        child.material.opacity =
          child.material.name === "ClearPlastic" ? 0.2 : opacity;
        // eslint-disable-next-line no-param-reassign
        child.material.transparent = true;
      }
    });
  };
  const handleScroll = () => {
    const { offset } = scroll;
    setSLO(scroll.curve(0, 3 / l));
    setOpacity(printerHead.current, scroll.range(0, 1 / l));
    if (offset > progress) {
      setDirection(1);
      setProgress(offset);
    } else if (offset < progress) {
      setDirection(-1);
      setProgress(offset);
    }
  };

  useFrame(({ camera }, delta) => {
    const d = scroll.delta * 100;
    if (d > 0.01) {
      handleScroll();
    }
    const scrollPage = Math.floor(scroll.offset * l);
    if (scrollPage !== currentPage) {
      setcurrentPage(scrollPage);
    }
    const nextPage = Math.min(Math.max(currentPage + direction, 0), l - 1);

    printerHead.current.rotation.y = THREE.MathUtils.damp(
      printerHead.current.rotation.y,
      -Math.PI * scroll.range(0, 1 / l, -0.1) * 0.5,
      3,
      delta
    );

    camera.position.setX(
      THREE.MathUtils.damp(
        camera.position.x,
        Pages[nextPage].cameraPath.position.x,
        2,
        delta
      )
    );
    camera.position.setY(
      THREE.MathUtils.damp(
        camera.position.y,
        Pages[nextPage].cameraPath.position.y,
        2,
        delta
      )
    );
    camera.position.setZ(
      THREE.MathUtils.damp(
        camera.position.z,
        Pages[nextPage].cameraPath.position.z,
        2,
        delta
      )
    );
    camera.rotation.set(
      THREE.MathUtils.damp(
        camera.rotation.x,
        Pages[nextPage].cameraPath.rotation.x,
        2,
        delta
      ),
      THREE.MathUtils.damp(
        camera.rotation.y,
        Pages[nextPage].cameraPath.rotation.y,
        2,
        delta
      ),
      THREE.MathUtils.damp(
        camera.rotation.z,
        Pages[nextPage].cameraPath.rotation.z,
        2,
        delta
      )
    );
  });

  return (
    <>
      <ambientLight intensity={scroll.curve(2 / l, l - 2 / l, 0.2)} />
      <directionalLight
        intensity={scroll.range(2 / l, l - 2 / l)}
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
      />
      <SpotLight
        ref={spotLight}
        opacity={spotLightOpacity * 0.8}
        penumbra={1}
        distance={6}
        attenuation={5}
        position={[1, 1, 1.5]}
        intensity={spotLightOpacity * 0.3}
        angle={spotLightOpacity * 0.5}
        color="#FEF9E7"
        castShadow
      />
      <Sparkles count={40} scale={10} size={4} speed={0.4} />

      <Environment
        background
        near={1}
        far={1000}
        resolution={1024}
        preset="dawn"
      />

      <group ref={printerHead}>
        <PrinterHead castShadow scale={0.2} position={[0.2, -0.3, 0]} />
        <Shadow
          rotation={[-Math.PI / 2, 0, 0]}
          scale={2}
          position={[0, -1, 0]}
          color={groundColor}
          opacity={scroll.range(0, 2 / l)}
        />
      </group>
      {/* <Sparks colors={["red", "blue"]} count={4} radius={0.1} /> */}

      <Ground opacity={spotLightOpacity + 0.5} />
    </>
  );
}

function HTMLContent() {
  const scroll = useScroll();
  const l = Pages.length;
  const [top, setTop] = useState<Array<number>>(
    Array.from({ length: 5 }, () => 0)
  );

  const handleSetTop = (index: number, val: number) => {
    setTop((oldTop) => [
      ...oldTop.slice(0, index),
      val,
      ...oldTop.slice(index + 1),
    ]);
  };

  useFrame(() => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < l; i++) {
      handleSetTop(
        i,
        parseFloat((scroll.range(i / l, (i + 1) / l, 0.1) * 600).toFixed(3))
      );
    }
  });

  return (
    <>
      <div
        style={{ top: top[0] }}
        className="flex flex-col justify-center items-center h-screen w-screen text-white"
      >
        <h2 className="w-[400px] text-6xl">
          Next Gen 3D Printing Enabled by Chemical Reactions
        </h2>
        <br />
        <br />
        <p>Scroll down</p>
      </div>
      <div
        style={{ transform: `translateY(${top[1]}px)` }}
        className="flex flex-col justify-center h-screen w-screen mx-auto max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-6xl">Built by Chemists</h2>
        <br />
        <br />
        <p className="w-[300px]">
          The Chromatic 3D Printer utilizes chemistry to unleash new
          possibilites in 3D printing
        </p>
      </div>
      <div className="h-screen" />
      <div
        style={{ paddingTop: top[3] }}
        className="flex flex-col justify-start items-end h-screen w-screen mx-auto mt-40 text-right max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-6xl">The Reaction</h2>
        <br />
        <br />
        <p className="w-[320px]">
          Liquid components are mixed in the printer head, triggering a chemical
          reaction
        </p>
      </div>
      <div
        style={{ paddingTop: top[4] }}
        className="flex flex-col justify-start items-start h-screen w-screen mx-auto mt-40 max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-6xl">Like Origami</h2>
        <br />
        <br />
        <p className="w-[320px]">
          The two streams are folded together, producing novel materials for an
          array of applications
        </p>
      </div>
    </>
  );
}

function Scroller() {
  // const viewport = useThree((state) => state.viewport);

  return (
    <ScrollControls
      pages={Pages.length} // Each page takes 100% of the height of the canvas
      distance={0.6} // A factor that increases scroll bar travel (default: 1)
      damping={4} // Friction, higher is faster (default: 4)
      horizontal={false} // Can also scroll horizontally (default: false)
      infinite={false} // Can also scroll infinitely (default: false)
    >
      <ScrollContent />
      <Scroll html>
        <HTMLContent />
      </Scroll>
    </ScrollControls>
  );
}

function App() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: isMobile ? 125 : 75 }}>
      <Scroller />
    </Canvas>
  );
}

export default App;
