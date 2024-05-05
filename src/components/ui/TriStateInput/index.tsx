import { TriState } from '@/enums'
import {
  Accessor,
  JSX,
  ParentComponent,
  Setter,
  Show,
  // createEffect,
  createMemo,
  mergeProps,
} from 'solid-js'
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
  const values = mergeProps({ hideCheckbox: false, isDisabled: false }, props)

  const state = createMemo(() => (typeof props.state === 'function' ? props.state() : props.state))

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    e.preventDefault()
    if (props.onChange) props.onChange

    switch (state()) {
      case TriState.IGNORE:
        return props.updateState(TriState.INCLUDE)
      case TriState.INCLUDE:
        return props.updateState(TriState.EXCLUDE)
      case TriState.EXCLUDE:
        return props.updateState(TriState.IGNORE)
    }
  }

  const onKeyDown: JSX.EventHandler<HTMLInputElement | HTMLDivElement, KeyboardEvent> = e => {
    if (e && ['Enter', 'Space'].includes(e.code)) {
      e.preventDefault()
      handleChange(e as Event & { currentTarget: HTMLInputElement; target: Element })
    }
  }

  const label = createMemo(() => (props.label ? <span>{props.label}</span> : props.children))

  const baseClasses = createMemo(() =>
    [
      values.isDisabled ? 'opacity-50' : 'opacity-100',
      'transition-all',
      ...(props.classes?.base ? [props.classes.base] : []),
    ].join(' ')
  )

  const labelClasses = createMemo(() =>
    ['flex', 'gap-1', 'items-center', 'cursor-pointer'].join(' ')
  )

  // createEffect(() => console.log(props.label, state()))

  return (
    <div class={baseClasses()} onKeyDown={onKeyDown}>
      <label class={labelClasses()}>
        <Show when={!values.hideCheckbox}>
          <Dynamic component={checkboxStates[state()]} />
        </Show>
        <input
          {...props}
          type="checkbox"
          value={state()}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          disabled={values.isDisabled}
          class="hidden"
        />
        <div class={`flex flex-1 select-none ${props.classes?.label}`}>{label()}</div>
      </label>
    </div>
  )
}

export default TriStateInput
