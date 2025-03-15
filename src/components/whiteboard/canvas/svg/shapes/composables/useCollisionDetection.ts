import type { PointListBasedShape } from '@/common/definitions/Shape'
import type { Ref } from 'vue'
import { useIntersectionDetection } from './useIntersectionDetection'
import { useSelectionDetection } from './useSelectionDetection'

export function useCollisionDetection(
  elementRef: Ref<(SVGGeometryElement & HTMLElement) | null>,
  shape: Ref<PointListBasedShape>,
  enabled: Ref<boolean>
) {
  useIntersectionDetection(elementRef, shape, enabled)
  useSelectionDetection(elementRef, shape, enabled)
}
