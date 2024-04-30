import { TriState } from '@/enums'
import { Accessor, JSX, ParentComponent, Setter, Show, createMemo, mergeProps } from 'solid-js'
import IncludeIcon from '~icons/material-symbols/check-box-rounded'
import IgnoreIcon from '~icons/material-symbols/check-box-outline-blank'
import ExcludeIcon from '~icons/material-symbols/indeterminate-check-box-rounded'
import { Dynamic } from 'solid-js/web'

interface TriStateProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  state: Accessor<TriState>
  updateState: Setter<TriState>
  /** Classes for label text wrapper */
  labelClass?: string
  isDisabled?: boolean
  hideCheckbox?: boolean
}

const checkboxStates = {
  '0': IgnoreIcon,
  '1': IncludeIcon,
  '2': ExcludeIcon,
}

const TriStateInput: ParentComponent<TriStateProps> = props => {
  const values = mergeProps({ hideCheckbox: false }, props)

  const handleChange = () => {
    if (props.onChange) props.onChange

    switch (props.state()) {
      case TriState.IGNORE:
        props.updateState(TriState.INCLUDE)
        break
      case TriState.INCLUDE:
        props.updateState(TriState.EXCLUDE)
        break
      case TriState.EXCLUDE:
        props.updateState(TriState.IGNORE)
        break
    }
  }

  const onKeyDown: JSX.EventHandler<HTMLInputElement | HTMLDivElement, KeyboardEvent> = e => {
    if (['Enter', 'Space'].includes(e.code)) {
      e.preventDefault()
      handleChange()
    }
  }

  const label = createMemo(() => (props.label ? <span>{props.label}</span> : props.children))

  const baseClasses = createMemo(() =>
    [props.isDisabled ? 'opacity-50' : 'opacity-100', 'transition-all'].join(' ')
  )

  const labelClasses = createMemo(() => ['flex', 'gap-1', 'cursor-pointer'].join(' '))

  return (
    <div class={baseClasses()} onKeyDown={onKeyDown}>
      <label class={labelClasses()}>
        <Show when={values.hideCheckbox}>
          <Dynamic component={checkboxStates[props.state()]} />
        </Show>
        <input
          type="checkbox"
          value={props.state()}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          class="hidden"
        />
        <div class={`flex flex-1 select-none ${props.labelClass}`}>{label()}</div>
      </label>
    </div>
  )
}

export default TriStateInput
