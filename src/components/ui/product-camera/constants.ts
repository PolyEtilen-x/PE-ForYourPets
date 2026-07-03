import { CameraColor } from './types';

// ============================================================
// SOURCE OF TRUTH — from product-physical.md
// Scale: 1 Three.js unit = 1 cm
// Total product height H = 10.5 cm
// ============================================================

export const DIMENSIONS = {
  totalHeight: 10.5,

  body: {
    maxRadius: 2.75,
    zoneHeightRatio: 0.50,
    frontFlattenRatio: 0.08,
  },

  neckJoint: {
    zoneHeightRatio: 0.15,
    minRadius: 0.85,
  },

  gimbalArm: {
    tubeRadius: 0.55, // 5.5mm per spec
  },

  turntable: {
    radius: 2.3,
    height: 1.2,
  },

  base: {
    zoneHeightRatio: 0.35,
    topRadius: 2.3,
    maxRadius: 2.75,
    footRadius: 0.65,
  },

  frontGlass: { radius: 2.1 },

  lens: {
    outerRingRadius: 1.3,
    opticalHousingRadius: 0.95,
    glassRadius: 0.6,
  },

  statusLed: { radius: 0.6 },
} as const;

// ============================================================
// Assembly positions — derived from spec ratios
// Product is centered vertically: BASE_BOTTOM = -H/2
// ============================================================
const H = DIMENSIONS.totalHeight; // 10.5

const BASE_BOTTOM_Y  = -(H / 2);                              // -5.25
const BASE_HEIGHT    = H * DIMENSIONS.base.zoneHeightRatio;  //  3.675
const BASE_TOP_Y     = BASE_BOTTOM_Y + BASE_HEIGHT;           // -1.575

const TURNTABLE_H    = DIMENSIONS.turntable.height;           //  1.2
const TURNTABLE_Y    = BASE_TOP_Y + TURNTABLE_H / 2;          // -0.975
const TURNTABLE_TOP  = BASE_TOP_Y + TURNTABLE_H;              // -0.375

// Body center = 25% from top = 75% from bottom
const BODY_Y         = BASE_BOTTOM_Y + H * 0.75;             //  2.625
const BODY_R         = DIMENSIONS.body.maxRadius;             //  2.75

// PIVOT is where the arm connects to the body sphere — at body equatorial height
// The arm physically connects to the SIDE of the body (left/right) at body sphere equator
const PIVOT_X        = BODY_R * 0.95;                        //  2.61 (just at body sphere surface)
const PIVOT_Y        = BODY_Y;                                //  2.625 — SAME as body center

// Front face Z: where the glass disc sits on the sphere surface
// Z = sqrt(R² - glassR²) = sqrt(2.75² - 2.1²) ≈ 1.78
const FRONT_FACE_Z   = Math.sqrt(BODY_R * BODY_R - DIMENSIONS.frontGlass.radius ** 2); // 1.78

// Lens Z: slightly less deep than front face (lens housing starts at glass opening)
const LENS_Z         = FRONT_FACE_Z - 0.10; // 1.68

export const ASSEMBLY = {
  BASE_BOTTOM_Y,
  BASE_HEIGHT,
  BASE_TOP_Y,

  TURNTABLE_Y,
  TURNTABLE_H,
  TURNTABLE_TOP,

  BODY_Y,
  PIVOT_X,
  PIVOT_Y,

  FRONT_FACE_Z,
  LENS_Z,

  // Status LED position inside body group (local coords, on front face)
  STATUS_LED_LOCAL: [0.0, 0.9, FRONT_FACE_Z - 0.30] as [number, number, number],
} as const;

// ============================================================
// Geometry sizes (all from DIMENSIONS)
// ============================================================
export const GEOMETRY = {
  // Body
  BODY_SPHERE_RADIUS: DIMENSIONS.body.maxRadius,         // 2.75
  BODY_SCALE:         [1, 1, 1] as [number, number, number], // deform done in vertex shader

  // Base
  BASE_RADIUS_TOP:    DIMENSIONS.base.topRadius,          // 2.3
  BASE_RADIUS_BOTTOM: DIMENSIONS.base.maxRadius,          // 2.75
  BASE_FOOT_RADIUS:   DIMENSIONS.base.footRadius,         // 0.65
  TURNTABLE_RADIUS:   DIMENSIONS.turntable.radius,        // 2.3

  // Arm
  GIMBAL_TUBE_RADIUS: DIMENSIONS.gimbalArm.tubeRadius,   // 0.55

  // Pivot disc
  PIVOT_RADIUS:       DIMENSIONS.neckJoint.minRadius,    // 0.85

  // Front glass
  FRONT_FACE_RADIUS:  DIMENSIONS.frontGlass.radius,      // 2.1

  // Lens
  LENS_CHROME_OUTER:  DIMENSIONS.lens.outerRingRadius,         // 1.3
  LENS_CHROME_INNER:  DIMENSIONS.lens.opticalHousingRadius,    // 0.95
  LENS_GLASS_R:       DIMENSIONS.lens.glassRadius,             // 0.6
  LENS_PUPIL_R:       0.18,

  // StatusLed
  STATUS_LED_RADIUS:  DIMENSIONS.statusLed.radius,       // 0.6
} as const;

// Shorthand (keep backward compat)
export const BODY_SPHERE_RADIUS = GEOMETRY.BODY_SPHERE_RADIUS;

// ============================================================
// Scene — camera placed at correct distance for 10.5cm model
// ============================================================
export const SCENE = {
  FOV: 36,
  NEAR: 0.1,
  FAR: 200,
  CAMERA_POSITION: [0, 1.5, 16] as [number, number, number],
  ZOOM_RANGE: [9, 24] as [number, number],
} as const;

export const LIGHTING = {
  KEY_POSITION:      [8, 16, 10] as [number, number, number],
  KEY_INTENSITY:     2.0,
  FILL_POSITION:     [-10, 4, 8] as [number, number, number],
  FILL_INTENSITY:    0.45,
  RIM_POSITION:      [4, 8, -16] as [number, number, number],
  RIM_INTENSITY:     1.2,
  AMBIENT_INTENSITY: 0.55,
};

export const CAMERA_COLORS: Record<string, string> = {
  sage:     '#A5C9B8',
  white:    '#F4F5F7',
  sand:     '#D9C8B1',
  charcoal: '#4A4D54',
  orange:   '#E87D43',
  blue:     '#364559',
  mint:     '#A5C9B8',
  black:    '#1A1A1A',
  silver:   '#E2E4E5',
};

export const CONTROLS = {
  DAMPING: true,
  DAMPING_FACTOR: 0.06,
  POLAR_ANGLE_MIN: Math.PI / 2 - Math.PI / 4,
  POLAR_ANGLE_MAX: Math.PI / 2 + Math.PI / 4,
  AUTO_ROTATE_SPEED: 1.2,
} as const;
