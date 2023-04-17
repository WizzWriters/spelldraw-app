import { NotInitializedError } from '@/utils/exceptions/NotInitialized'

export function AsyncInitialized(target: any) {
  Object.defineProperty(target.prototype, '_isInitialized', {
    value: false,
    writable: true
  })
}

export function RequiresAsyncInit(
  target: any,
  propertyKey: any,
  descriptor: any
) {
  const wrappedFunction = descriptor.value
  descriptor.value = function (...args: any[]) {
    if (!this._isInitialized) {
      throw new NotInitializedError()
    }
    return wrappedFunction.apply(this, args)
  }
  return descriptor
}

export function AsyncInit(target: any, propertyKey: any, descriptor: any) {
  const wrappedFunction = descriptor.value
  descriptor.value = async function (...args: any[]) {
    const result = await wrappedFunction.apply(this, args)
    this._isInitialized = true
    return result
  }
}
