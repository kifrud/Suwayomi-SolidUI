import { type JSX, JSXElement, Show, createMemo, mergeProps } from 'solid-js'
import { MaybeAccessor } from '@solid-primitives/utils'
import ArrowRight from '~icons/material-symbols/arrow-right-alt-rounded'
import ClearIcon from '~icons/material-symbols/cancel'
import './styles.scss'

type Schemes = 'underline' | 'default'

interface InputProps<T extends string> extends JSX.HTMLAttributes<HTMLInputElement> {
  icon?: JSXElement
  clearIcon?: { state: boolean; always?: boolean }
  onClear?: JSX.EventHandler<HTMLSpanElement, MouseEvent>
  type?: 'text' | 'search'
  value: MaybeAccessor<T>
  isDisabled?: boolean
  required?: boolean
  showSubmit?: boolean
  onSubmit?: () => void
  wrapperClass?: string
  placeholder?: string
  scheme?: Schemes
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
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
      clearIcon: { state: false, always: false },
      scheme: 'default',
      radius: 'lg',
    },
    props
  )

  const inputClasses = createMemo(() =>
    [
      'input',
      `input--${values.scheme}`,
      values.scheme ? `rounded-${values.radius}` : null,
      values.icon ? 'pl-8' : null,
      values.clearIcon.state ? 'pr-16' : null,
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
      <Show when={values.clearIcon?.state}>
        <Show
          when={!values.clearIcon?.always && value()}
          fallback={
            <Show when={values.clearIcon.always}>
              <span
                class="input__clear"
                onClick={e => {
                  e.preventDefault()

                  if (values.onClear) values.onClear(e)
                }}
              >
                <ClearIcon />
              </span>
            </Show>
          }
        >
          <span
            class="input__clear"
            onClick={e => {
              e.preventDefault()

              if (values.onClear) values.onClear(e)
            }}
          >
            <ClearIcon />
          </span>
        </Show>
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
