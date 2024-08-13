import * as THREE from "three";

export default function getStarfield() {
  function randomSpherePoint(starx, stary, starz, dist) {
    return {
      pos: new THREE.Vector3(starx, stary, starz),
      hue: 0.6,
      minDist: dist,
    };
  }
  const verts = [];
  const colors = [];
  const positions = [];
  let col;
  for (let i = 0; i < 999; i += 1) {
    console.log(data[i].dist);
    let p = randomSpherePoint(
      data[i].x / data[i].dist,
      data[i].y / data[i].dist,
      data[i].z / data[i].dist,
      data[i].dist
    );
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 1, 1);
    verts.push(pos.x * 500, pos.y * 500, pos.z * 500);
    colors.push(col.r, col.g, col.b); // col.r, col.g, col.b
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    transparent: true,
    map: new THREE.TextureLoader().load("./assets/images/circle.png"),
  });
  const points = new THREE.Points(geo, mat);
  return points;
}
