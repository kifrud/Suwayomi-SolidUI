import { createBreakpoints } from '@solid-primitives/media'

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}

export const matches = createBreakpoints(breakpoints)
