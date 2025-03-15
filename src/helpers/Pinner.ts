import { assign } from 'lodash-es'

export default function pin(variable: string, value: unknown) {
  if (import.meta.env.VITE_SHOW_PINS === 'TRUE')
    assign(window, { [variable]: value })
}
