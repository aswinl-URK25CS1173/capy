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
    const W = el.clientWidth || window.innerWidth
    const H = el.clientHeight || window.innerHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
    camera.position.set(0, 0, 30)

    // ── Floating orbs (green & amber for India theme) ──
    const orbData: { mesh: THREE.Mesh; vel: THREE.Vector3; rot: THREE.Vector3 }[] = []

    const colors =
      variant === 'hero'    ? [0x22c55e, 0x16a34a, 0x059669, 0xf59e0b, 0x10b981] :
      variant === 'admin'   ? [0x22c55e, 0x0ea5e9, 0x8b5cf6, 0x10b981] :
                              [0x22c55e, 0x34d399, 0x6ee7b7, 0x059669]

    for (let i = 0; i < 18; i++) {
      const r = Math.random() * 1.4 + 0.3
      const geo = new THREE.SphereGeometry(r, 16, 16)
      const color = colors[Math.floor(Math.random() * colors.length)]
      const mat = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: variant === 'hero' ? 0.09 + Math.random() * 0.08 : 0.07 + Math.random() * 0.06,
        roughness: 0.3,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.15,
      })
      const mesh = new THREE.Mesh(geo, mat)
      const spread = variant === 'hero' ? 40 : 30
      mesh.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      )
      scene.add(mesh)
      orbData.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.010,
          0
        ),
        rot: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.004
        ),
      })
    }

    // ── Particle field (stars/dust) ──
    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Wireframe turf grid (ground plane) ──
    if (variant === 'hero' || variant === 'booking') {
      const gridGeo = new THREE.PlaneGeometry(80, 80, 20, 20)
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
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

    // ── Ring (stadium-like) ──
    if (variant === 'hero') {
      const ringGeo = new THREE.TorusGeometry(12, 0.06, 8, 80)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.12,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 3
      ring.position.set(10, 2, -5)
      scene.add(ring)

      const ring2Geo = new THREE.TorusGeometry(18, 0.04, 8, 80)
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.07,
      })
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
      ring2.rotation.x = Math.PI / 2.5
      ring2.position.set(-6, -4, -10)
      scene.add(ring2)
    }

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const pt1 = new THREE.PointLight(0x22c55e, 2.5, 60)
    pt1.position.set(10, 10, 15)
    scene.add(pt1)
    const pt2 = new THREE.PointLight(0xf59e0b, 1.2, 40)
    pt2.position.set(-15, -8, 10)
    scene.add(pt2)

    // ── Mouse parallax ──
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.4
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.3
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ──
    let frame = 0
    let raf: number

    const animate = () => {
      raf = requestAnimationFrame(animate)
      frame++

      // Camera slow drift
      camera.position.x += (mouse.x * 4 - camera.position.x) * 0.03
      camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      // Orbs
      orbData.forEach(({ mesh, vel, rot }, i) => {
        mesh.position.add(vel)
        mesh.rotation.x += rot.x
        mesh.rotation.y += rot.y
        // Gentle sine bob
        mesh.position.y += Math.sin(frame * 0.007 + i) * 0.007
        // Bounce at bounds
        if (Math.abs(mesh.position.x) > 22) vel.x *= -1
        if (Math.abs(mesh.position.y) > 18) vel.y *= -1
      })

      // Particles slow drift
      particles.rotation.y += 0.0003
      particles.rotation.x += 0.0001

      renderer.render(scene, camera)
    }
    animate()

    // Resize
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
