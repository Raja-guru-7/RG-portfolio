import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BloodRose(props) {
  const { nodes, materials } = useGLTF('/models/bloody_rose_sword__free.glb')
  const meshRef = useRef()
  
  // =========================================
  // ADDED: Mobile Responsiveness Logic
  // =========================================
  const [modelScale, setModelScale] = useState(0.01)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Reduce the model size further for mobile screens
        setModelScale(0.0022) 
      } else {
        setModelScale(0.01)  // Desktop size (Original)
      }
    }

    handleResize() // Initial check when component loads
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // =========================================

  // 1. Track the hover state using a ref
  const isHovered = useRef(false)

  // 2. uHover uniform: 0.0 for the normal sword, 1.0 for the full liquid effect
  const uniforms = useMemo(() => ({
    uHover: { value: 0.0 },
    uTime: { value: 0 }
  }), [])

  // 3. Smooth transition animation
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    
    // Smoothly interpolate from 0 to 1 when hovered
    const targetHover = isHovered.current ? 1.0 : 0.0
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, targetHover, 0.1)
  })

  // 4. Material modification
  const liquidMaterial = useMemo(() => {
    const mat = materials['Scene_-_Root'].clone()
    mat.transparent = true 
    
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uHover = uniforms.uHover
      shader.uniforms.uTime = uniforms.uTime

      // Vertex Shader: Get World Position to calculate waves across the sword length
      shader.vertexShader = `
        varying vec3 vWorldPos;
        ${shader.vertexShader}
      `.replace(
        `#include <worldpos_vertex>`,
        `#include <worldpos_vertex>
         vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`
      )

      // Fragment Shader: Apply the effect to the entire sword based on uHover
      shader.fragmentShader = `
        uniform float uHover;
        uniform float uTime;
        varying vec3 vWorldPos;
        ${shader.fragmentShader}
      `.replace(
        `#include <dithering_fragment>`,
        `#include <dithering_fragment>
         
         if (uHover > 0.0) {
             // Create a wave/ripple effect using the sword's Y and X axes
             float ripple = sin(vWorldPos.y * 15.0 - uTime * 6.0) * 0.5 + 0.5;
             
             // Glassy/Liquid colors
             vec3 glassColor = vec3(0.9, 0.1, 0.15); 
             vec3 baseColor = gl_FragColor.rgb;
             
             vec3 liquidEffect = (baseColor * glassColor) + (ripple * 0.4);
             
             // Smoothly blend the normal and liquid textures based on uHover
             vec3 finalColor = mix(baseColor, liquidEffect, uHover * 0.85); // 0.85 to keep some original detail
             
             gl_FragColor = vec4(finalColor, gl_FragColor.a * (1.0 - uHover * 0.2) + (uHover * 0.2 * ripple));
         }
        `
      )
    }
    return mat
  }, [materials, uniforms])

  return (
    <group {...props} dispose={null}>
      <group rotation={[1.909, 1.378, -2.735]}>
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          geometry={nodes.Bladesssss__0.geometry}
          material={liquidMaterial}
          rotation={[Math.PI / 2, 0, 0]}
          scale={modelScale} // Updated here to use responsive state
          // Hover events
          onPointerOver={(e) => {
            e.stopPropagation()
            isHovered.current = true
            document.body.style.cursor = 'pointer' // Optional: Change cursor
          }}
          onPointerOut={() => {
            isHovered.current = false
            document.body.style.cursor = 'auto'
          }}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/bloody_rose_sword__free.glb')