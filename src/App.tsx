import {
  Environment,
  Scroll,
  ScrollControls,
  Shadow,
  useScroll,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Ground from "components/ground";
import PrinterHead from "components/printerhead";
import { useEffect, useState } from "react";
import useRefs from "react-use-refs";
import * as THREE from "three";

const Pages = [
  {
    id: 0,
    cameraPath: {
      position: new THREE.Vector3(0, 0, 3),
      rotation: new THREE.Vector3(0, 0, 0),
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
      position: new THREE.Vector3(0, -0.4, 0.6),
      rotation: new THREE.Vector3(-Math.PI / 8, 0, 0),
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
      position: new THREE.Vector3(0, -0.5, 0.5),
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
  const [printerHead] = useRefs<[THREE.Group]>(null);
  const [currentPage, setcurrentPage] = useState(0);

  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const setOpacity = (obj: THREE.Object3D, opacity: number) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name !== "ClearPlastic") {
          // eslint-disable-next-line no-param-reassign
          child.material.opacity = opacity;
          // eslint-disable-next-line no-param-reassign
          child.material.transparent = true;
        } else {
          // eslint-disable-next-line no-param-reassign
          child.material.depthTest = scroll.visible(0, 1 / l);
        }
      }
    });
  };
  const handleScroll = () => {
    const { offset } = scroll;
    setOpacity(printerHead.current, scroll.range(0, 1 / l) + 0.2);
    if (offset > progress) {
      setDirection(1);
      setProgress(offset);
    } else if (offset < progress) {
      setDirection(-1);
      setProgress(offset);
    }
  };
  useEffect(() => {
    handleScroll();
  }, []);

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
      <ambientLight intensity={0.2} />
      <directionalLight
        intensity={0.6}
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
      />

      <Environment
        background={false}
        near={1}
        far={1000}
        resolution={1024}
        preset="warehouse"
      />

      <group ref={printerHead}>
        <PrinterHead castShadow scale={0.2} position={[0.2, -0.3, 0]} />
        <Shadow
          rotation={[-Math.PI / 2, 0, 0]}
          scale={2}
          position={[0, -1, 0]}
          color={groundColor}
        />
      </group>

      <Ground />
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
        parseFloat((scroll.range(i / l, (i + 1) / l, 0.1) * 1400).toFixed(3)) -
          100
      );
    }
  });

  return (
    <>
      <div
        style={{ top: top[0] }}
        className="flex flex-col justify-center items-center h-screen w-screen text-white"
      >
        <h3 className="w-[500px] text-5xl uppercase text-center text-black">
          Next Gen 3D Printing Enabled by
        </h3>
        <h2 className="w-[800px] text-7xl uppercase text-center">
          Chemical Reactions
        </h2>
        <br />
        <br />
        <br />
        <p>Scroll down</p>
      </div>
      <div
        style={{ transform: `translateY(${top[1]}px)` }}
        className="flex flex-col justify-center h-screen w-screen mx-auto max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-5xl">
          Printing powered by chemical reactions
        </h2>
        <br />
        <br />
        <p className="w-[300px]">
          Unlike other types of 3D printing, we don&apos;t melt plastics or cure
          them with UV. Our technology blends liquid ingredients in the printer
          head, triggering a chemical reaction.
        </p>
      </div>
      <div className="h-screen" />
      <div
        style={{ transform: `translateY(${top[3]}px)` }}
        className="flex flex-col justify-start items-end h-screen w-screen mx-auto mt-40 text-right max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-5xl">Indestructible strength</h2>
        <br />
        <br />
        <p className="w-[320px]">
          It&apos;s the beginning of an unbreakable molecular bond between the
          strongest elastomers on the planet and any substrate you can imagine.
        </p>
      </div>
      <div
        style={{ transform: `translateY(${top[4]}px)` }}
        className="flex flex-col justify-start items-start h-screen w-screen mx-auto mt-40 max-w-[1050px]"
      >
        <h2 className="w-[400px] mt-30 text-5xl">RX-AM??? Technology</h2>
        <br />
        <br />
        <p className="w-[320px]">
          Called reactive extrusion additive manufacturing, this style of 3D
          printing opens a world of thrilling possibilities for industrial
          design and commercial production ??? from one part to one million.
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
    <Canvas shadows dpr={[1, 2]}>
      <Scroller />
    </Canvas>
  );
}

export default App;
