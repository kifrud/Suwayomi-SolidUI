import { JSX, ParentComponent, createMemo, splitProps } from 'solid-js'
import { Dialog, DialogRootProps } from '@kobalte/core/dialog'
import CloseIcon from '~icons/material-symbols/close-rounded'
import './styles.scss'

interface Classes {
  // trigger: string
  content: string
  description: string
}

interface ModalProps extends DialogRootProps {
  // label: JSX.Element
  description?: JSX.Element
  title?: JSX.Element
  classes?: Partial<Classes>
}

const Modal: ParentComponent<ModalProps> = props => {
  const description = createMemo(() => props.description ?? props.children)
  const [
    // trigger,
    content,
    desc,
    rest,
  ] = splitProps(
    props,
    // ['classes', 'label'],
    ['title', 'description', 'classes'],
    ['classes']
  )

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange} {...rest}>
      {/* <Dialog.Trigger class={trigger.classes?.trigger}>{trigger.label}</Dialog.Trigger> */}
      <Dialog.Portal>
        <Dialog.Overlay class="modal__overlay" />
        <div class="modal__position">
          <Dialog.Content class={`modal__content ${content.classes?.content}`}>
            <div class="modal__header">
              <Dialog.Title>{content.title}</Dialog.Title>
              <Dialog.CloseButton class="modal__close-button">
                <CloseIcon />
              </Dialog.CloseButton>
            </div>
            <Dialog.Description class={desc.classes?.description}>
              {description()}
            </Dialog.Description>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  )
}

export default Modal
