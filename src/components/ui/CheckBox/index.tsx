import {
  Accessor,
  ParentComponent,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Checkbox as CheckBoxUi } from '@kobalte/core/checkbox'
import CheckedIcon from '~icons/material-symbols/check-box-rounded'
import BlankIcon from '~icons/material-symbols/check-box-outline-blank'
import IndeterminateIcon from '~icons/material-symbols/indeterminate-check-box'
import { MaybeAccessor } from '@solid-primitives/utils'

interface Classes {
  /** Classes for label text wrapper */
  label: string
  base: string
}

interface CheckBoxProps {
  label?: string
  checked?: MaybeAccessor<boolean>
  defaultChecked?: MaybeAccessor<boolean>
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
// TODO: remake props
const CheckBox: ParentComponent<CheckBoxProps> = props => {
  const values = mergeProps({ hideCheckbox: false, isDisabled: false, indeterminate: false }, props)

  const defaultChecked = createMemo(() =>
    typeof props.defaultChecked === 'function' ? props.defaultChecked() : props.defaultChecked
  )

  const label = createMemo(() => (props.label ? <span>{props.label}</span> : props.children))

  const [initialChecked, setInitialChecked] = createSignal<string | boolean | undefined>(
    defaultChecked()
  )

  createEffect(() => setInitialChecked(defaultChecked()))

  const checked = createMemo(() =>
    typeof props.checked === 'function' ? props.checked() : props.checked
  )
  const checkedString = createMemo(() => String(checked() ?? initialChecked()))

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
    setInitialChecked(checked)
  }

  return (
    <CheckBoxUi
      defaultChecked={defaultChecked()}
      indeterminate={values.indeterminate}
      class={baseClasses()}
      checked={checked() ?? (initialChecked() as boolean)}
      onChange={handleChange}
      value={props.value}
      disabled={values.isDisabled}
    >
      <CheckBoxUi.Input />
      <CheckBoxUi.Control class="pr-1">
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
