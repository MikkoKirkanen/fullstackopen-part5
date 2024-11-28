import { test, describe } from 'node:test'
import assert from 'node:assert'
import { readFile } from 'fs/promises'
import listHelper from '../utils/list_helpers.js'

const blogs_json = JSON.parse(
  await readFile(new URL('../data/blogs.json', import.meta.url))
)

// Exercise 4.3
test('Dummy returns one', () => {
  const result = listHelper.dummy([])
  assert.strictEqual(result, 1)
})

// Exercise 4.4
describe('Total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs_json[1]])
    assert.strictEqual(result, 5)
  })
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs_json)
    assert.strictEqual(result, 36)
  })
})

// Exercises 4.5 - 4.7
describe('Most', () => {
  // Exercise 4.5
  test('liked blog', () => {
    const result = listHelper.favoriteBlog(blogs_json)
    assert.deepStrictEqual(result, blogs_json[2])
  })

  // Exercise 4.6
  test('blogs', () => {
    const result = listHelper.mostBlogs(blogs_json)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  // Exercise 4.7
  test('likes', () => {
    const result = listHelper.mostLikes(blogs_json)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
