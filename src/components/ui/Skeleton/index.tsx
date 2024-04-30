import { JSX, ParentComponent, createMemo } from 'solid-js'

interface SkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {
  rounded?: 'none' | 'lg' | 'sm' | 'md' | 'xl' | '2xl' | 'full'
}

const Skeleton: ParentComponent<SkeletonProps> = props => {
  const skeletonClasses = createMemo(() =>
    [
      `rounded-${props.rounded ?? 'none'}`,
      'animate-pulse',
      'placeholder',
      ...(props.class ? [props.class] : []),
    ].join(' ')
  )

  return <div class={skeletonClasses()}>{props.children}</div>
}

export default Skeleton
