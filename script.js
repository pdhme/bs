import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "three.module.js";
// import { OrbitControls } from "OrbitControls.js";
// import { GLTFLoader } from "GLTFLoader.js";
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function resize() {
	document.body.style.backgroundSize = window.innerWidth / window.innerHeight > image_geometry ? "100vw auto" : "auto 100vh";
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function getBase64ImageGeometry(item) {
	var img = new Image();
	return new Promise((done) => {
		img.onload = function () {
			done(img.width / img.height);
		};
		img.src = item.style.backgroundImage.replace(/url\(|\)$|"/gi, "");
	});
}

function down() {
	document.body.style.backgroundPosition = "center center";
	document.body.style.backgroundImage =
		'url("/irl-buckshot/look-down.png")';
}
function up() {
	document.body.style.backgroundPosition = "center bottom";
	document.body.style.backgroundImage =
		'url("/irl-buckshot/look-up.png")';
}

var txt = document.getElementById("main");

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function count(arr, e) {
	var count = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == e) count++;
	}
	return count;
}

//function round() {
//	if (shotgun.length < 1) {
//		shotgun = Array.from({ length: rnd(2, 8) }, () =>
//			Math.floor(Math.random() * 2)
//		);
//		txt.textContent =
//			"live: " + count(shotgun, 1) + "; blank: " + count(shotgun, 0);
//	} else {
//		txt.textContent = shotgun.shift() == 1 ? "live" : "blank";
//		if (shotgun.length < 1) {
//			txt.textContent = "LAST: " + txt.textContent;
//		}
//	}
//}
//
//function reset() {
//	txt.textContent = "";
//	shotgun = [];
//}

function load_model() {
	return new Promise ( (resolve, reject) => {
		window.loader = new GLTFLoader();
		loader.load(
			"/irl-buckshot/assets/shotgun/scene.gltf",
			function (gltf) {
				scene.add(gltf.scene);
				window.shotgun = gltf.scene;
				resolve();
			},
			function (xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			function (error) {
				console.error(error);
				reject();
			}
		);
	});
}

async function load() {

	down();
	window.image_geometry = await getBase64ImageGeometry(document.body);

	window.shotgun_live = new Audio(
		"https://www.fesliyanstudios.com/play-mp3/7123"
	);
	window.shotgun_blank = new Audio(
		"https://www.fesliyanstudios.com/play-mp3/7527"
	);


	//
	// 3D
	//

	// THREE JS
	window.scene = new THREE.Scene();
	window.camera = new THREE.PerspectiveCamera(75,	window.innerWidth / window.innerHeight,	0.1, 1000);

	// Loader
	var a = await load_model();
	shotgun.position.x -= 3;
	shotgun.position.z += 0.5;
	shotgun.rotation.set(0, -1.9, -1.570796);

	// Renderer
	window.renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("shotgun"),
		antialias: true,
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	var c = 1.5;
	camera.position.set( 6/c, 8/c, 0 );

	// Light
	var light = new THREE.AmbientLight(0xffffff, 15);
	scene.add(light);

	// Help
	window.ctrl = new OrbitControls(camera, renderer.domElement);
	scene.add(new THREE.GridHelper(200, 50));

	window.addEventListener("resize", resize);
	resize();
	render();

}

function render() {

	requestAnimationFrame(render);
	ctrl.update();
	renderer.render(scene, camera);

}

load().then(async () => {
	let loading_scr = document.getElementById("loading");
	await loading_scr.animate({ opacity: 0 }, { fill: "forwards", duration: 1000 }).finished;
	loading_scr.remove();
});
