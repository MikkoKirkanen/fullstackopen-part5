import express from 'express'
// import middleware from '../utils/middleware.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const testingRoute = express.Router()

testingRoute.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

testingRoute.post('/blogs', async (req, res) => {
  await Blog.insertMany(req.body)

  res.status(201).end()
})

export default testingRoute