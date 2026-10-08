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
