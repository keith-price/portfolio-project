import './style.css';

import * as THREE from 'three';

// to load model for ISS
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// allows navigation with mouse
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let wWidth = window.innerWidth;
let wHeight = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, wWidth / wHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	// allows transparency
	alpha: true,
	antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(wWidth, wHeight);
camera.position.setZ(40);

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
sunLight.position.set(0, 0, 20);
// sunLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
ambientLight.position.set(0, 0, 0);
scene.add(sunLight, ambientLight);

// Earth
const earthTexture = new THREE.TextureLoader().load(
	'/textures/2k_earth_daymap.jpg'
);

const earthGeometry = new THREE.SphereGeometry(3, 128, 128);
const earthMaterial = new THREE.MeshLambertMaterial({
	transparent: true,
	opacity: 0.5,
	map: earthTexture,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// earth.castShadow = true;
// earth.receiveShadow = true;
wHeight > 800 ? earth.position.set(0, 3.5, 0) : earth.position.set(0, 0, 0);
scene.add(earth);

// earth lights
const earthLightsTexture = new THREE.TextureLoader().load(
	'/textures/2k_earth_nightmap.jpg'
);

const earthLightsGeometry = new THREE.SphereGeometry(3, 128, 128);
const earthLightsMaterial = new THREE.MeshBasicMaterial({
	map: earthLightsTexture,
});

const earthNight = new THREE.Mesh(earthLightsGeometry, earthLightsMaterial);
wHeight > 800
	? earthNight.position.set(0, 3.5, 0)
	: earth.position.set(0, 0, 0);
scene.add(earthNight);

// Earth clouds sphere
const earthCloudsTexture = new THREE.TextureLoader().load(
	'textures/2k_earth_clouds.jpg'
);

const earthCloudsGeometry = new THREE.SphereGeometry(3.06, 128, 128);
const earthCloudsMaterial = new THREE.MeshLambertMaterial({
	map: earthCloudsTexture,
	transparent: true,
	opacity: 0.4,
});

const earthClouds = new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
// earthClouds.castShadow = true;
// earthClouds.receiveShadow = true;
wHeight > 800
	? earthClouds.position.set(0, 3.5, 0)
	: earth.position.set(0, 0, 0);
scene.add(earthClouds);

// Moon
const moonTexture = new THREE.TextureLoader().load('textures/8k_moon.jpg');
const moonGeometry = new THREE.SphereGeometry(1, 64, 64);
const moonMaterial = new THREE.MeshLambertMaterial({
	map: moonTexture,
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// moon.castShadow = true;
// moon.receiveShadow = true;

moon.position.set(-15, 0, 0);
moon.rotateY(3.5);
scene.add(moon);

// Object to control moon orbit
const moonOrbitCenter = new THREE.Object3D();
wHeight > 800
	? moonOrbitCenter.position.set(0, 3.5, 0)
	: earth.position.set(0, 0, 0);
scene.add(moonOrbitCenter);
moonOrbitCenter.add(moon);

// iss orbit center
const issOrbitCenter = new THREE.Object3D();
wHeight > 800
	? issOrbitCenter.position.set(0, 3.5, 0)
	: earth.position.set(0, 0, 0);
scene.add(issOrbitCenter);

// add ISS gltf model to the scene
const issLoader = new GLTFLoader();
let iss;
issLoader.load('textures/iss/scene.gltf', (gltf) => {
	iss = gltf.scene;
	iss.scale.set(0.02, 0.02, 0.02);
	iss.rotateZ(1.6);
	iss.position.set(3.2, 0, 0);
	scene.add(iss);
	issOrbitCenter.add(iss);
	// iss.castShadow = true;
	// iss.receiveShadow = true;
});

// add lunar lander
const lunarLoader = new GLTFLoader();
let lunarLander;
lunarLoader.load('/textures/lunar_ship_lk_lander/scene.gltf', (gltf) => {
	lunarLander = gltf.scene;
	lunarLander.scale.set(0.01, 0.01, 0.01);
	lunarLander.rotateZ(-0.237);
	lunarLander.rotateX(-0.065);
	lunarLander.rotateY(-2);

	lunarLander.position.set(-14.75, 0.976, -0.06);

	// lunarLander.position.set(14.75, 0.976, 0.06);

	scene.add(lunarLander);
	moonOrbitCenter.add(lunarLander);
	// lunarLander.castShadow = true;
	// lunarLander.receiveShadow = true;
});

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

// audio controls and play/pause functions
const playBtn = document.getElementById('play-btn');
const siteAudio = document.getElementById('site-audio');

let audioState = false;

function playAudio() {
	siteAudio.play();
	audioState = true;
}

function stopAudio() {
	siteAudio.currentTime = 0;
	siteAudio.pause();
	audioState = false;
}

playBtn.addEventListener('click', () => {
	audioState ? stopAudio() : playAudio();
});

// get sections to add/remove hidden class
const sections = document.getElementsByTagName('section');
const sectionsArray = [...sections, playBtn];

// stand on the moon
const standOnMoon = document.getElementById('stand-on-moon');
const leaveMoon = document.getElementById('moon-leave');

standOnMoon.addEventListener('click', () => {
	sectionsArray.map((section) => {
		section.classList.contains('hidden')
			? section.classList.remove('hidden')
			: section.classList.add('hidden');
	});

	moonOrbitCenter.add(camera);
	camera.position.set(-14.95, 1.047, 0);
	camera.lookAt(earth.position);
});

leaveMoon.addEventListener('click', () => {
	sectionsArray.map((section) => {
		section.classList.contains('hidden')
			? section.classList.remove('hidden')
			: section.classList.add('hidden');
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
	earthClouds.rotation.y += 0.00049;
	earthNight.rotation.y += 0.0005;

	// skybox
	universe.rotation.y += 0.0001;

	// moon
	moonOrbitCenter.rotation.y += 0.0008;
	moon.rotation.y += 0.0000000000019;

	// iss
	issOrbitCenter.rotation.y += 0.004;

	// controls.update();

	renderer.render(scene, camera);
}

animate();

// function that dynamically sets on window resize
const handleWindowResize = () => {
	wWidth = window.innerWidth;
	wHeight = window.innerHeight;
	camera.aspect = wWidth / wHeight;
	camera.updateProjectionMatrix();
	console.log(wHeight);
	// moves the lunar lander to a central position in order to be seen on narrower screens
	if (wWidth < 700) {
		lunarLander.position.set(-14.75, 0.976, 0);
	} else {
		lunarLander.position.set(-14.75, 0.976, -0.06);
	}

	if (wHeight > 800) {
		earth.position.set(0, 3.5, 0);
		earthClouds.position.set(0, 3.5, 0);
		earthNight.position.set(0, 3.5, 0);
		moonOrbitCenter.position.set(0, 3.5, 0);
		issOrbitCenter.position.set(0, 3.5, 0);
	} else {
		earth.position.set(0, 0, 0);
		earthClouds.position.set(0, 0, 0);
		earthNight.position.set(0, 0, 0);
		moonOrbitCenter.position.set(0, 0, 0);
		issOrbitCenter.position.set(0, 0, 0);
	}

	renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', handleWindowResize, true);
