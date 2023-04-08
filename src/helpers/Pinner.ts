import _ from 'lodash'

export default function pin(variable: string, value: any) {
  if (import.meta.env.VITE_SHOW_PINS === 'TRUE')
    _.assign(window, { [variable]: value })
}
