import * as THREE from "three";
import { RGBELoader } from "../astrowatching/js/RGBELoader.js";
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
const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputColorSpace = THREE.SRGBColorSpace;

new RGBELoader().load("./assets/images/starmap.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

var earthtooltip = true;
var startooltip = true;

document.getElementById("earth-button").onclick = function () {
  if (earthtooltip == true) {
    earthtooltip = false;
    earthGroup.visible = false;
    document.getElementById("earth-button").style =
      "color: white; background-color: rgba(0, 0, 0, 0.5);";
  } else {
    earthtooltip = true;
    earthGroup.visible = true;
    document.getElementById("earth-button").style =
      "color: black; background-color: rgba(255, 255, 255, 1);";
  }
};

document.getElementById("greenstars-button").onclick = function () {
  if (startooltip == true) {
    startooltip = false;
    stars.visible = false;
    document.getElementById("greenstars-button").style =
      "color: white; background-color: rgba(0, 0, 0, 0.5);";
  } else {
    startooltip = true;
    stars.visible = true;
    document.getElementById("greenstars-button").style =
      "color: black; background-color: rgba(255, 255, 255, 1);";
  }
};

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
controls.enableZoom = false;
const detail = 16;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./assets/images/00_earthmap1k.jpg"),
  specularMap: loader.load("./assets/images/02_earthspec1k.jpg"),
  bumpMap: loader.load("./assets/images/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./assets/images/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./assets/images/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./assets/images/05_earthcloudmaptrans.jpg"),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.001);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield();
scene.add(stars);
stars.rotation.x -= 1.5708;

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  earthMesh.rotation.y += 0.0002;
  lightsMesh.rotation.y += 0.0002;
  cloudsMesh.rotation.y += 0.0002;
  glowMesh.rotation.y += 0.0002;
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

$("#search-button").on("click", function () {
  console.log("Star Select");
  socket.emit("selectStar", $("#object-search").val());
});

socket.on("starSelect", (star) => {
  $(".property").remove();
  if (star) {
    // Generate star properties display
    var div = document.createElement("div");
    div.classList.add("property");
    div.classList.add("starname");
    if (star.proper) {
      div.innerHTML = "Star Name: " + star.proper;
    } else if (star.bayer) {
      div.innerHTML = "Star Name: " + star.bayer + " " + star.con;
    } else {
      div.innerHTML = "Star Name: Unknown";
    }
    $("#wrapper").append(div);

    for (const property in star) {
      var div = document.createElement("div");
      div.classList.add("property");
      div.innerHTML = `${replacer[property]}: ${star[property]}`;
      $("#wrapper").append(div);
    }

    // Convert star RA and Dec to 3D spherical coordinates
    const raRad = (star.ra / 24) * Math.PI * 2; // Right Ascension in radians
    const decRad = (star.dec * Math.PI) / 180; // Declination in radians

    // Target star position on celestial sphere
    const starX = Math.cos(decRad) * Math.cos(raRad);
    const starY = Math.sin(decRad);
    const starZ = Math.cos(decRad) * Math.sin(raRad);
    const starPosition = new THREE.Vector3(starX, starY, starZ);

    // Camera position on the sphere (distance = 5)
    const distance = 5;
    const cameraX = distance * -starX; // Opposite direction from the star
    const cameraY = distance * -starY;
    const cameraZ = distance * -starZ;

    // Animate camera to this new position
    const targetPosition = new THREE.Vector3(cameraX, cameraY, cameraZ);
    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        controls.update(); // Update controls during animation
      },
      onComplete: () => {
        // Point camera to Earth (at origin)
        controls.target.set(0, 0, 0);
      },
    });
  } else {
    var div = document.createElement("div");
    div.classList.add("property");
    div.classList.add("starname");
    div.innerHTML = "We're sorry, but we couldn't find that star.";
    $("#wrapper").append(div);
  }
});
