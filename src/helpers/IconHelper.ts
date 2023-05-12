import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faEraser,
  faObjectGroup,
  faPencil,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

const usedIcons = [faPencil, faCheck, faTimes, faEraser, faObjectGroup]

export default {
  initializeIcons() {
    for (const icon of usedIcons) {
      library.add(icon)
    }
  }
}
