import './style.css';

import * as THREE from 'three';

// to load textures for ISS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// allows navigation with mouse
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// lighting
// import { AmbientLight } from 'three';
// import { PointLight } from 'three';

let wInner = window.innerWidth;
let wHeight = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, wInner / wHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	// allows transparency
	alpha: true,
	antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(wInner, wHeight);
camera.position.setZ(40);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'/textures/2k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(3, 128, 128);
const earthMaterial = new THREE.MeshLambertMaterial({
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

earth.receiveShadow = true;
earth.position.set(0, 3.5, 0);
scene.add(earth);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/2k_earth_clouds.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(3.04, 128, 128);
const earthCloudsMaterial = new THREE.MeshLambertMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.4,
});

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
earthClouds.castShadow = true;
earthClouds.receiveShadow = true;
earthClouds.position.set(0, 3.5, 0);

scene.add(earthClouds);

// Object to control moon orbit
const moonOrbitCenter = new THREE.Object3D();
moonOrbitCenter.position.set(0, 3.5, 0);
scene.add(moonOrbitCenter);

// add ISS gltf model to the scene
const loader = new GLTFLoader();
let iss;
loader.load('textures/iss/scene.gltf', (gltf) => {
	iss = gltf.scene;
	iss.scale.set(0.04, 0.04, 0.04);
	iss.position.set(3.5, 0, 0);

	iss.receiveShadow = true;

	scene.add(iss);
	// console.log(iss.getWorldPosition());
});

const issOrbitCenter = new THREE.Object3D();
// issOrbitCenter.rotateX(-0.7);
issOrbitCenter.position.set(0, 3.5, 0);

scene.add(issOrbitCenter);

// Moon
const moonTexture = new THREE.TextureLoader().load('textures/2k_moon.jpg');

const moonGeometry = new THREE.SphereGeometry(1, 64, 64);
const moonMaterial = new THREE.MeshLambertMaterial({
	map: moonTexture,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(10, 0, 0);
moon.rotateY(3.5);


scene.add(moon);

const sunLight = new THREE.PointLight(0xffffff, 1.45);
sunLight.position.set(0, 0, 20);
sunLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff, .05);
ambientLight.position.set(0, 0, 0);

scene.add(sunLight, ambientLight);

// skybox - universebox
const skyboxTexture = new THREE.TextureLoader().load(
	'/textures/8k_stars_milky_way.jpg'
);

const skyboxGeometry = new THREE.SphereGeometry(100, 64, 64);
const skyboxMaterial = new THREE.MeshBasicMaterial({
	side: THREE.DoubleSide,
	map: skyboxTexture,
});

const universe = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
universe.scale.set(-1, 1, 1)

universe.position.set(0, 0, 0);
scene.add(universe)

// stars
// function addStar() {
// 	const starGeometry = new THREE.SphereGeometry(0.25, 24, 25);
// 	const starMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
// 	const star = new THREE.Mesh(starGeometry, starMaterial);

// 	const [x, y, z] = Array(3)
// 		.fill()
// 		.map(() => THREE.MathUtils.randFloatSpread(1000));
// 	star.position.set(x, y, z);
// 	scene.add(star);
// }

// Array(200).fill().forEach(addStar);

// const lightHelper = new THREE.PointLightHelper(ringLight);

// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

// ride the iss
// TODO: When 'riding the iss' all other sections not to be hidden to stop scrolling.
const rideIss = document.getElementById('iss-ride');
const leaveIss = document.getElementById('iss-leave');

const home = document.getElementById('home');
const onIss = document.getElementById('on-iss');

rideIss.addEventListener('click', () => {
	const elements = [home, onIss];
	elements.map((element) => {
		element.classList.contains('hidden')
			? element.classList.remove('hidden')
			: element.classList.add('hidden');
	});
	iss.add(camera);

	camera.position.set(6, 0, 20);
});

leaveIss.addEventListener('click', () => {
	let elements = [home, onIss];
	elements.map((element) => {
		element.classList.contains('hidden')
			? element.classList.remove('hidden')
			: element.classList.add('hidden');
	});
	iss.remove(camera);
	camera.position.set(0, 0, 40);
});

// animation
function animate() {
	requestAnimationFrame(animate);

	// earth
	earth.rotation.y += 0.0005;
	earthClouds.rotation.y += 0.00019;

	// moon
	moonOrbitCenter.rotation.y += 0.0008;
	moonOrbitCenter.add(moon);
	moon.rotation.y += 0.0000000000019;

	// iss and orbit
	issOrbitCenter.add(iss);
	issOrbitCenter.rotation.y += 0.0009;

	// skybox
	universe.rotation.y += 0.0001

	// controls.update();

	renderer.render(scene, camera);
}

animate();

// function that dynamically sets on window resize
const handleWindowResize = () => {
	wInner = window.innerWidth;
	wHeight = window.innerHeight;
	camera.aspect = wInner / wHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', handleWindowResize, false);
