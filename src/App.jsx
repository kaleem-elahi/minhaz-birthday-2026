import { CameraControls, Environment, Float, Sparkles, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { AnimatePresence, motion } from 'framer-motion'
import { easing } from 'maath'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const wishes = [
  {
    title: "Yaum-e-Paidaish Mubarak",
    text: "Meri pyari Minhaz, tumhe Yaum-e-Paidaish bohat bohat Mubarak ho. Allah Pak tumhari umr mein barkat ata farmaye, tumhe sehat-o-aafiyat naseeb farmaye, tumhari har jaiz dua qabool farmaye."
  },
  {
    title: "Meri Humsafar",
    text: "Allah Pak tumhare is naye saal-e-zindagi ko khair-o-barkat wala banaye. Tumhare dil mein apni aur apne Madine wale Aaqa ﷺ ki mohabbat mazeed barhaye aur har qadam par apni rehmat farmaye."
  },
  {
    title: "Dil Ki Gehraiyon Se",
    text: "Tumhe hamesha khush-o-khuram rakhe, har musibat aur pareshani se mehfooz farmaye. Tumhari zindagi mein sukoon aur barkat ata farmaye aur tumhe nek amal ki taufeeq de."
  },
  {
    title: "Khushiyon Ka Naseeb",
    text: "Allah Pak tumhare naseeb ko khushiyon se bhar de, tumhari har jaiz tamanna poori farmaye. Hamein ek dusre ke huqooq ada karte hue zindagi guzarne ki taufeeq de."
  },
  {
    title: "Duniya-o-Aakhirat",
    text: "Tumhari zindagi ka har aane wala din guzre hue din se behtar farmaye. Allah Pak hum sab ko Jannat-ul-Firdous mein apne Habeeb ﷺ ka pados naseeb farmaye. Ameen."
  }
]

// Elegant Crystal Heart
function CrystalHeart({ step, onClick }) {
  const ref = useRef()
  const ringRef1 = useRef()
  const ringRef2 = useRef()
  
  const geometry = useMemo(() => {
    const x = 0, y = 0
    const shape = new THREE.Shape()
    shape.moveTo(x + 5, y + 5)
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

    const geom = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: true, bevelSegments: 6, steps: 1, bevelSize: 1, bevelThickness: 1 })
    geom.center()
    geom.scale(0.12, -0.12, 0.12)
    return geom
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    
    // Very subtle, elegant floating & rotation
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.2
    
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1
      ringRef1.current.rotation.y = t * 0.1
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.PI / 2.2 + Math.cos(t * 0.2) * 0.1
      ringRef2.current.rotation.y = -t * 0.15
    }
  })

  return (
    <group onClick={step === 0 ? onClick : undefined} onPointerOver={() => step === 0 && (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={1}>
        {/* Crystal Heart */}
        <mesh ref={ref} geometry={geometry}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            emissive="#0a0a0a" 
            transmission={1} 
            opacity={1} 
            transparent
            roughness={0.05} 
            metalness={0.1} 
            ior={2.4} 
            thickness={3} 
            clearcoat={1}
            attenuationColor="#ffffff"
            attenuationDistance={10}
          />
        </mesh>
        
        {/* Very subtle internal light */}
        <pointLight color="#ffffff" intensity={0.5} distance={10} />
        
        {/* Elegant Golden Halo Rings */}
        <mesh ref={ringRef1} position={[0, -0.5, 0]}>
          <torusGeometry args={[12, 0.02, 16, 100]} />
          <meshPhysicalMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.2} metalness={1} roughness={0.1} />
        </mesh>
        <mesh ref={ringRef2} position={[0, -0.5, 0]}>
          <torusGeometry args={[13.5, 0.01, 16, 100]} />
          <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} metalness={1} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  )
}

