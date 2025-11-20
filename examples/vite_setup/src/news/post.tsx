export type Category = 'news' | 'sports' | 'weather'

export interface PostProps {
  title: string
  content: string
  imageUrl?: string
  categories: Category[]
}

export function Post({ title, content, imageUrl, categories }: PostProps) {
  return (
    <article style={{ viewTransitionName: slugify(title) }}>
      <div class="categories">
        {categories.map((category) => <span key={category} class={`category category-${category}`}>{category}</span>)}
      </div>
      <h2>{title}</h2>
      <p>{content}</p>
      {imageUrl && <img src={imageUrl} alt={title} />}
    </article>
  )
}
function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
  str = str.toLowerCase() // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
  return str
}
