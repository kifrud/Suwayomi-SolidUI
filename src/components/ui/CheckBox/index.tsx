import { Accessor, ParentComponent, Show, createMemo, createSignal, mergeProps } from 'solid-js'
import { Checkbox as CheckBoxUi } from '@kobalte/core/checkbox'
import CheckedIcon from '~icons/material-symbols/check-box-rounded'
import BlankIcon from '~icons/material-symbols/check-box-outline-blank'
import IndeterminateIcon from '~icons/material-symbols/indeterminate-check-box'
import { Dynamic } from 'solid-js/web'

interface Classes {
  /** Classes for label text wrapper */
  label: string
  base: string
}

interface CheckBoxProps {
  label?: string
  checked?: Accessor<boolean> | boolean
  value?: string
  classes?: Partial<Classes>
  isDisabled?: boolean
  hideCheckbox?: boolean
  onChange?: (checked: boolean) => void
  indeterminate?: boolean
}

const checkboxStates: Record<string, typeof CheckedIcon> = {
  true: CheckedIcon,
  false: BlankIcon,
  indeterminate: IndeterminateIcon,
}

const CheckBox: ParentComponent<CheckBoxProps> = props => {
  const values = mergeProps({ hideCheckbox: false, isDisabled: false, indeterminate: false }, props)

  const [defaultChecked, setDefaultChecked] = createSignal<string | boolean>(false)

  const checked = createMemo(
    () =>
      (typeof props.checked === 'function' ? props.checked() : props.checked) ?? defaultChecked()
  )

  const checkedString = createMemo(() => String(checked()))

  const label = createMemo(() => (props.label ? <span>{props.label}</span> : props.children))

  const baseClasses = createMemo(() =>
    [
      props.isDisabled ? 'opacity-50' : 'opacity-100',
      'transition-all',
      'flex',
      'items-center',
      'cursor-pointer',
      'icon-24',
      ...(props.classes?.base ? [props.classes.base] : []),
    ].join(' ')
  )

  const labelClasses = createMemo(() =>
    [
      'flex',
      'items-center',
      'gap-1',
      'cursor-pointer',
      ...(props.classes?.label ? [props.classes.label] : []),
    ].join(' ')
  )

  const handleChange = (checked: boolean) => {
    if (props.onChange) props.onChange(checked)

    if (props.checked) return
    setDefaultChecked(checked)
  }

  return (
    <CheckBoxUi
      indeterminate={values.indeterminate}
      class={baseClasses()}
      checked={checked() as boolean}
      onChange={handleChange}
      value={props.value}
      disabled={values.isDisabled}
    >
      <CheckBoxUi.Input />
      <CheckBoxUi.Control class='pr-1'>
        <Show when={!values.hideCheckbox}>
          <Dynamic
            component={checkboxStates[values.indeterminate ? 'indeterminate' : checkedString()]}
          />
        </Show>
      </CheckBoxUi.Control>
      <CheckBoxUi.Label class={labelClasses()}>{label()}</CheckBoxUi.Label>
    </CheckBoxUi>
  )
}

export default CheckBox
