import './style.css';

import * as THREE from 'three';

// to load textures for ISS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// allows navigation with mouse
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
	'/textures/8k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(3, 128, 128);
const earthMaterial = new THREE.MeshLambertMaterial({
	transparent: true,
	opacity: 0.5,
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

earth.receiveShadow = true;
earth.position.set(0, 3.5, 0);
scene.add(earth);

// earth lights
const earthLightsTexture = new THREE.TextureLoader().load(
	'/textures/8k_earth_nightmap.jpg'
);

const earthLightsGeometry = new THREE.SphereGeometry(3, 128, 128);
const earthLightsMaterial = new THREE.MeshBasicMaterial({
	map: earthLightsTexture,
});

const earthNight = new THREE.Mesh(earthLightsGeometry, earthLightsMaterial);
earthNight.position.set(0, 3.5, 0);
scene.add(earthNight);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/8k_earth_clouds.jpg'
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


// Moon
const moonTexture = new THREE.TextureLoader().load('textures/8k_moon.jpg');

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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
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
universe.scale.set(-1, 1, 1);

universe.position.set(0, 0, 0);
scene.add(universe);

// add ISS gltf model to the scene
const issLoader = new GLTFLoader();
let iss;
issLoader.load('textures/iss/scene.gltf', (gltf) => {
	iss = gltf.scene;
	iss.scale.set(0.02, 0.02, 0.02);
	iss.rotateZ(1.6);
	iss.position.set(3.2, 0, 0);

	iss.receiveShadow = true;

	scene.add(iss);
	// console.log(iss.getWorldPosition());
});

const issOrbitCenter = new THREE.Object3D();

issOrbitCenter.position.set(0, 3.5, 0);

scene.add(issOrbitCenter);

// add lunar module

// add ISS gltf model to the scene
const lunarLoader = new GLTFLoader();
let lunarModule;
lunarLoader.load('/textures/apollo_11_command_module_combined/scene.gltf', (gltf) => {
	lunarModule = gltf.scene;
	lunarModule.scale.set(0.01, 0.01, 0.01);
	// iss.rotateZ(1.6);
	lunarModule.position.set(9.85, .98, .064);

	lunarModule.receiveShadow = true;

	scene.add(lunarModule);
	// console.log(iss.getWorldPosition());
});


// ride the iss
const rideIss = document.getElementById('iss-ride');
const leaveIss = document.getElementById('iss-leave');

const sections = document.getElementsByTagName('section');
const sectionsArray = [...sections];

rideIss.addEventListener('click', () => {
	sectionsArray.map((section) => {
		if (section.id != 'on-moon') {
			section.classList.contains('hidden')
				? section.classList.remove('hidden')
				: section.classList.add('hidden');
		}
	});
	iss.add(camera);
	camera.position.set(7, 5, 30);
});

leaveIss.addEventListener('click', () => {
	sectionsArray.map((section) => {
		if (section.id != 'on-moon')
			section.classList.contains('hidden')
				? section.classList.remove('hidden')
				: section.classList.add('hidden');
	});
	iss.remove(camera);
	camera.position.set(0, 0, 40);
});

// stand on the moon
const standOnMoon = document.getElementById('stand-on-moon');
const leaveMoon = document.getElementById('moon-leave');

standOnMoon.addEventListener('click', () => {
	sectionsArray.map((section) => {
		if (section.id != 'on-iss') {
			section.classList.contains('hidden')
				? section.classList.remove('hidden')
				: section.classList.add('hidden');
		}
	});
	moonOrbitCenter.add(camera);
	camera.position.set(10, 1.047, 0);
	camera.lookAt(earth.position);
});

leaveMoon.addEventListener('click', () => {
	sectionsArray.map((section) => {
		if (section.id != 'on-iss') {
			section.classList.contains('hidden')
				? section.classList.remove('hidden')
				: section.classList.add('hidden');
		}
	});


	moonOrbitCenter.remove(camera);
	camera.position.set(0, 0, 40);
	camera.lookAt(0, 0, 0);
});

// const controls = new OrbitControls(camera, renderer.domElement);

// animation
function animate() {
	requestAnimationFrame(animate);

	// earth
	earth.rotation.y += 0.0005;
	earthClouds.rotation.y += 0.0005;
	earthNight.rotation.y += 0.0005;

	// moon
	moonOrbitCenter.rotation.y += 0.0008;
	moonOrbitCenter.add(moon, lunarModule, astronaut);
	moon.rotation.y += 0.0000000000019;

	// iss and orbit
	issOrbitCenter.add(iss);
	issOrbitCenter.rotation.y += 0.002;

	// skybox
	universe.rotation.y += 0.0001;

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
