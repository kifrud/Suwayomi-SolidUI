import { JSX } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface CustomEvents extends HTMLElementEventMap {}
    interface CustomCaptureEvents extends HTMLElementEventMap {}
  }
}
