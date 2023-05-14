import type { Shape } from '@/common/definitions/Shape'
import type { Ref } from 'vue'
import { useIntersectionDetection } from './useIntersectionDetection'
import { useSelectionDetection } from './useSelectionDetection'

export function useCollisionDetection(
  elementRef: Ref<(SVGGeometryElement & HTMLElement) | null>,
  shape: Ref<Shape>,
  enabled: Ref<Boolean>
) {
  useIntersectionDetection(elementRef, shape, enabled)
  useSelectionDetection(elementRef, shape, enabled)
}
