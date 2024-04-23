import { JSX, ParentComponent, Show } from 'solid-js'

interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  count: string | number
}

const Badge: ParentComponent<BadgeProps> = props => {
  return (
    <div class="relative">
      <div
        class="absolute top-[-6px] right-0 rounded-full py-0.5 px-1 text-rose-800 z-50 bg-rose-400"
        {...props}
      >
        <Show when={Number(props.count) > 99} fallback={props.count}>
          99+
        </Show>
      </div>
      {props.children}
    </div>
  )
}

export default Badge
