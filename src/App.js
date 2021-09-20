import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import './App.scss';
//Components
import Header from './components/header';
import { Section } from './components/section';
import { Html, useGLTFLoader } from 'drei';
import state from './components/state';
// Intersection observer
import { useInView } from 'react-intersection-observer';


const Model = ({ path }) => {
    const gltf = useGLTFLoader(path, true);
    return <primitive object={gltf.scene} dispose={null} />;
};



const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[0, 10, 0]} intensity={1.5} />
            <spotLight position={[1000, 0, 0]} intensity={1} />
        </>
    );
};

const Content = ({ domContent, bgColor, children, modelPath, positionY }) => {
    const ref = useRef();
    useFrame(() => (ref.current.rotation.y += 0.01));
    const [refItem, inView] = useInView({
        threshold: 0
    });

    useEffect(() => {
        inView && (document.body.style.background = bgColor);
    }, [inView, bgColor])

    return (
        <Section factor={1.5} offset={1}>
            <group position={[0, positionY, 0]}>
                <mesh ref={ref} scale={[1, 1, 1]} position={[0, -35, 0]}>
                    <Model path={modelPath} />
                </mesh>
                <Html portal={domContent} fullscreen>
                    <div className="container" ref={refItem} >{children}</div>
                </Html>
            </group>
        </Section>
    );
};

export default function App() {
    const domContent = useRef();
    const scrollArea = useRef();

    const onScroll = (e) => {
        return (state.top.current = e.target.scrollTop);
    };

    useEffect(() => {
        void onScroll({ target: scrollArea.current });
    }, [])

    return (
        <>
            <Header />
            <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }} >
                <Lights />
                <Suspense fallback={null}>
                    <Content domContent={domContent} bgColor="#F15946" modelPath="/armchairYellow.gltf" positionY={250}>
                        <h1 className="title">Hello Madafaka</h1>
                    </Content>

                    <Content domContent={domContent} bgColor="#571EC1" modelPath="/armchairGreen.gltf" positionY={0}>
                        <h1 className="title">Hello Green</h1>
                    </Content>

                    <Content domContent={domContent} bgColor="#636567" modelPath="/armchairGray.gltf" positionY={-250}>
                        <h1 className="title">Hello Gray</h1>
                    </Content>
                </Suspense>
            </Canvas>
            <div className="scrollArea" ref={scrollArea} onScroll={onScroll} >
                <div style={{ position: 'sticky', top: 0 }} ref={domContent}></div>
                <div style={{ height: `${state.sections * 100}vh` }} ></div>
            </div>
        </>
    );
}
