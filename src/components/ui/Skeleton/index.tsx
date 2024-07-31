import { type JSX, ParentComponent, createMemo, splitProps } from 'solid-js'

interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  rounded?: 'none' | 'lg' | 'sm' | 'md' | 'xl' | '2xl' | 'full'
}

const Skeleton: ParentComponent<SkeletonProps> = props => {
  const [values, rest] = splitProps(props, ['class', 'rounded'])
  const skeletonClasses = createMemo(() =>
    [
      `rounded-${values.rounded ?? 'none'}`,
      'animate-pulse',
      'placeholder',
      ...(values.class ? [values.class] : []),
    ].join(' ')
  )

  return (
    <div class={skeletonClasses()} {...rest}>
      {props.children}
    </div>
  )
}

export default Skeleton
