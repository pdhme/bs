import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import * as THREE from "three.module.js";
// import { OrbitControls } from "OrbitControls.js";
// import { GLTFLoader } from "GLTFLoader.js";
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function backgroundResize() {
  document.body.style.backgroundSize =
    window.innerWidth / window.innerHeight > image_geometry
      ? "100vw auto"
      : "auto 100vh";
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
    'url("https://cdn.glitch.global/702694fb-7781-441d-99ae-540ed07bd705/look-down.png?v=1714842957382")';
}
function up() {
  document.body.style.backgroundPosition = "center bottom";
  document.body.style.backgroundImage =
    'url("https://cdn.glitch.global/702694fb-7781-441d-99ae-540ed07bd705/look-up.png?v=1714842961490")';
}

var txt = document.getElementById("main");

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var shotgun = [];

function count(arr, e) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == e) count++;
  }
  return count;
}

function round() {
  if (shotgun.length < 1) {
    shotgun = Array.from({ length: rnd(2, 8) }, () =>
      Math.floor(Math.random() * 2)
    );
    txt.textContent =
      "live: " + count(shotgun, 1) + "; blank: " + count(shotgun, 0);
  } else {
    txt.textContent = shotgun.shift() == 1 ? "live" : "blank";
    if (shotgun.length < 1) {
      txt.textContent = "LAST: " + txt.textContent;
    }
  }
}

function reset() {
  txt.textContent = "";
  shotgun = [];
}

async function load() {
  down();
  window.image_geometry = await getBase64ImageGeometry(document.body);
  window.addEventListener("resize", backgroundResize);
  backgroundResize();

  window.shotgun_live = new Audio(
    "https://www.fesliyanstudios.com/play-mp3/7123"
  );
  window.shotgun_blank = new Audio(
    "https://www.fesliyanstudios.com/play-mp3/7527"
  );

  window.scene = new THREE.Scene();
  window.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //Instantiate a loader for the .gltf file
  window.loader = new GLTFLoader();

  //Load the file
  window.loader.load(
    // "https://stor1.edisk.download/get/683822108/scene.gltf?download_token=m09B3wJpQikpWprO13uSJCFLVrRrEl4",
    //		"https://stor1.edisk.download/get/683827708/rusty_old_shotgun.glb?download_token=-MA6cMzzW8VhNt80WwBt7EYc7zl4wEL",
//    "https://drive.google.com/uc?export=download&id=1Hdk12-mwebI6Ek-NPUwTr5PWDrby8rSf",
	"/shotgun/scene.gltf",
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

  window.renderer = new THREE.WebGLRenderer({
    //		canvas: document.getElementById("shotgun"),
    alpha: true,
  }); //Alpha: true allows for the transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene.add(new THREE.AmbientLight(0x333333, 5));
  document.getElementById("container3D").appendChild(renderer.domElement);

  requestAnimationFrame();
  renderer.render(scene, camera);
}

load().then(() => {
  document
    .getElementById("loading")
    .animate({ opacity: 0 }, { fill: "forwards", duration: 1000 });
  console.log(image_geometry);
  console.log(renderer);
});

