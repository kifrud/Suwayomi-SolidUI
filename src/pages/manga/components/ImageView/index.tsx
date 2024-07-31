import { Component } from 'solid-js'
import { Dialog } from '@kobalte/core/dialog'
import { Image } from '@/components'
import CloseIcon from '~icons/material-symbols/close-rounded'
import SaveIcon from '~icons/material-symbols/save'
import './styles.scss'

interface ImageViewProps {
  src: string | undefined | null
}

const ImageView: Component<ImageViewProps> = props => {
  return (
    <Dialog>
      <Dialog.Trigger class="max-w-[216px]">
        <Image
          src={props.src}
          alt="Cover"
          wrapperClasses="w-full relative h-full"
          class="flex object-cover w-full h-auto aspect-cover"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <div class="imageview__position">
          <Dialog.Overlay class="imageview__overlay" />
          <Dialog.Content class="imageview__content">
            <div class="imageview__header icon-32">
              <Dialog.Title>
                <a href={props.src as string} download="cover">
                  <SaveIcon />
                </a>
              </Dialog.Title>
              <Dialog.CloseButton class="imageview__close-button">
                <CloseIcon />
              </Dialog.CloseButton>
            </div>
            <Dialog.Description>
              <Dialog.CloseButton>
                <Image
                  src={props.src}
                  alt="Cover"
                  class="object-cover h-full max-h-[90vh]"
                  rounded="none"
                />
              </Dialog.CloseButton>
            </Dialog.Description>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  )
}

export default ImageView
