import { TriState } from '@/enums'
import { Accessor, JSX, ParentComponent, Setter, Show, createMemo, mergeProps } from 'solid-js'
import IncludeIcon from '~icons/material-symbols/check-box-rounded'
import IgnoreIcon from '~icons/material-symbols/check-box-outline-blank'
import ExcludeIcon from '~icons/material-symbols/disabled-by-default-rounded'
import { Dynamic } from 'solid-js/web'

interface Classes {
  /** Classes for label text wrapper */
  label: string
  base: string
}

interface TriStateProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string
  state: Accessor<TriState> | TriState
  updateState: (v: TriState) => void | Setter<TriState>
  classes?: Partial<Classes>
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

  const state = createMemo(() => (typeof props.state === 'function' ? props.state() : props.state))

  const handleChange = () => {
    if (props.onChange) props.onChange

    switch (state()) {
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
    [
      props.isDisabled ? 'opacity-50' : 'opacity-100',
      'transition-all',
      ...(props.classes?.base ? [props.classes.base] : []),
    ].join(' ')
  )

  const labelClasses = createMemo(() => ['flex', 'gap-1', 'cursor-pointer'].join(' '))

  return (
    <div class={baseClasses()} onKeyDown={onKeyDown}>
      <label class={labelClasses()}>
        <Show when={values.hideCheckbox}>
          <Dynamic component={checkboxStates[state()]} />
        </Show>
        <input
          type="checkbox"
          value={state()}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          class="hidden"
        />
        <div class={`flex flex-1 select-none ${props.classes?.label}`}>{label()}</div>
      </label>
    </div>
  )
}

export default TriStateInput
