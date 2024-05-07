import { Accessor, JSX, JSXElement, Show, createMemo, mergeProps } from 'solid-js'
import ArrowRight from '~icons/material-symbols/arrow-right-alt-rounded'
import ClearIcon from '~icons/material-symbols/cancel'
import './styles.scss'

interface InputProps<T extends string> extends JSX.HTMLAttributes<HTMLInputElement> {
  icon?: JSXElement
  clearIcon?: boolean
  onClear?: () => void
  type?: 'text' | 'search'
  value: Accessor<T> | T
  isDisabled?: boolean
  required?: boolean
  showSubmit?: boolean
  onSubmit?: () => void
  wrapperClass?: string
  placeholder?: string
}

const Input = <T extends string>(props: InputProps<T>) => {
  const wrapperClasses = createMemo(() =>
    ['input__wrapper', ...(props.wrapperClass ? [props.wrapperClass] : [])].join(' ')
  )

  const values = mergeProps(
    {
      required: false,
      type: 'text',
      class: '',
      showSubmit: true,
      placeholder: '',
      isDisabled: false,
    },
    props
  )

  const inputClasses = createMemo(() =>
    [
      'input',
      'rounded-lg',
      values.icon ? 'pl-8' : null,
      values.clearIcon ? 'pr-8' : null,
      ...(values.class ? [values.class] : []),
    ].join(' ')
  )

  const value = createMemo(() =>
    typeof values.value === 'function' ? values.value() : values.value
  )

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = e => {
    if (e && e.code === 'Enter') {
      e.preventDefault()

      if (values.onSubmit) {
        values.onSubmit()
      }
    }
  }

  return (
    <div class={wrapperClasses()}>
      <Show when={values.icon}>
        <span class="input__icon">{values.icon}</span>
      </Show>
      <input
        {...values}
        placeholder={values.placeholder}
        ref={values.ref ?? undefined}
        class={inputClasses()}
        type={values.type}
        value={value()}
        onChange={values.onChange}
        required={values.required}
        onKeyDown={onKeyDown}
        disabled={values.isDisabled}
      />
      <Show when={values.clearIcon}>
        <span class="input__icon" onClick={values.onClear}>
          <ClearIcon />
        </span>
      </Show>
      <Show when={value() && values.showSubmit}>
        <span class="input__submit" onClick={values.onSubmit}>
          <ArrowRight />
        </span>
      </Show>
    </div>
  )
}

export default Input
