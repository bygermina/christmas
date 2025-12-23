export interface TreePath {
  path: string;
  start: { x: number; y: number };
  delay: number;
}

const START_TOP = { x: 604, y: 305 } as const;
const START_RIGHT = { x: 502, y: 305 } as const;
const START_CENTER = { x: 536, y: 305 } as const;
const START_LEFT = { x: 570, y: 305 } as const;

export const pathTree: TreePath = {
  path: 'M557,858 L557,800 L530,773 L530,730 L570,691 L570,672 L617,624 L620,617 L630,611 L645,598 L664,597  ',
  start: START_TOP,
  delay: 2,
};

export const portraitPathTree: TreePath = {
  path: 'M350,850 L350,791 L332,771 L332,540 L355,520 L355,490 L332,470 L332,400  L342,385 L330,370 L330,280',
  start: START_LEFT,
  delay: pathTree.delay,
};

export const paths: TreePath[] = [
  {
    path: 'M557,858 L557,800 L530,773 L532,733 L558,733 L572,747 L595,747 L627,713 L720,713  ',
    start: START_TOP,
    delay: 0.37,
  },
  {
    path: 'M557,858 L557,800 L530,773 L532,733 L558,733',
    start: START_TOP,
    delay: 0.77,
  },
  {
    path: 'M557,858 L557,800 L530,773 L530,730 L570,691 L570,672 L617,624 L620,617 L630,611 L645,598 L664,597  ',
    start: START_TOP,
    delay: 0.17,
  },
  {
    path: 'M557,858 L557,800 L530,773 L530,730 L570,691',
    start: START_TOP,
    delay: 0.57,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,707 L357,682 L357,659  L370,653 L368,638 L410,590 L410,588 L420,580 L413,560  L410,526',
    start: START_LEFT,
    delay: 1.13,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,707 L357,682 L357,659',
    start: START_LEFT,
    delay: 2.13,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,540 L355,520 L355,437 L377,412 L377,405',
    start: START_LEFT,
    delay: 0.93,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,540 L355,520',
    start: START_LEFT,
    delay: 1.93,
  },
  {
    ...portraitPathTree,
    delay: 0.73,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,540 L355,520 L355,490',
    start: START_LEFT,
    delay: 1.73,
  },
  {
    path: 'M350,850 L350,791  L332,771 L332,555 L294,519 L294,503 L259,468 L259,430',
    start: START_LEFT,
    delay: 0.53,
  },
  {
    path: 'M350,850 L350,791 L332,771 L332,555 L294,519',
    start: START_LEFT,
    delay: 1.53,
  },
  {
    path: 'M350,850 L350,791 L332,771 L330,670 L306,645 L306,637 L266,596 L266,563 L257,546 L228,517',
    start: START_LEFT,
    delay: 0.33,
  },
  {
    path: 'M350,850 L350,791 L332,771 L330,670 L306,645',
    start: START_LEFT,
    delay: 1.33,
  },
  {
    path: 'M493,831 L493,775 L478,759 L485,745 L485,703 L420,638 L420,614 L395,587 L363,587 L355,577',
    start: START_CENTER,
    delay: 0.5,
  },
  {
    path: 'M493,831 L493,775 L478,759 L485,745 L485,703 L420,638',
    start: START_CENTER,
    delay: 1.17,
  },
  {
    path: 'M467,843 L467,785 L492,760 L492,734 L474,718 L441,717 L430,727 L404,726 L357,678 L341,678',
    start: START_RIGHT,
    delay: 0.33,
  },
  {
    path: 'M467,843 L467,785 L492,760 L492,734 L474,718 L441,717',
    start: START_RIGHT,
    delay: 1.3,
  },
];
