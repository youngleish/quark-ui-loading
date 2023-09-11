type ClassName = string | undefined | null
type Classes = (ClassName | [any, ClassName, ClassName?])[]
type BEM<S extends string | undefined, N extends string, NC extends string> = S extends undefined
  ? NC
  : S extends `$--${infer CM}`
  ? `${N}--${CM}`
  : S extends `--${infer M}`
  ? `${NC}--${M}`
  : `${NC}__${S}`
export function createNamespace<C extends string>(name: C) {
  const namespace = `var` as const
  const componentName = `${namespace}-${name}` as const

  const createBEM = <S extends string | undefined = undefined>(
    suffix?: S
  ): BEM<S, typeof namespace, typeof componentName> => {
    if (!suffix) {
      return componentName as any
    }

    if (suffix[0] === '$') {
      return suffix.replace('$', namespace) as any
    }

    return (suffix.startsWith('--') ? `${componentName}${suffix}` : `${componentName}__${suffix}`) as any
  }

  const classes = (...classes: Classes): any[] =>
    classes.map((className) => {
      if (Array.isArray(className)) {
        const [condition, truthy, falsy = null] = className
        return condition ? truthy : falsy
      }

      return className
    })

  return {
    n: createBEM,
    classes,
  }
}

export function getClassNames(classNameMap: Record<string, boolean | undefined>) {
  return Object.entries(classNameMap)
    .filter(([_, value]) => value)
    .map(([className]) => className)
    .join(' ')
}
