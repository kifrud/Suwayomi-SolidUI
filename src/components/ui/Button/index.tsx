import { type JSX, ParentComponent, splitProps, createMemo } from 'solid-js'
import './styles.scss'

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  scheme?: 'fill' | 'default'
  disabled?: boolean
}

const Button: ParentComponent<ButtonProps> = props => {
  const [unique, rest] = splitProps(props, ['scheme', 'class', 'ref'])

  const scheme = createMemo(() => (unique.scheme ? unique.scheme : 'default'))

  const btnClasses = createMemo(() =>
    [
      'btn',
      'icon-24',
      `btn--${scheme()}`,
      ...(rest.disabled ? ['btn--disabled'] : []),
      ...(unique.class ? [unique.class] : []),
    ].join(' ')
  )

  return (
    <button class={btnClasses()} ref={unique.ref} {...rest}>
      {props.children}
    </button>
  )
}

export default Button
