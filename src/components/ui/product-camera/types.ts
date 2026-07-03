export type CameraColor = 'white' | 'orange' | 'mint' | 'black' | 'sand' | 'sage' | 'charcoal' | 'blue' | 'silver';

export interface ProductCamera3DProps {
  /** Body color of the camera */
  color?: CameraColor;
  /** Auto-rotate the turntable */
  autoRotate?: boolean;
  /** Camera body follows mouse cursor */
  followMouse?: boolean;
  /** Enable full drag/zoom interaction */
  interactive?: boolean;
  /** Enable zoom via mouse wheel */
  enableZoom?: boolean;
  /** Enable rotation via drag */
  enableRotate?: boolean;
  /** Rotation speed multiplier */
  rotationSpeed?: number;
  /** Zoom speed multiplier */
  zoomSpeed?: number;
  /** Damping factor (0 = no damping, 1 = maximum) */
  damping?: number;
  /** Pitch angle limit in degrees [min, max] */
  pitchLimit?: [number, number];
  /** URL for the logo decal (PNG or SVG) */
  logoUrl?: string;
  /** Additional class name for the canvas wrapper */
  className?: string;
}
