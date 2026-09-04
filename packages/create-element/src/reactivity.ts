export type StopEffect = () => void

export class EffectScope {
  private readonly children = new Set<EffectScope>()
  private readonly cleanups: StopEffect[] = []
  private disposed = false

  constructor(private readonly parent?: EffectScope) {
    parent?.children.add(this)
  }

  child(): EffectScope {
    const child = new EffectScope(this)
    if (this.disposed) child.dispose()
    return child
  }

  addCleanup(cleanup: StopEffect): void {
    if (this.disposed) cleanup()
    else this.cleanups.push(cleanup)
  }

  effect<Source>(adapter: ReactivityAdapter<Source>, run: () => void): void {
    this.addCleanup(adapter.effect(run))
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.parent?.children.delete(this)

    for (const child of [...this.children].reverse()) child.dispose()
    this.children.clear()

    for (let index = this.cleanups.length - 1; index >= 0; index--) this.cleanups[index]()
    this.cleanups.length = 0
  }
}

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
