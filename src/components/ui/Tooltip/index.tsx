import { JSX, ParentComponent, Show, createMemo, splitProps } from 'solid-js'
import { TooltipRootProps, Tooltip as TooltipUi } from '@kobalte/core/tooltip'
import './styles.scss'

interface Classes {
  trigger: string
  content: string
}

interface TooltipProps extends TooltipRootProps {
  showArrow: boolean
  label: JSX.Element
  disabled: boolean
  onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
  classes: Partial<Classes>
  content: JSX.Element
}

const Tooltip: ParentComponent<Partial<TooltipProps>> = props => {
  const [trigger, content, rest] = splitProps(
    props,
    ['onClick', 'classes', 'disabled', 'label'],
    ['showArrow', 'classes']
  )

  const tooltipContent = createMemo(() => (props.children ? props.children : rest.content))

  return (
    <TooltipUi {...rest}>
      <TooltipUi.Trigger
        onClick={trigger.onClick}
        class={trigger.classes?.trigger ?? 'tooltip__trigger'}
        disabled={trigger.disabled}
      >
        {trigger.label}
      </TooltipUi.Trigger>
      <TooltipUi.Portal>
        <TooltipUi.Content class={content.classes?.content ?? 'tooltip__content'}>
          <Show when={content.showArrow}>
            <TooltipUi.Arrow />
          </Show>
          {tooltipContent()}
        </TooltipUi.Content>
      </TooltipUi.Portal>
    </TooltipUi>
  )
}

export default Tooltip
