/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import {
  Environment,
  Scroll,
  ScrollControls,
  ScrollControlsState,
  Shadow,
  useScroll,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import Ground from "components/ground";
import Header from "components/header";
import HTMLContent from "components/htmlContent";
import PrinterHead from "components/printerhead";
import { useEffect, useState } from "react";
import useRefs from "react-use-refs";
import * as THREE from "three";
import create from "zustand";

export const store = create<{
  currentPage: number;
  direction: number;
  scrollProgress: number;
  scrollObject: ScrollControlsState | null;
}>(() => ({
  currentPage: 0,
  direction: 0,
  scrollProgress: 0,
  scrollObject: null,
}));

const Pages = [
  {
    id: 0,
    cameraPath: {
      position: new THREE.Vector3(0, -0.73, 0.3),
      rotation: new THREE.Vector3(0, 0, 0),
    },
  },
  {
    id: 1,
    cameraPath: {
      position: new THREE.Vector3(0, -0.6, 0.6),
      rotation: new THREE.Vector3(Math.PI / 10, 0, 0),
    },
  },
  {
    id: 2,
    cameraPath: {
      position: new THREE.Vector3(0, -0.5, 0.3),
      rotation: new THREE.Vector3(0, 0, 0),
    },
  },
  {
    id: 3,
    cameraPath: {
      position: new THREE.Vector3(0, -0.4, 0.5),
      rotation: new THREE.Vector3(0, 0, 0),
    },
  },
  {
    id: 4,
    cameraPath: {
      position: new THREE.Vector3(0, -0.5, 0.4),
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
  const currentPage = store((state) => state.currentPage);
  const direction = store((state) => state.direction);

  const [progress, setProgress] = useState(0);

  const setOpacity = (obj: THREE.Object3D) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material.name === "ClearPlastic") {
          // eslint-disable-next-line no-param-reassign
          child.material.opacity = 2.5 - scroll.range(0, 1 / l);
        }
        if (
          child.material.name === "RedLiquid" ||
          child.material.name === "BlueLiquid"
        ) {
          // eslint-disable-next-line no-param-reassign
          child.material.opacity = scroll.range(0, 1 / l, 0.1);
        }
      }
    });
  };
  const handleScroll = () => {
    const { offset } = scroll;
    store.setState({ scrollProgress: offset });
    store.setState({ scrollObject: scroll });
    setOpacity(printerHead.current);
    if (offset > progress) {
      store.setState({ direction: 1 });
      setProgress(offset);
    } else if (offset < progress) {
      store.setState({ direction: -1 });
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
      store.setState({ currentPage: scrollPage });
    }

    camera.position.setX(
      THREE.MathUtils.damp(
        camera.position.x,
        Pages[currentPage].cameraPath.position.x,
        2,
        delta
      )
    );
    camera.position.setY(
      THREE.MathUtils.damp(
        camera.position.y,
        Pages[currentPage].cameraPath.position.y,
        2,
        delta
      )
    );
    camera.position.setZ(
      THREE.MathUtils.damp(
        camera.position.z,
        Pages[currentPage].cameraPath.position.z,
        2,
        delta
      )
    );
    camera.rotation.set(
      THREE.MathUtils.damp(
        camera.rotation.x,
        Pages[currentPage].cameraPath.rotation.x,
        2,
        delta
      ),
      THREE.MathUtils.damp(
        camera.rotation.y,
        Pages[currentPage].cameraPath.rotation.y,
        2,
        delta
      ),
      THREE.MathUtils.damp(
        camera.rotation.z,
        Pages[currentPage].cameraPath.rotation.z,
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
        <PrinterHead
          castShadow
          scale={0.2}
          position={[0.2, -0.3, 0]}
          currentPage={currentPage}
        />
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

function HTMLHeader() {
  const scroll = useScroll();
  const l = Pages.length;
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-screen text-white">
        <div className="absolute top-4 right-10 w-[600px] flex flex-row justify-between text-black uppercase font-bold text-2xl">
          <a href="/">Technology</a>
          <a href="/">Applications</a>
          <a href="/">Team</a>
          <a href="/">Careers</a>
          <a href="/">Contact</a>
        </div>
        <h3 className="w-[500px] text-5xl uppercase text-center text-black">
          Next Gen 3D Printing Enabled by
        </h3>
        <h2 className="w-[800px] text-7xl uppercase text-center text-[#8a08ca]">
          Chemical Reactions
        </h2>
        <div className="absolute top-[85vh] right-20 text-black text-3xl uppercase">
          Scroll down
          <div className="mouse_scroll">
            <div className="mouse">
              <div className="wheel" />
            </div>
            <div>
              <span className="m_scroll_arrows unu" />
              <span className="m_scroll_arrows doi" />
              <span className="m_scroll_arrows trei" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen w-screen" />
      <div className="h-screen w-screen" />
      <div className="h-screen w-screen" />
      <div className="h-screen w-screen" />
    </>
  );
}

function Scroller() {
  // const viewport = useThree((state) => state.viewport);

  return (
    <ScrollControls
      pages={Pages.length} // Each page takes 100% of the height of the canvas
      distance={1} // A factor that increases scroll bar travel (default: 1)
      damping={1} // Friction, higher is faster (default: 4)
      horizontal={false} // Can also scroll horizontally (default: false)
      infinite={false} // Can also scroll infinitely (default: false)
    >
      <ScrollContent />
      <Scroll html>
        <HTMLHeader />
      </Scroll>
    </ScrollControls>
  );
}

function App() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: Pages[0].cameraPath.position }}
        gl={{ localClippingEnabled: true, logarithmicDepthBuffer: true }}
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
      >
        <Scroller />
      </Canvas>
      <HTMLContent />
      <Header />
    </>
  );
}

export default App;
