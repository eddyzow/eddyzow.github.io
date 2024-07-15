import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";
//const socket = io("http://127.0.0.1:3000"); // comment this out if testing on a LIVE BUILD

const socket = io("https://astrowatching-server.onrender.com"); // comment this out if testing on a DEV BUILD
const replacer = {
  _id: "Database Object ID",
  id: "ID",
  name: "Name",
  proper: "Proper Name",
  hip: "Hipparcos ID",
  hd: "Henry Draper ID",
  hr: "Harvard Revised ID",
  flam: "Flamsteed Number",
  bf: "Bayer-Flamsteed Designation",
  bayer: "Bayer Designation",
  gl: "Gliese ID",
  ra: "Right Ascension",
  dec: "Declination",
  dist: "Distance (parsecs)",
  pmra: "Proper Motion Right Ascension",
  pmdec: "Proper Motion Declination",
  rv: "Radial Velocity",
  mag: "Apparent Magnitude",
  absmag: "Absolute Magnitude",
  spect: "Spectral Class",
  ci: "B-V Color Index",
  x: "X Position",
  y: "Y Position",
  z: "Z Position",
  vx: "X Motion",
  vy: "Y Motion",
  vz: "Z Motion",
  rarad: "Right Ascension (radians)",
  decrad: "Declination (radians)",
  pmrarad: "Proper Motion Right Ascension (radians)",
  pmdecrad: "Proper Motion Declination (radians)",
  con: "Constellation",
  comp: "Companion Number",
  comp_primary: "ID of Primary Star",
  lum: "Luminosity (Suns)",
  var: "Variable Type",
  var_min: "Minimum Variable Magnitude",
  var_max: "Maximum Variable Magnitude",
};

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);
const detail = 16;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("00_earthmap1k.jpg"),
  specularMap: loader.load("02_earthspec1k.jpg"),
  bumpMap: loader.load("01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("05_earthcloudmaptrans.jpg"),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.001);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.0;
  lightsMesh.rotation.y += 0.0;
  cloudsMesh.rotation.y += 0.0002;
  glowMesh.rotation.y += 0.0;
  stars.rotation.y -= 0.0;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);

socket.on("hello", (data) => {
  $("#testtext").text("Successfully connected to server!!");
});

$("#buttonSelect").on("click", function () {
  console.log("Star Select");
  socket.emit("selectStar", $("#star-input").val());
});

socket.on("starSelect", (star) => {
  $(".property").remove();
  if (star) {
    // generate name
    var div = document.createElement("div");
    div.classList.add("property");
    div.classList.add("starname");
    if (star.gl) {
      div.innerHTML = "Star Name: " + star.gl;
    }
    if (star.hr) {
      div.innerHTML = "Star Name: " + "HR " + star.hr;
    }
    if (star.hip) {
      div.innerHTML = "Star Name: " + "HIP " + star.hip;
    }
    if (star.hd) {
      div.innerHTML = "Star Name: " + "HD " + star.hd;
    }
    if (star.flam) {
      div.innerHTML = "Star Name: " + star.flam + " " + star.con;
    }
    if (star.bayer) {
      div.innerHTML = "Star Name: " + star.bayer + " " + star.con;
    }
    if (star.proper) {
      div.innerHTML = "Star Name: " + star.proper;
    }

    $("#wrapper").append(div);

    for (const property in star) {
      var div = document.createElement("div");
      div.classList.add("property");
      div.innerHTML = `${replacer[property]}: ${star[property]}`;

      $("#wrapper").append(div);
    }
  } else {
    var div = document.createElement("div");
    div.classList.add("property");
    div.classList.add("starname");
    div.innerHTML = "We're sorry, but we couldn't find that star.";
    $("#wrapper").append(div);
  }
});
