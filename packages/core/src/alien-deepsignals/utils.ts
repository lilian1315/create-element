import { effect, isComputed, isSignal } from "alien-deepsignals"
import type { DomElement, Child } from "../types"
import type { Children, ReactiveChild } from "./types"
import { childToNode, handleAttribute, handleChildren } from "../utils"

export function handleSignalAttribute(element: DomElement, key: string | symbol, value: any): void {
    if (isSignal(value) || isComputed(value)) {
        effect(() => doHandleAttribute(element, key, value.get()))
        return
    }

    doHandleAttribute(element, key, value)
}

function doHandleAttribute(element: DomElement, key: string | symbol, value: any): void {
    if(typeof key === 'string') {
        if(handleClassSignalAttribute(element, key, value)) return
        if(handleStyleSignalAttribute(element, key, value)) return
        if(handleDataSignalAttribute(element, key, value)) return
    }

    handleAttribute(element, key, value)
}

function handleClassSignalAttribute(element: DomElement, name: string, value: any): boolean {
    if (name !== 'class') return false

    if(Array.isArray(value)) {
        effect(() => {
            element.classList = ''

            for (let v of value) {
                if (isSignal(v) || isComputed(v)) v = v.get()
                if (v) element.classList.add(v)
            }
        })

        return true
    }

    if(typeof value === 'object') {
        for(const k of Object.keys(value)) {
            effect(() => {
                let v = value[k]
                if (isSignal(v) || isComputed(v)) v = v.get()
                element.classList.toggle(k as string, v === true)
            })
        }

        return true
    }

    return false
}

function handleStyleSignalAttribute(element: DomElement, name: string, value: any): boolean {
    if (name !== 'style') return false

    if (typeof value === 'object' && value !== null) {
        if(element instanceof SVGElement) {
            effect(() => {
                const styleString = Object.entries(value).map(([key, val]) => {
                    const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
                    return `${kebabKey}: ${(isSignal(val) || isComputed(val) ? val.get() : val)};`;
                }).join('');
                element.setAttribute('style', styleString);
            })
        } else {
            for(const key of Object.keys(value)) {
                effect(() => {
                    let val = value[key]
                    if (isSignal(val) || isComputed(val)) val = val.get()
                    // @ts-expect-error
                    element.style[key] = val
                })
            }
        }

        return true
    }

    return false
}

function handleDataSignalAttribute(element: DomElement, key: string, value: any): boolean {
    if (key !== 'data') return false

    if (typeof value === 'object' && value !== null) {
        for(const k of Object.keys(value)) {
            effect(() => {
                let v = value[k]
                if (isSignal(v) || isComputed(v)) v = v.get()
                if(typeof v === 'string') element.dataset[k] = v
            })
        }

        return true
    }

    return false
}

export function handleSignalChildren(element: DomElement, children: Children): void {
    if(isSignal(children) || isComputed(children)) {
        let placeholder: Node | null = null

        const getPlaceholder = () => {
            if (!placeholder) placeholder = document.createComment('signal placeholder')
            return placeholder
        }

        const nodes: Node[] = []

        effect(() => {
            const newNodes = reactiveChildrenToNodes(children)
            if (newNodes.length === 0) newNodes.push(getPlaceholder())

            let lastInsertedNode: Node | null = null

            for (let i = 0; i < Math.max(newNodes.length, nodes.length); i++) {
                const newNode = newNodes[i]
                const node = nodes[i]
                const isInNew = node && newNodes.indexOf(node) !== -1

                if (node && !isInNew && i + 1 < nodes.length) {
                    if (element.contains(node)) element.removeChild(node)
                    nodes.splice(i, 1)
                    i--
                    continue
                }

                if (newNode && newNode === node) {
                    lastInsertedNode = newNode
                    continue
                }

                if (newNode) {
                    if (node && element.contains(node)) element.insertBefore(newNode, node)
                    else if (lastInsertedNode && element.contains(lastInsertedNode)) insertAfter(element, newNode, lastInsertedNode)
                    else element.appendChild(newNode)

                    const indexInOld = nodes.indexOf(newNode)
                    if (indexInOld !== -1) nodes.splice(indexInOld, 1)
                    nodes.splice(i, 0, newNode)

                    lastInsertedNode = newNode

                    continue
                }

                if (!newNode && node) {
                    for (let j = i; j < nodes.length; j++) {
                        if (element.contains(nodes[j])) element.removeChild(nodes[j])
                    }

                    nodes.splice(i)
                    break
                }
            }
        })
    } else {
        return handleChildren(element, children)
    }
}

export function reactiveChildrenToNodes(reactiveChild: ReactiveChild): Node[] {
    const value = getReactiveChildValue(reactiveChild)

    const nodes: Node[] = []
    if (Array.isArray(value)) {
        value.forEach((v) => {
            const node = childToNode(v)
            if (node) nodes.push(node)
        })
    } else {
        const node = childToNode(value)
        if (node) nodes.push(node)
    }

    return nodes
}

function getReactiveChildValue(child: ReactiveChild): Child | Child[] {
    if (isSignal(child) || isComputed(child)) return child.get()

    throw new Error("Invalid reactive child")
}

function insertAfter(parent: Node, newNode: Node, referenceNode: Node): void {
    const nextNode = referenceNode.nextSibling
    if (nextNode) {
        parent.insertBefore(newNode, nextNode)
    } else {
        parent.appendChild(newNode)
    }
}
