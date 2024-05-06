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
	document.body.style.backgroundSize =
		window.innerWidth / window.innerHeight > image_geometry
			? "100vw auto"
			: "auto 100vh";
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

async function getBase64ImageGeometry(item) {
	var img = new Image();
	return await new Promise((done) => {
		img.onload = function () {
			done(img.width / img.height);
		};
		img.src = item.style.backgroundImage.replace(/url\(|\)$|"/gi, "");
	});
}

function down() {
	document.body.style.backgroundPosition = "center center";
	document.body.style.backgroundImage =
		'url("look-down.png")';
}
function up() {
	document.body.style.backgroundPosition = "center bottom";
	document.body.style.backgroundImage =
		'url("/look-up.png")';
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


async function load() {
	down();
	window.image_geometry = getBase64ImageGeometry(document.body);

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
	window.loader = new GLTFLoader();
	await window.loader.load(
		"/assets/shotgun/scene.gltf",
		function (gltf) {
			const model = gltf.scene;
			scene.add(model);
			window.shotgun = model;
		},
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		function (error) {
			console.error(error);
		}
	);

	// Renderer
	window.renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("shotgun"),
		antialias: true,
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	camera.position.set( 10, 0, 0 );

	// Light
	var light = new THREE.PointLight(0xffffff, 30);
	light.position.set(-5, 10, 10);
	scene.add(light);

	// Help
	window.ctrl = new OrbitControls(camera, renderer.domElement);
	scene.add(new THREE.PointLightHelper(light), new THREE.GridHelper(200, 50));

	window.addEventListener("resize", resize);
	resize();
}

function render() {

	requestAnimationFrame(render);
	shotgun.rotation.y += 0.01;
	ctrl.update();
	renderer.render(scene, camera);

}

load().then(() => {
	document.getElementById("loading").animate({ opacity: 0 }, { fill: "forwards", duration: 1000 });
	setTimeout( () => {
		document.getElementById("loading").remove();
	}, 1500);
	render();
});
