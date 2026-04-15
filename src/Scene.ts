import * as THREE from 'three'
import Figure from './Figure'

export default class Scene {
    container: HTMLCanvasElement
	scene: THREE.Scene
	renderer: THREE.WebGLRenderer
	camera!: THREE.PerspectiveCamera
	figure!: Figure

	constructor() {
		this.container = document.getElementById('stage') as HTMLCanvasElement

		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container,
			alpha: true,
	  })

		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
        window.addEventListener('resize', this.onResize.bind(this))

        this.initCamera()
		this.initLights()
        this.figure = new Figure(this.scene)
        this.update()
	}

	initLights() {
		const ambientlight = new THREE.AmbientLight(0xffffff, 2)
		this.scene.add(ambientlight)
	}

    initCamera() {
		const perspective = 700
	const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI
	this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000)
	this.camera.position.set(0, 0, perspective)
    }

    onResize() {
        const width = window.innerWidth
        const height = window.innerHeight

        // renderer
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(window.devicePixelRatio)

        // camera
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        // figure (important)
        this.figure.onResize()
        }

    update() {
        if (this.renderer === undefined) return

	requestAnimationFrame(this.update.bind(this))
    this.figure.update()
	this.renderer.render(this.scene, this.camera)
    }
}