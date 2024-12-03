import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import bcrypt from 'bcrypt'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)
const users_url = '/api/users'

describe('Users', () => {
  const users = helper.initUsers
  // Clear and initialize DB
  before(async () => {
    await User.deleteMany({})
    for (const u of users) {
      u.passwordHash = await bcrypt.hash(u.password, 10)
    }
    await User.insertMany(users)
  })

  test('should returned as json and correct amount of users', async () => {
    const res = await api
      .get(users_url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, helper.initUsers.length)
  })

  describe('New User', () => {
    test('should successful add new user', async () => {
      const newUser = { username: 'kirkanen', password: 'password' }
      const res = await api.post(users_url).send(newUser).expect(201)

      assert.strictEqual(res.body.username, newUser.username)
    })

    test('should failed to add dubplicate username', async () => {
      const newUser = { username: 'mikko', password: 'password' }
      const res = await api.post(users_url).send(newUser).expect(500)

      assert.strictEqual(res.body.title, 'Username is already in use')
    })

    test('should require username', async () => {
      const newUser = { username: '', password: 'password' }

      const res = await api.post(users_url).send(newUser).expect(400)
      assert(res.body.messages.includes('Username is required'))
    })

    test('should require minimum length of 3 to username', async () => {
      const newUser = { username: 'hi', password: 'password' }

      const res = await api.post(users_url).send(newUser).expect(400)
      assert(
        res.body.messages.includes('Username minimum length is 3 characters')
      )
    })

    test('should require password', async () => {
      const newUser = { username: 'kirkanen' }

      const res = await api.post(users_url).send(newUser).expect(400)
      assert.strictEqual(res.body.title, 'Password is required')
    })

    test('should require minimum length of 8 to password', async () => {
      const newUser = { username: 'kirkanen', password: 'short' }

      const res = await api.post(users_url).send(newUser).expect(400)
      assert.strictEqual(
        res.body.title,
        'Password length must be at least 8 characters'
      )
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
