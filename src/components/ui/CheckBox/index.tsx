import { Accessor, Component, JSX, Setter, Show, createMemo, mergeProps } from 'solid-js'
import CheckedIcon from '~icons/material-symbols/check-box-rounded'
import BlankIcon from '~icons/material-symbols/check-box-outline-blank'
import { Dynamic } from 'solid-js/web'

interface Classes {
  /** Classes for label text wrapper */
  label: string
  base: string
}

interface CheckBoxProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  checked: Accessor<boolean> | boolean
  value?: string | number | string[] | undefined
  updateState: (v: boolean) => void | Setter<boolean>
  classes?: Partial<Classes>
  isDisabled?: boolean
  hideCheckbox?: boolean
}

const checkboxStates: Record<string, typeof CheckedIcon> = {
  true: CheckedIcon,
  false: BlankIcon,
}

const CheckBox: Component<CheckBoxProps> = props => {
  const values = mergeProps({ hideCheckbox: false }, props)

  const checked = createMemo(() =>
    typeof props.checked === 'function' ? props.checked() : props.checked
  )

  const checkedString = createMemo(() => String(checked()))

  const handleChange = () => {
    if (props.onChange) props.onChange

    props.updateState(checked() ? false : true)
  }

  const onKeyDown: JSX.EventHandler<HTMLInputElement | HTMLDivElement, KeyboardEvent> = e => {
    if (e && ['Enter', 'Space'].includes(e.code)) {
      e.preventDefault()
      handleChange()
    }
  }

  const label = createMemo(() => (props.label ? <span>{props.label}</span> : props.children))

  const baseClasses = createMemo(() =>
    [
      props.isDisabled ? 'opacity-50' : 'opacity-100',
      'transition-all',
      ...(props.classes?.base ? [props.classes.base] : []),
    ].join(' ')
  )

  const labelClasses = createMemo(() =>
    ['flex', 'items-center', 'icon-24', 'gap-1', 'cursor-pointer'].join(' ')
  )

  return (
    <div class={baseClasses()} onKeyDown={onKeyDown}>
      <label class={labelClasses()}>
        <Show when={!values.hideCheckbox}>
          <Dynamic component={checkboxStates[checkedString()]} />
        </Show>
        <input
          {...props}
          type="checkbox"
          checked={checked()}
          value={props.value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          class="hidden"
        />
        <div class={`flex flex-1 select-none ${props.classes?.label}`}>{label()}</div>
      </label>
    </div>
  )
}

export default CheckBox
