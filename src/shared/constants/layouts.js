// https://github.com/angular/flex-layout/wiki/Responsive-API

import { VIEW_TYPE } from '@/shared/constants/viewType';

export const LAYOUTS = {
  DESKTOP: {
    key: 'DESKTOP',
    cols: 12,
    width: Infinity,
  },
  TABLET: {
    key: 'TABLET',
    cols: 8,
    width: 840,
    orientation: VIEW_TYPE.PORTRAIT,
    landscapeFallback: 'DESKTOP',
  },
  MOBILE: {
    key: 'MOBILE',
    cols: 4,
    landscapeCols: 8,
    width: 600,
    orientation: VIEW_TYPE.PORTRAIT,
    landscapeFallback: 'TABLET',
  },
};
