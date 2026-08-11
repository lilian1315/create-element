export type StopEffect = () => void

/**
 * Adapts a reactivity library's native sources to renderer-neutral operations.
 */
export interface ReactivityAdapter<Source> {
  /**
   * Returns whether a value is a reactive source supported by this adapter.
   */
  isReactive(value: unknown): value is Source

  /**
   * Gets the current value and tracks it in the active reactive context.
   */
  get(source: Source): unknown

  /**
   * Reads the current value without subscribing the active reactive context.
   */
  peek(source: Source): unknown

  /**
   * Runs immediately, reruns when its reactive dependencies change, and returns a function
   * that stops the effect.
   */
  effect(run: () => void): StopEffect
}

/**
 * Gets a reactive value in the active reactive context, or returns a non-reactive value unchanged.
 */
export function getReactiveValue<Source>(
  adapter: ReactivityAdapter<Source>,
  value: unknown,
): unknown {
  return adapter.isReactive(value) ? adapter.get(value) : value
}
