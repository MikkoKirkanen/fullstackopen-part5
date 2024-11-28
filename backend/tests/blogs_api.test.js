import { test, after, describe, before } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const api = supertest(app)
const blogs_url = '/api/blogs'

describe('Blogs', () => {
  const user = { username: 'mikko', password: 'password' }
  const author = 'Mikko Kirkanen'
  // Clear and initialize DB
  before(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initBlogs)
    await User.deleteMany({})
    await api.post('/api/users').send(user)
    const test = await api.post('/api/login').send(user)
    user.token = test.body.token
  })

  // Exercise 4.8
  test('should returned as json and correct amount of blogs', async () => {
    const res = await api
      .get(blogs_url)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, helper.initBlogs.length)
  })

  // Exercise 4.9
  test('should be an correct identifier (id) field for all', async () => {
    const res = await api
      .get(blogs_url)
      .set('Authorization', `Bearer ${user.token}`)
    const hasEveryId = res.body?.every((obj) => !!obj.id)
    assert(hasEveryId)
  })

  describe('New Blog', () => {
    const newBlog = {
      title: "Mikko Kirkanen's website",
      author: author,
      url: 'https://mikkokirkanen.fi',
    }

    // Exercises 4.10 and 4.11
    test('should have valid data and likes 0 by default', async () => {
      const res = await api
        .post(blogs_url)
        .send(newBlog)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initBlogs.length + 1)

      const createdBlog = blogsAtEnd.find((b) => b.id === res.body.id)
      assert.strictEqual(createdBlog.author, author)

      // Exercise 4.11 test
      assert.strictEqual(createdBlog.likes, 0)
    })

    // Exercise 4.12
    test('should fail if title is unset', async () => {
      const noTitle = { ...newBlog }
      delete noTitle.title

      const res = await api
        .post(blogs_url)
        .send(noTitle)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)

      assert(res.body.errors.includes('Title is required'))
    })

    // Exercise 4.12
    test('should fail if url is unset', async () => {
      const noUrl = { ...newBlog }
      delete noUrl.url

      const res = await api
        .post(blogs_url)
        .send(noUrl)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(400)

      assert(res.body.errors.includes('Url is required'))
    })

    // Exercise 4.23
    test('should fail on missing token', async () => {
      const res = await api
        .post(blogs_url)
        .send(newBlog)
        .expect(401)

      assert.strictEqual(res.body.error, 'Token missing or invalid')
    })
  })

  describe('Blog Management', () => {
    // Exercise 4.14
    test('should modify one blog', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs.find((b) => b.author === author)
      blog.likes = 7

      await api
        .put(blogs_url)
        .send(blog)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()
      const updatedBlog = blogsAfter.find((b) => b.id === blog.id)

      assert.strictEqual(updatedBlog.likes, 7)
    })

    // Exercise 4.13
    test('should remove one blog', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs.find((b) => b.author === author)

      const deletedBlog = await api
        .delete(`${blogs_url}/${blog.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200)

      const blogsAfter = await helper.blogsInDb()

      assert.strictEqual(blogsAfter.length, blogs.length - 1)
      assert.strictEqual(deletedBlog.body.message, 'Blog successfully deleted')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
