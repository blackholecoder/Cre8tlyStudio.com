import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Environment } from "@react-three/drei";
import { useRef } from "react";

const CubeWithTextAndImage = () => {
  const cubeRef = useRef();

  // Rotate the cube continuously
  useFrame(() => {
    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });

  const color = "#00CEC9";

  return (
    <mesh ref={cubeRef} castShadow>
      {/* Cube Geometry */}
      <boxGeometry args={[2, 2, 2]} />
      <meshPhysicalMaterial color="#00CEC9" clearcoat={2} roughness={0.3} metalness={0.9} />

      {/* Text on Front Face */}
      <Text
  position={[0, 0, 1.01]} // ✅ centered vertically
  fontSize={0.2}
  color={color}
  anchorX="center"
  anchorY="middle"
>
  Verifications
</Text>

      

      {/* Text on Back Face */}
      <Text
        position={[0, 0, -1.01]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        Audio Streaming
      </Text>

      {/* Text on Right Face */}
      <Text
        position={[1.01, 0, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        Video Streaming
      </Text>

      {/* Text on Left Face */}
      <Text
        position={[-1.01, 0, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
      >
        Private Circles
      </Text>

      {/* Text on Top Face */}
      <Text
        position={[0, 1.01, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Phlokk Times
      </Text>

      {/* Text on Bottom Face */}
      <Text
        position={[0, -1.01, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        rotation={[Math.PI / 2, 0, 0]}
      >
        Auctions
      </Text>
    </mesh>
  );
};

const Hero3D = () => (
  <section className="w-full h-screen bg-bioModal text-white">
    <Canvas shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <Environment preset="sunset" />
      <CubeWithTextAndImage />
      <OrbitControls enableZoom={false} />
    </Canvas>
  </section>
);

export default Hero3D;
