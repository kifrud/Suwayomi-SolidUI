import { ParentComponent } from 'solid-js'
import './styles.scss'

const Chip: ParentComponent = props => {
  return <span class="chip">{props.children}</span>
}

export default Chip
