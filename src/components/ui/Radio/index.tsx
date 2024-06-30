import { Accessor, type JSX, ParentComponent, Setter, Show, createMemo, mergeProps } from 'solid-js'

interface Classes {
  base: string
  indicator: string
  label: string
}

interface RadioProps extends JSX.HTMLAttributes<HTMLInputElement> {
  value: string | number | string[] | undefined
  updateState?: (v: boolean) => void | Setter<boolean>
  checked: Accessor<boolean> | boolean
  hideIndicator?: boolean
  isDisabled?: boolean
  label?: string
  classes?: Partial<Classes>
  /** Necessary for grouping */
  name: string
}

const Radio: ParentComponent<RadioProps> = props => {
  const checked = createMemo(() =>
    typeof props.checked === 'function' ? props.checked() : props.checked
  )

  const baseClasses = createMemo(() =>
    [
      'transition-all',
      props.isDisabled ? 'opacity-50 hover:opacity-75' : 'hover:opacity-100 opacity-80',
      checked() ? '!opacity-100' : null,
      ...(props.classes?.base ? [props.classes.base] : []),
    ].join(' ')
  )

  const indicatorClasses = createMemo(() =>
    [
      'flex',
      'items-center',
      'justify-center',
      'w-[18px]',
      'h-[18px]',
      ...(props.classes?.indicator ? [props.classes.indicator] : []),
    ].join(' ')
  )

  const values = mergeProps({ hideIndicator: false, isDisabled: false }, props)

  const handleChange: JSX.EventHandler<HTMLInputElement, Event> = e => {
    e.preventDefault()
    if (props.onChange) props.onChange

    if (props.updateState) props.updateState(!checked())
  }

  const onKeyDown: JSX.EventHandler<HTMLInputElement | HTMLDivElement, KeyboardEvent> = e => {
    if (e && ['Enter', 'Space'].includes(e.code)) {
      e.preventDefault()
      handleChange(e as Event & { currentTarget: HTMLInputElement; target: Element })
    }
  }

  const label = createMemo(() => (props.children ? props.children : <span>{props.label}</span>))

  return (
    <div class={baseClasses()}>
      <label class="flex gap-1 cursor-pointer items-center">
        <span class={indicatorClasses()}>
          <Show when={!values.hideIndicator && checked()}>{'>'}</Show>
        </span>

        <input
          {...props}
          name={props.name}
          type="radio"
          class="hidden"
          checked={checked()}
          onChange={handleChange}
          value={props.value}
          disabled={values.isDisabled}
          onKeyDown={onKeyDown}
        />
        <div class={`flex flex-1 select-none ${props.classes?.label}`}>{label()}</div>
      </label>
    </div>
  )
}

export default Radio