function SceneControls({ step }) {
  const controlsRef = useRef()
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (step === 0) {
      const time = state.clock.getElapsedTime()
      const radius = 12
      const x = Math.sin(time * 0.05) * radius
      const z = Math.cos(time * 0.05) * radius
      
      easing.damp3(camera.position, [x, 1, z], 1.2, delta)
      controlsRef.current?.setLookAt(camera.position.x, camera.position.y, camera.position.z, 0, 0, 0, true)
    } else if (step <= wishes.length) {
      const angle = (step / wishes.length) * Math.PI * 1.5
      const radius = 8
      const camPos = new THREE.Vector3(
        Math.sin(angle) * radius, 
        1, 
        Math.cos(angle) * radius
      )
      
      easing.damp3(camera.position, camPos, 0.8, delta)
      controlsRef.current?.setLookAt(camPos.x, camPos.y, camPos.z, 0, 0, 0, true)
    } else {
      const time = state.clock.getElapsedTime()
      const radius = 18
      const x = Math.sin(time * 0.1) * radius
      const z = Math.cos(time * 0.1) * radius
      easing.damp3(camera.position, [x, 3, z], 1.2, delta)
      controlsRef.current?.setLookAt(camera.position.x, camera.position.y, camera.position.z, 0, 0, 0, true)
    }
  })

  return <CameraControls ref={controlsRef} makeDefault minDistance={4} maxDistance={30} enabled={false} />
}

function MobileParallax({ children }) {
  const group = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      let clientX = e.clientX
      let clientY = e.clientY
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }
      if (clientX !== undefined) {
        mouse.current.x = (clientX / window.innerWidth) * 2 - 1
        mouse.current.y = -(clientY / window.innerHeight) * 2 + 1
      }
    }
    
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        mouse.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1)
        mouse.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })
    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  useFrame((state, delta) => {
    if (group.current) {
      easing.dampE(group.current.rotation, [mouse.current.y * 0.15, mouse.current.x * 0.15, 0], 0.5, delta)
    }
  })

  return <group ref={group}>{children}</group>
}

function TypewriterText({ text }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    setDisplayedText("")
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 40) // Typing speed
    
    return () => clearInterval(interval)
  }, [text])

  return <span>{displayedText}</span>
}

