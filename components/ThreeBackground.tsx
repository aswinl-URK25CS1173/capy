'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  variant?: 'hero' | 'admin' | 'booking'
}

export default function ThreeBackground({ variant = 'hero' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const el = mountRef.current
    const width = el.clientWidth || window.innerWidth
    const height = el.clientHeight || window.innerHeight
    const testCanvas = document.createElement('canvas')
    const gl =
      testCanvas.getContext('webgl2', { alpha: true, antialias: true }) ||
      testCanvas.getContext('webgl', { alpha: true, antialias: true }) ||
      testCanvas.getContext('experimental-webgl')

    if (!gl) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 0, 30)

    const orbData: { mesh: THREE.Mesh; vel: THREE.Vector3; rot: THREE.Vector3 }[] = []

    const colors =
      variant === 'hero'
        ? [0x2563eb, 0x3b82f6, 0x60a5fa, 0xf97316, 0xea580c]
        : variant === 'admin'
          ? [0x2563eb, 0x0ea5e9, 0x8b5cf6, 0xf97316]
          : [0x2563eb, 0x3b82f6, 0x60a5fa, 0xf97316]

    for (let i = 0; i < 18; i++) {
      const radius = Math.random() * 1.4 + 0.3
      const geometry = new THREE.SphereGeometry(radius, 16, 16)
      const color = colors[Math.floor(Math.random() * colors.length)]
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: variant === 'hero' ? 0.09 + Math.random() * 0.08 : 0.07 + Math.random() * 0.06,
        roughness: 0.3,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.15,
      })
      const mesh = new THREE.Mesh(geometry, material)
      const spread = variant === 'hero' ? 40 : 30
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10,
      )
      scene.add(mesh)
      orbData.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.01, 0),
        rot: new THREE.Vector3((Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.008, (Math.random() - 0.5) * 0.004),
      })
    }

    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    if (variant === 'hero' || variant === 'booking') {
      const gridGeo = new THREE.PlaneGeometry(80, 80, 20, 20)
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        wireframe: true,
        transparent: true,
        opacity: 0.04,
      })
      const grid = new THREE.Mesh(gridGeo, gridMat)
      grid.rotation.x = -Math.PI / 2.8
      grid.position.y = -14
      grid.position.z = -5
      scene.add(grid)
    }

    if (variant === 'hero') {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(12, 0.06, 8, 80),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.12 }),
      )
      ring.rotation.x = Math.PI / 3
      ring.position.set(10, 2, -5)
      scene.add(ring)

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(18, 0.04, 8, 80),
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.07 }),
      )
      ring2.rotation.x = Math.PI / 2.5
      ring2.position.set(-6, -4, -10)
      scene.add(ring2)
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const pointLightOne = new THREE.PointLight(0x2563eb, 2.5, 60)
    pointLightOne.position.set(10, 10, 15)
    scene.add(pointLightOne)
    const pointLightTwo = new THREE.PointLight(0xf97316, 1.2, 40)
    pointLightTwo.position.set(-15, -8, 10)
    scene.add(pointLightTwo)

    const mouse = { x: 0, y: 0 }
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 0.4
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('mousemove', onMouseMove)

    let frame = 0
    let raf: number

    const animate = () => {
      raf = requestAnimationFrame(animate)
      frame += 1

      camera.position.x += (mouse.x * 4 - camera.position.x) * 0.03
      camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      orbData.forEach(({ mesh, vel, rot }, index) => {
        mesh.position.add(vel)
        mesh.rotation.x += rot.x
        mesh.rotation.y += rot.y
        mesh.position.y += Math.sin(frame * 0.007 + index) * 0.007
        if (Math.abs(mesh.position.x) > 22) vel.x *= -1
        if (Math.abs(mesh.position.y) > 18) vel.y *= -1
      })

      particles.rotation.y += 0.0003
      particles.rotation.x += 0.0001

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [variant])

  return <div ref={mountRef} className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} />
}
