import { test, expect, beforeEach, describe, response } from '@playwright/test'

const baseUrl = 'http://localhost:3003/api'

// In webkit tests need to use { force: true } for click on Kubuntu 24.04
// https://github.com/microsoft/playwright/issues/33057

const addTestBlog = async (page) => {
  await page.getByTestId('create').click({ force: true })
  await page.getByTestId('title').fill('Test blog')
  await page.getByTestId('author').fill('Author')
  await page.getByTestId('url').fill('url')
  await page.getByTestId('send').click({ force: true })
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(baseUrl + '/testing/reset')
    await request.post(baseUrl + '/users', {
      data: {
        name: 'Mikko Kirkanen',
        username: 'mikko',
        password: 'kirkanen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('should show login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    test('should succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mikko')
      await page.getByTestId('password').fill('kirkanen')
      await page.click('#login', { force: true })

      await expect(page.getByText('Logged in successfully')).toBeVisible()
      await expect(page.getByText('Logged in: Mikko Kirkanen')).toBeVisible()
    })

    test('should fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('wronguser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.click('#login', { force: true })

      await expect(page.getByText('Invalid username or password')).toBeVisible()
      await expect(page.getByText('Not logged in')).toBeVisible()
    })
  })

  describe('Logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mikko')
      await page.getByTestId('password').fill('kirkanen')
      await page.click('#login', { force: true })
    })

    test('should create a new blog', async ({ page }) => {
      await addTestBlog(page)
      await expect(
        page.getByText('A new blog added: Test blog by Author')
      ).toBeVisible()
      const blogButton = page.getByRole('button', { name: 'Test blog' })
      await expect(blogButton).toBeVisible()
    })

    test('should add like to blog', async ({ page }) => {
      await addTestBlog(page)
      const blogButton = page.getByRole('button', { name: 'Test blog' })
      blogButton.click({ force: true })
      const likeButton = page.getByTitle('Like')
      await expect(likeButton).toBeVisible()
      await likeButton.click({ force: true })
      await page.waitForResponse(
        (res) => res.url().includes('/api/blogs') && res.status() === 200
      )
      await expect(
        page.getByText('Liked blog: Test blog by Author')
      ).toBeVisible()
      const likes = likeButton.getByText(1)
      await expect(likes).toBeVisible()
    })

    test('should remove blog', async ({ page }) => {
      await addTestBlog(page)
      const blogButton = page.getByRole('button', { name: 'Test blog' })
      await blogButton.click({ force: true })
      const removeButton = page.getByTitle('Remove')
      await expect(removeButton).toBeVisible()
      page.on('dialog', async (dialog) => await dialog.accept())
      await removeButton.click({ force: true })
      await page.waitForResponse(
        (res) => res.url().includes('/api/blogs') && res.status() === 200
      )

      expect(page.getByText('Blog successfully deleted')).toBeVisible()
      expect(page.getByText('Test blog')).toHaveCount(0)
    })

    test('should show remove button only for blog creator', async ({
      page,
      request,
    }) => {
      await addTestBlog(page)
      await request.post(baseUrl + '/users', {
        data: {
          name: 'Aku Ankka',
          username: 'aku',
          password: 'ankkalinna',
        },
      })
      await page
        .getByTestId('notification')
        .getByRole('button')
        .click({ force: true })

      await page
        .getByRole('button', { name: 'Test blog' })
        .click({ force: true })
      expect(page.getByTitle('Remove')).toBeVisible()

      page.click('#logout', { force: true })
      page.reload()

      await page.getByTestId('username').fill('aku')
      await page.getByTestId('password').fill('ankkalinna')
      await page.click('#login', { force: true })
      await page.waitForResponse(
        (res) => res.url().includes('/api/login') && res.status() === 200
      )
      await page
        .getByRole('button', { name: 'Test blog' })
        .click({ force: true })

      expect(page.getByTitle('Like')).toBeVisible()
      expect(page.getByTitle('Remove')).toBeHidden()
    })

    test('should sort blog by likes', async ({ page, request }) => {
      await request.post(baseUrl + '/testing/blogs', {
        data: [
          { title: 'Blog 1', url: 'url', likes: 5 },
          { title: 'Blog 2', url: 'url', likes: 7 },
          { title: 'Blog 3', url: 'url', likes: 7 },
          { title: 'Blog 4', url: 'url', likes: 3 },
          { title: 'Blog 5', url: 'url', likes: 10 },
        ],
      })

      await page.reload()
      const blogButtons = page.getByTestId('blogs').getByRole('button')
      expect(blogButtons).toHaveCount(5)
      expect((await blogButtons.nth(0).innerText()).valueOf()).toEqual('Blog 5')
      expect((await blogButtons.nth(1).innerText()).valueOf()).toEqual('Blog 2')
      expect((await blogButtons.nth(2).innerText()).valueOf()).toEqual('Blog 3')
      expect((await blogButtons.nth(3).innerText()).valueOf()).toEqual('Blog 1')
      expect((await blogButtons.nth(4).innerText()).valueOf()).toEqual('Blog 4')
    })
  })
})
