import { assign } from 'lodash-es'

export default function pin(variable: string, value: any) {
  if (import.meta.env.VITE_SHOW_PINS === 'TRUE')
    assign(window, { [variable]: value })
}
