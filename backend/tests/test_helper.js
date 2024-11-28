import { readFile } from 'fs/promises'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const initBlogs = JSON.parse(
  await readFile(new URL('../data/blogs.json', import.meta.url))
)

const initUsers = JSON.parse(
  await readFile(new URL('../data/users.json', import.meta.url))
)

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

export default { initBlogs, initUsers, blogsInDb, usersInDb }
