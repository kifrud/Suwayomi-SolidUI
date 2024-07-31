import type { Component, ComponentProps } from 'solid-js'
import { createMemo, mergeProps, splitProps } from 'solid-js'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<Size, { radius: number; strokeWidth: number }> = {
  xs: { radius: 15, strokeWidth: 3 },
  sm: { radius: 19, strokeWidth: 4 },
  md: { radius: 32, strokeWidth: 6 },
  lg: { radius: 52, strokeWidth: 8 },
  xl: { radius: 80, strokeWidth: 10 },
}

type ProgressCircleProps = ComponentProps<'div'> & {
  value?: number
  size?: Size
  radius?: number
  strokeWidth?: number
  showAnimation?: boolean
}

const RadialProgress: Component<ProgressCircleProps> = rawProps => {
  const props = mergeProps({ size: 'md' as Size, showAnimation: true }, rawProps)
  const [local, others] = splitProps(props, [
    'class',
    'children',
    'value',
    'size',
    'radius',
    'strokeWidth',
    'showAnimation',
  ])

  const value = () => getLimitedValue(local.value)
  const radius = () => local.radius ?? sizes[local.size].radius
  const strokeWidth = () => local.strokeWidth ?? sizes[local.size].strokeWidth
  const normalizedRadius = () => radius() - strokeWidth() / 2
  const circumference = () => normalizedRadius() * 2 * Math.PI
  const strokeDashoffset = () => (value() / 100) * circumference()
  const offset = () => circumference() - strokeDashoffset()

  const wrapperClass = createMemo(() =>
    ['flex flex-col items-center justify-center', local.class].join(' ')
  )

  const primaryCircleClass = createMemo(() =>
    [
      'stroke-current transition-colors ease-linear',
      local.showAnimation ? 'transition-all duration-300 ease-in-out' : '',
    ].join(' ')
  )

  const secondaryCircleClass = 'stroke-secondary transition-colors ease-linear'

  const absoluteFlexClass = 'absolute flex'

  return (
    <div class={wrapperClass()} {...others}>
      <svg
        width={radius() * 2}
        height={radius() * 2}
        viewBox={`0 0 ${radius() * 2} ${radius() * 2}`}
        class="-rotate-90"
      >
        <circle
          r={normalizedRadius()}
          cx={radius()}
          cy={radius()}
          stroke-width={strokeWidth()}
          fill="transparent"
          stroke=""
          stroke-linecap="round"
          class={secondaryCircleClass}
        />
        {value() >= 0 ? (
          <circle
            r={normalizedRadius()}
            cx={radius()}
            cy={radius()}
            stroke-width={strokeWidth()}
            stroke-dasharray={circumference() + ' ' + circumference()}
            stroke-dashoffset={offset()}
            fill="transparent"
            stroke=""
            stroke-linecap="round"
            class={primaryCircleClass()}
          />
        ) : null}
      </svg>
      <div class={absoluteFlexClass}>{local.children}</div>
    </div>
  )
}

function getLimitedValue(input: number | undefined) {
  if (input === undefined) {
    return 0
  } else if (input > 100) {
    return 100
  }
  return input
}

export default RadialProgress
