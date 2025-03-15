import type { RgbColor } from '@/common/definitions/Color'
import { useColorStore } from '@/store/ColorStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import { cloneDeep } from 'lodash-es'
import HistoryService from '../history/HistoryService'
import CanvasService from '../canvas/CanvasService'

export default class ColorService {
  private canvasService = new CanvasService()

  public setStrokeColor(color: RgbColor) {
    const colorStore = useColorStore()
    const toolbarStore = useToolbarStore()

    HistoryService.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = cloneDeep(shape)
      shapeCopy.strokeColor = color
      this.canvasService.updateShape(shapeCopy)
    })
    HistoryService.stopAggregating()

    return colorStore.setStrokeColor(color)
  }

  public setFillColor(color: RgbColor) {
    const colorStore = useColorStore()
    const toolbarStore = useToolbarStore()

    HistoryService.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = cloneDeep(shape)
      shapeCopy.fillColor = color
      this.canvasService.updateShape(shapeCopy)
    })
    HistoryService.stopAggregating()

    return colorStore.setFillColor(color)
  }

  public setStrokeWidth(width: number) {
    const colorStore = useColorStore()
    const toolbarStore = useToolbarStore()

    HistoryService.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = cloneDeep(shape)
      shapeCopy.strokeWidth = width
      this.canvasService.updateShape(shapeCopy)
    })
    HistoryService.stopAggregating()

    return colorStore.setStrokeWidth(width)
  }
}
