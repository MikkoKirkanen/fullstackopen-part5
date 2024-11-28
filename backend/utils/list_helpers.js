// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

// Exercise 4.4
const totalLikes = (blogs) => {
  return blogs?.reduce((n, { likes }) => n + likes, 0) || 0
}

// Exercise 4.5
const favoriteBlog = (blogs) => {
  return blogs?.reduce((max, blog) => (max.likes > blog.likes ? max : blog))
}

// Exercise 4.6
const mostBlogs = (blogs) => {
  const [authors, keys] = groupByAuthors(blogs);
  const authorsBlogs = keys.map((k) => ({
    author: k,
    blogs: authors[k].length,
  }))
  return authorsBlogs.reduce((m, a) => (m.blogs > a.blogs ? m : a))
}

// Exercise 4.7
const mostLikes = (blogs) => {
  const [authors, keys] = groupByAuthors(blogs);
  const authorsLikes = keys.map((k) => ({
    author: k,
    likes: totalLikes(authors[k])
  }))
  return authorsLikes.reduce((m, a) => (m.likes > a.likes ? m : a))
}

const groupByAuthors = (blogs) => {
  const authors = Object.groupBy(blogs, ({ author }) => author)
  const keys = Object.keys(authors)
  return [authors, keys]
}

export default {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