function ShootingStars() {
  const starsRef = useRef([])
  const groupRef = useRef()

  const stars = useMemo(() => {
    return Array.from({ length: 5 }).map(() => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 40, 10 + Math.random() * 20, -10 - Math.random() * 20),
      speed: 0.2 + Math.random() * 0.4,
      length: 2 + Math.random() * 3,
      opacity: 0,
      active: false
    }))
  }, [])

  useFrame(() => {
    if (Math.random() < 0.02) { // Random chance to spawn a shooting star
      const inactive = stars.find(s => !s.active)
      if (inactive) {
        inactive.active = true
        inactive.opacity = 1
        inactive.position.set((Math.random() - 0.5) * 40, 15 + Math.random() * 10, -10 - Math.random() * 20)
      }
    }

    groupRef.current.children.forEach((mesh, i) => {
      const star = stars[i]
      if (star.active) {
        star.position.x -= star.speed
        star.position.y -= star.speed
        star.opacity -= 0.015
        
        mesh.position.copy(star.position)
        mesh.material.opacity = Math.max(0, star.opacity)
        
        if (star.opacity <= 0) star.active = false
      }
    })
  })

  return (
    <group ref={groupRef}>
      {stars.map((_, i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

function HoldToReveal({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const isHolding = useRef(false)
  const frameRef = useRef(null)

  const handleDown = (e) => {
    isHolding.current = true
    e.target.setPointerCapture(e.pointerId)
  }

  const handleUp = (e) => {
    isHolding.current = false
    setProgress(0)
    e.target.releasePointerCapture(e.pointerId)
  }

  useEffect(() => {
    const loop = () => {
      if (isHolding.current) {
        setProgress(p => {
          if (p >= 100) {
            isHolding.current = false
            setTimeout(onComplete, 200) // slight delay before transitioning
            return 100
          }
          return p + 1.2 // Adjust speed here
        })
      } else {
        setProgress(p => Math.max(0, p - 3))
      }
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [onComplete])

  return (
    <div 
      style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto', cursor: 'pointer', touchAction: 'none' }}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="3" />
        <circle 
          cx="45" cy="45" r="40" fill="none" stroke="#d4af37" strokeWidth="3" 
          strokeDasharray="251" strokeDashoffset={251 - (251 * progress) / 100} 
          style={{ transition: isHolding.current ? 'none' : 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#d4af37', fontFamily: 'Montserrat', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: progress > 0 ? 0 : 1, transition: 'opacity 0.2s' }}>
          Hold
        </span>
        <span style={{ position: 'absolute', color: '#fff', fontSize: '1rem', fontFamily: 'Montserrat', fontWeight: '300', opacity: progress > 0 ? 1 : 0, transition: 'opacity 0.2s' }}>
          {Math.floor(progress)}%
        </span>
      </div>
      {/* Pulse effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', boxShadow: progress > 0 ? `0 0 ${progress * 0.5}px rgba(212, 175, 55, ${progress / 200})` : 'none', transition: 'box-shadow 0.1s' }} />
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const nextStep = () => {
    if (step === 0 && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      setIsPlaying(true)
    }
    setStep(s => Math.min(s + 1, wishes.length + 1))
  }

  const reset = () => {
    setStep(0)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#050505' }}>
      
      <audio ref={audioRef} src="https://ia803204.us.archive.org/24/items/CanonInD_261/Canon_in_D.mp3" loop />
      
      {/* 3D WebGL Canvas */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <MobileParallax>
            {/* Elegant, moody lighting */}
            <ambientLight intensity={0.2} color="#ffffff" />
            <spotLight position={[5, 10, 5]} intensity={2} color="#d4af37" penumbra={1} angle={0.5} />
            <spotLight position={[-5, -10, -5]} intensity={1} color="#ffffff" penumbra={1} />
            <Environment preset="studio" />
            
            {/* Very subtle, slow-moving gold & silver dust */}
            <Sparkles count={150} scale={15} size={1} speed={0.1} opacity={0.4} color="#d4af37" />
            <Sparkles count={150} scale={15} size={1} speed={0.15} opacity={0.2} color="#ffffff" />

            <ShootingStars />
            <CrystalHeart step={step} onClick={() => step === 0 && nextStep()} />
          </MobileParallax>

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.8} radius={0.4} />
            <Vignette eskil={false} offset={0.3} darkness={1.5} />
            <Noise opacity={0.05} />
            <DepthOfField target={[0, 0, 0]} focalLength={0.03} bokehScale={3} height={480} />
          </EffectComposer>

          <SceneControls step={step} />
        </Canvas>
      </div>

      {/* HTML UI Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          
          {/* STEP 0: INTRO */}
          {step === 0 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.5 }}
              style={{ position: 'absolute', top: '15%', textAlign: 'center' }}
            >
              <h1 className="title-text">Minhaz</h1>
              <p className="subtitle-text">Tap the crystal to begin</p>
            </motion.div>
          )}

          {/* STEP 1 to 5: DUAS */}
          {step > 0 && step <= wishes.length && (
            <motion.div
              key={`dua-${step}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="card-container"
              style={{ pointerEvents: 'auto' }}
            >
              <h2 className="card-title">{wishes[step - 1].title}</h2>
              <p className="card-text">
                <TypewriterText text={wishes[step - 1].text} />
              </p>
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 2, duration: 1 }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
              >
                {step === wishes.length ? (
                  <HoldToReveal onComplete={nextStep} />
                ) : (
                  <button className="primary-btn" onClick={nextStep}>
                    Next
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* STEP 6: FINALE */}
          {step > wishes.length && (
            <motion.div
              key="finale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              style={{ textAlign: 'center', pointerEvents: 'auto', padding: '2rem' }}
            >
              <h1 className="title-text" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem' }}>
                Happy Birthday, Minhaz
              </h1>
              <p className="subtitle-text" style={{ fontSize: '0.9rem', letterSpacing: '4px' }}>
                Forever & Always LOVE YOU!
              </p>
                            <p className="subtitle-text" style={{ fontSize: '0.7rem', marginBottom: '3rem', letterSpacing: '4px' }}>
                FROM YOUR HUSBAND, Kaleem
              </p>

              <button className="primary-btn" onClick={reset}>Replay</button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  )
}
