import { JSX, ParentComponent, createMemo, mergeProps } from 'solid-js'
import './styles.scss'

interface ChipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  radius?: 'sm' | 'md' | 'lg' | 'none'
  type?: 'outline' | 'fill'
}

const Chip: ParentComponent<ChipProps> = props => {
  const values = mergeProps({ type: 'fill' }, props)
  const chipClasses = createMemo(() =>
    [
      'chip',
      `chip--${values.type}`,
      props.radius && `rounded-${props.radius}`,
      ...(values.class ? [values.class] : []),
    ].join(' ')
  )
  return (
    <span class={chipClasses()} {...props}>
      {props.children}
    </span>
  )
}

export default Chip
