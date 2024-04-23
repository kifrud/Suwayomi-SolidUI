import { createBreakpoints } from '@solid-primitives/media'

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '2000px',
}

export const matches = createBreakpoints(breakpoints)
