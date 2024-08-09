import { ParentComponent } from 'solid-js'

const ReaderLayout: ParentComponent = props => {
  return <div class='h-full w-full'>{props.children}</div>
}

export default ReaderLayout
