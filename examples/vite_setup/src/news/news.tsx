import { computed, isComputed, signal } from "alien-deepsignals"
import { Post, type Category, type PostProps } from "./post"
import type { JSX } from "@lilian1315/create-element/alien-deepsignals/jsx-runtime"
import { h } from "@lilian1315/create-element"

const postElementMap = new WeakMap<object, JSX.Element>()

const news: PostProps[] = [
    {
        title: "Breaking News",
        content: "This is the content of the breaking news.",
        imageUrl: "https://picsum.photos/seed/1/400/200",
        categories: ['news']
    },
    {
        title: "Tech Update",
        content: "Latest updates in the tech world.",
        imageUrl: "https://picsum.photos/seed/2/400/200",
        categories: ['news']
    },
    {
        title: "Sports Highlights",
        content: "Highlights from recent sports events.",
        imageUrl: "https://picsum.photos/seed/3/400/200",
        categories: ['sports']
    },
    {
        title: "Weather Report",
        content: "Today's weather forecast.",
        imageUrl: "https://picsum.photos/seed/4/400/200",
        categories: ['news', 'weather']
    },
    {
        title: "AI Revolution Continues",
        content: "Artificial Intelligence reaches new milestones in machine learning and natural language processing.",
        imageUrl: "https://picsum.photos/seed/5/400/200",
        categories: ['news']
    },
    {
        title: "Championship Finals",
        content: "Exciting championship finals draw millions of viewers worldwide.",
        imageUrl: "https://picsum.photos/seed/6/400/200",
        categories: ['sports']
    },
    {
        title: "Climate Summit 2025",
        content: "World leaders gather to discuss climate action and environmental policies.",
        imageUrl: "https://picsum.photos/seed/7/400/200",
        categories: ['news']
    },
    {
        title: "Severe Storm Warning",
        content: "Meteorologists issue severe storm warnings for coastal regions.",
        imageUrl: "https://picsum.photos/seed/8/400/200",
        categories: ['weather']
    },
    {
        title: "Olympic Preparations",
        content: "Athletes prepare for upcoming Olympic games with intensive training programs.",
        imageUrl: "https://picsum.photos/seed/9/400/200",
        categories: ['sports']
    },
    {
        title: "Space Exploration Milestone",
        content: "New discoveries in space exploration bring us closer to understanding the universe.",
        imageUrl: "https://picsum.photos/seed/10/400/200",
        categories: ['news']
    },
    {
        title: "Cryptocurrency Market Update",
        content: "Digital currencies show significant movement in global markets.",
        imageUrl: "https://picsum.photos/seed/11/400/200",
        categories: ['news']
    },
    {
        title: "Winter Weather Advisory",
        content: "Heavy snowfall expected in northern regions this weekend.",
        imageUrl: "https://picsum.photos/seed/12/400/200",
        categories: ['weather']
    },
    {
        title: "Soccer World Cup Qualifiers",
        content: "National teams compete for World Cup qualification spots.",
        imageUrl: "https://picsum.photos/seed/13/400/200",
        categories: ['sports']
    },
    {
        title: "Healthcare Innovation",
        content: "Breakthrough medical treatments show promising results in clinical trials.",
        imageUrl: "https://picsum.photos/seed/14/400/200",
        categories: ['news']
    },
    {
        title: "Heat Wave Alert",
        content: "Unprecedented temperatures recorded across multiple regions.",
        imageUrl: "https://picsum.photos/seed/15/400/200",
        categories: ['weather']
    },
]

const categoryFilter = signal<null | Category>(null)
const onchange = function(e: Event) {
    document.startViewTransition(() => {
        const target = e.target as HTMLSelectElement
        categoryFilter.set((target.value ? target.value : null) as Category)
    })
}

const filteredNews = computed(() => {
    const category = categoryFilter.get()
    return (category ? news.filter((post) => post.categories.includes(category)) : news)
        .flatMap((post) => {
            const element = getPostElement(post)
            return isComputed(element) ? element.get() : element
        })
})

h('select', {name: "categories", onchange: onchange})

export function News() {
    return (<>
        <h1>News</h1>
        {'please select a category: '}
        <select name="categories" onchange={onchange}>
            <option value="">All</option>
            <option value="news">News</option>
            <option value="sports">Sports</option>
            <option value="weather">Weather</option>
        </select>
        <div class="card">
            <div class="posts">
                {filteredNews}
            </div>
        </div>
    </>)
}

function getPostElement(post: PostProps): JSX.Element {
    let storedElement = postElementMap.get(post)
    if (storedElement) return storedElement

    const element = <Post {...post} />
    postElementMap.set(post, element)
    return element
}