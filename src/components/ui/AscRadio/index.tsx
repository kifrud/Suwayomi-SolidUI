import { Accessor, Component, JSX, Setter, createMemo } from 'solid-js'
import './styles.scss'
import Radio from '../Radio'

interface AscRadioProps extends JSX.HTMLAttributes<HTMLInputElement> {
  ascending: Accessor<boolean> | boolean
  updateAscending: (v: boolean) => void | Setter<boolean>
  value: string
  updateValue: (v: string) => void | Setter<string>
  checked: boolean | Accessor<boolean>
  // updateState?: (v: boolean) => void | Setter<boolean>
  name: string
  label?: string
}

const AscRadio: Component<AscRadioProps> = props => {
  const baseClasses = createMemo(() => ['w-full', ...(props.class ? [props.class] : [])].join(' '))

  const indicatorClasses = createMemo(() =>
    ['transition-all', props.ascending ? 'rotate-[270deg]' : 'rotate-90'].join(' ')
  )

  const handleClick: JSX.EventHandler<HTMLInputElement, MouseEvent> = e => {
    e.preventDefault()

    // if (!props.checked && props.updateState) props.updateState(!props.checked)
    if (props.checked) props.updateAscending(!props.ascending)

    props.updateValue(e.currentTarget.value)
  }

  return (
    <Radio
      label={props.label}
      classes={{
        base: baseClasses(),
        indicator: indicatorClasses(),
      }}
      onClick={handleClick}
      onChange={e => props.updateValue(e.currentTarget.value)}
      value={props.value}
      name={props.name}
      // updateState={props.updateState} // FIXME: works weird
      checked={props.checked}
    />
  )
}

export default AscRadio
