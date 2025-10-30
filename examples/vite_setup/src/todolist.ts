import { el } from "@lmoulanier/el/alien-deepsignals";
import { batch, computed, deepSignal, watch, type DeepSignal } from "alien-deepsignals";
import { debounce } from "./debounce";

type Todo = DeepSignal<{ id: string, title: string, isDone: boolean }>

const todolistsIds = new Set<string>()

export function createTodolist(id?: string) {
    const todoNodeMap = new WeakMap<Todo, HTMLElement>()
    const todoInputMap = new WeakMap<Todo, HTMLInputElement>()
    const todolist = deepSignal<Todo[]>([])

    if(typeof id === 'string') useLocalStorage(id)

    const countDones = computed(() => todolist.filter((t) => t.isDone).length)

    const todolistNodes = computed(() => todolist.map(getTodoNode))

    const addInput = el('input', { class: 'todolist-add-input', type: 'text', placeholder: 'New todo' })

    const container = el('div', { class: 'todolist' },
        el('div', { class: 'count-dones' }, 'Done: ', countDones),
        el('form',
            {
                class: 'todolist-add-form',
                onsubmit(e) {
                    e.preventDefault()

                    if(addInput.value.length > 0) {
                        add(addInput.value)
                        addInput.value = ''
                    }
                }
            },
            addInput,
            el('button', { class: 'todolist-add-button', onclick() { addInput.focus() } }, 'add!')
        ),
        todolistNodes
    )

    return container

    function getTodoNode(todo: Todo): Node {
        let node = todoNodeMap.get(todo)

        if(node) return node

        const editInput = el('input', {
            class: 'todo-edit-input',
            placeholder: '[Insert something cool here...]',
            type: 'text',
            value: todo.title,
            oninput(e) { todo.title = (e.target as HTMLInputElement).value }
        })

        todoInputMap.set(todo, editInput)

        node = el('div', { class: { todo: true, done: todo.$isDone } }, [
            el('input', {
                class: 'todo-checkbox',
                type: 'checkbox',
                checked: todo.isDone,
                onchange(e) { todo.isDone = (e.target as HTMLInputElement).checked }
            }),
            editInput,
            el('button', { class: 'todo-delete', type: 'button', onclick: () => del(todo) }, 'X'),
            el('button', {
                class: 'todo-add-after',
                type: 'button',
                onclick: () => {
                    const newTodo = addAfter(todo, '')
                    if(newTodo) focusTodoInput(newTodo)
                }
            }, '+'),
            el('button', {
                class: 'todo-add-before',
                type: 'button',
                onclick: () => {
                    const newTodo = addBefore(todo, '')
                    if(newTodo) focusTodoInput(newTodo)
                }
            }, '+'),
        ])

        todoNodeMap.set(todo, node)

        return node
    }

    function add(title: string, index?: number): Todo {
        const id = (Date.now() + Math.random()).toString()
        const todo: Todo = deepSignal({ id, isDone: false, title })
        batch(() => todolist.splice(typeof index === 'number' ? index : 0, 0, todo))

        return todo
    }

    function addAfter(todo: Todo, title: string): Todo | null {
        const index = todolist.indexOf(todo)
        if(index === -1) return null
        return add(title, index + 1)
    }

    function addBefore(todo: Todo, title: string): Todo | null {
        const index = todolist.indexOf(todo)
        if(index === -1) return null
        return add(title, index)
    }

    function del(todo: Todo) {
        const index = todolist.indexOf(todo)
        if(index === -1) return
        batch(() => todolist.splice(index, 1))
    }

    function focusTodoInput(todo: Todo) {
        const input = todoInputMap.get(todo)
        if(input) input.focus()
    }

    function useLocalStorage(id: string) {
        if (todolistsIds.has(id)) throw new Error(`A todolist with the same id already exists. id: «${id}»`)

        let storedTodos: any
        try {
            storedTodos = JSON.parse(localStorage.getItem('todolist-' + id) ?? '[]')
        } catch (e) {
            console.error(`Failed to get the todolist with id «${id}». Error: `, e)
        }

        if (storedTodos && Array.isArray(storedTodos) && storedTodos.length > 0) todolist.splice(0, 0, ...storedTodos)

        const save = debounce(() => {
            localStorage.setItem('todolist-' + id, JSON.stringify(todolist))
        }, 500)

        watch(todolist, save, { deep: true })
    }
}
