import { Canvas, useFrame } from "@react-three/fiber";
import { useState } from "react";
import { OrbitControls, Stage, Stars } from "@react-three/drei";

const Ball = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    setPosition((prevPosition) => ({
      ...prevPosition,
      y: prevPosition.y - 0.01,
    }));
  });

  return (
    <mesh>
      <mesh position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color="hotpink" shininess={100} />
      </mesh>
      <pointLight position={[0, 10, 0]} intensity={0.5} />
    </mesh>
  );
};

const App = () => {
  return (
    <mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.8} />
      <Ball />
      <mesh>
        <boxGeometry />
        <meshPhongMaterial color="hotpink" shininess={100} />
      </mesh>
    </mesh>
  );
};

const Scene = () => {
  return (
    <mesh>
      <Stage>
        <Stars />
        <App />
      </Stage>
      <OrbitControls enablePan={false} enableZoom={false} />
    </mesh>
  );
};

const MazeRunner: React.FC = () => {
  return (
    <div className="canvas-container w-full h-screen">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};

export default MazeRunner;
