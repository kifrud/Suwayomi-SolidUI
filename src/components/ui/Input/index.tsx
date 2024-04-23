import { Accessor, JSX, JSXElement, Show, createMemo, mergeProps } from 'solid-js'
import './styles.scss'

interface InputProps<T extends string> extends JSX.HTMLAttributes<HTMLInputElement> {
  icon?: JSXElement
  type?: 'text' | 'search'
  value: Accessor<T> | T
  required?: boolean
  showSubmit?: boolean
  onSubmit?: () => void
}

const Input = <T extends string>(props: InputProps<T>) => {
  const inputClasses = createMemo(() => ['input', ...(props.class ? [props.class] : [])].join(' '))
  const values = mergeProps(
    { required: false, type: 'text', class: inputClasses(), showSubmit: true },
    props
  )

  const value = createMemo(() =>
    typeof values.value === 'function' ? values.value() : values.value
  )

  return (
    <div class="input__wrapper">
      <Show when={values.icon}>
        <span class="input__icon">{values.icon}</span>
      </Show>
      <input
        {...values}
        ref={values.ref}
        class={values.class}
        type={values.type}
        value={value()}
        onChange={values.onChange}
        required={values.required}
      />
      <Show when={value() && values.showSubmit}>
        <span class="input__submit" onClick={values.onSubmit}></span>
      </Show>
    </div>
  )
}

export default Input
