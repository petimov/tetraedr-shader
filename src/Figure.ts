import * as THREE from 'three'
import { gsap } from 'gsap'
import vertexShader from './vertexShader.glsl?raw'
import fragmentShader from './fragmentShader.glsl?raw'


export default class Figure {
    $image: HTMLImageElement
	scene: THREE.Scene
	loader: THREE.TextureLoader
	image: THREE.Texture
	hoverImage: THREE.Texture
	sizes: THREE.Vector2
	offset: THREE.Vector2
	mesh!: THREE.Mesh
    geometry!: THREE.PlaneGeometry
    material!: THREE.ShaderMaterial
    mouse!: THREE.Vector2
    uniforms!: {
	u_image: { value: THREE.Texture }
	u_imagehover: { value: THREE.Texture }
	u_mouse: { value: THREE.Vector2 }
	u_time: { value: number }
	u_res: { value: THREE.Vector2 }
}

	constructor(scene: THREE.Scene) {
		this.$image = document.querySelector('.tile__image') as HTMLImageElement
		this.scene = scene

		this.loader = new THREE.TextureLoader()

        this.image = this.loader.load(this.$image.src!)
        this.hoverImage = this.loader.load(this.$image.dataset.hover!)
        this.$image.style.opacity = 0
		this.sizes = new THREE.Vector2(0, 0)
		this.offset = new THREE.Vector2(0, 0)
        this.mouse = new THREE.Vector2(0, 0)

		this.getSizes()
		this.createMesh()
        window.addEventListener('mousemove', (ev) => { this.onMouseMove(ev) })
	}

    getSizes() {
		const { width, height, top, left } = this.$image.getBoundingClientRect()

		this.sizes.set(width, height)
		this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
	}

    createMesh() {
		this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        this.uniforms = {
		u_image: { value: this.image },
		u_imagehover: { value: this.hoverImage },
		u_mouse: { value: this.mouse },
		u_time: { value: 0 },
		u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
	    }

		this.material = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
        defines: {
	     PR: window.devicePixelRatio.toFixed(1)
	    }
	    })

		this.mesh = new THREE.Mesh(this.geometry, this.material)

		this.mesh.position.set(this.offset.x, this.offset.y, 0)
		this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

		this.scene.add(this.mesh)
	}
    
    onMouseMove(event: MouseEvent) {
        if (!this.mesh) return
        
        const x = (event.clientX / window.innerWidth) * 2 - 1
	    const y = -(event.clientY / window.innerHeight) * 2 + 1

	    gsap.to(this.mouse, {
        duration: 0.5,
        x,
        y
        })

        gsap.to(this.mesh.rotation, {
        duration: 0.5,
        x: -this.mouse.y * 0.3,
        y: this.mouse.x * (Math.PI / 6),
        })
    }

    onResize() {
  // update DOM-based measurements
  this.getSizes()

  // update mesh
  this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
  this.mesh.position.set(this.offset.x, this.offset.y, 0)

  // update shader resolution
  this.uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
}

    update() {
	this.uniforms.u_time.value += 0.01
    }
}