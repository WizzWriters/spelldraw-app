import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faEraser,
  faObjectGroup,
  faPencil,
  faShareNodes,
  faTimes,
  faUser,
  faArrowsUpDownLeftRight,
  faPalette,
  faArrowRotateLeft,
  faArrowRotateRight
} from '@fortawesome/free-solid-svg-icons'

import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

const usedIcons = [
  faPencil,
  faCheck,
  faTimes,
  faEraser,
  faObjectGroup,
  faShareNodes,
  faCircleXmark,
  faUser,
  faArrowsUpDownLeftRight,
  faPalette,
  faArrowRotateLeft,
  faArrowRotateRight
]

export default {
  initializeIcons() {
    for (const icon of usedIcons) {
      library.add(icon)
    }
  }
}
