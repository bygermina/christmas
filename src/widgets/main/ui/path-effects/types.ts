export interface TreePath {
  path: string;
  start: { x: number; y: number };
  delay: number;
  duration: number;
  size?: number;
}

export interface MainPath extends TreePath {
  fullPath: string;
}

export interface PathEffectProps {
  path: string;
  delay: number;
  speed: number;
  enableRotation: boolean;
  size?: number;
}
