/** One shared topology lets every point retain its identity between chapters. */
export const GRID_SIDE = 29;
export const GRID_COUNT = GRID_SIDE * GRID_SIDE;
export type GridForm = 0 | 1 | 2;

export function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/** Ease both velocity and acceleration, then hold the completed ribbon. */
export function gridPhases(progress: number) {
  const ease = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  const connect = ease(progress / 0.85);
  const expand = ease((progress - 1.15) / 0.85);
  return { connect, expand, ribbon: connect * (1 - expand) };
}

export function makeTopology(side = GRID_SIDE) {
  const edges: number[] = [];
  const faces: number[] = [];
  for (let row = 0; row < side; row++) {
    for (let col = 0; col < side; col++) {
      const i = row * side + col;
      if (col < side - 1) edges.push(i, i + 1);
      if (row < side - 1) edges.push(i, i + side);
      if (col < side - 1 && row < side - 1)
        faces.push(i, i + side, i + 1, i + 1, i + side, i + side + 1);
    }
  }
  return { edges: new Uint16Array(edges), faces: new Uint16Array(faces) };
}

/** Surface → a connected Möbius ribbon → an open coordinate field. */
export function writeGrid(
  output: Float32Array,
  progress: number,
  form: GridForm,
  time: number,
) {
  const { connect, expand } = gridPhases(progress);
  for (let i = 0; i < GRID_COUNT; i++) {
    const u = (i % GRID_SIDE) / (GRID_SIDE - 1);
    const v = Math.floor(i / GRID_SIDE) / (GRID_SIDE - 1);
    const a = u * Math.PI * 2;
    const b = v * Math.PI * 2;
    let x: number, y: number, z: number;
    if (form === 1) {
      const r = 2.2 + 0.8 * Math.cos(b);
      x = r * Math.cos(a); y = 0.8 * Math.sin(b); z = r * Math.sin(a);
    } else if (form === 2) {
      const latitude = 0.025 + v * (Math.PI - 0.05);
      x = 2.6 * Math.sin(latitude) * Math.cos(a);
      y = 2.6 * Math.cos(latitude);
      z = 2.6 * Math.sin(latitude) * Math.sin(a);
    } else {
      // Bend the sheet into a circular arc while narrowing and half-twisting
      // its cross-section. At connect=1, reversed endpoints meet exactly.
      const angle = (u - 0.5) * Math.PI * 2 * connect;
      const arcLength = 7 + (Math.PI * 5 - 7) * connect;
      const bendRadius = connect > 0.00001 ? arcLength / (Math.PI * 2 * connect) : 0;
      const width = (v - 0.5) * (7 - 5.2 * connect);
      const twist = Math.PI / 2 * (1 - connect) + u * Math.PI * connect;
      const radial = width * Math.cos(twist);
      x = connect > 0.00001 ? Math.sin(angle) * bendRadius : (u - 0.5) * 7;
      y = connect > 0.00001 ? (1 - Math.cos(angle)) * bendRadius - 2.5 * connect : 0;
      x += radial * Math.sin(angle);
      y -= radial * Math.cos(angle);
      y += Math.sin(u * Math.PI * 2 + time * 0.24) * Math.cos(v * Math.PI * 1.5) * 0.9 * (1 - connect);
      z = width * Math.sin(twist);
    }
    if (form !== 0) {
      const angle = (u - 0.5) * Math.PI * 2;
      const width = (v - 0.5) * 1.8;
      const radius = 2.5 + width * Math.cos(u * Math.PI);
      x += (radius * Math.sin(angle) - x) * connect;
      y += (-radius * Math.cos(angle) - y) * connect;
      z += (width * Math.sin(u * Math.PI) - z) * connect;
    }
    output[i * 3] = x + ((u - 0.5) * 22 - x) * expand;
    output[i * 3 + 1] = y + (-1.7 + Math.sin(u * 8 + time * 0.15) * 0.12 - y) * expand;
    output[i * 3 + 2] = z + ((v - 0.5) * 28 - z) * expand;
  }
}
