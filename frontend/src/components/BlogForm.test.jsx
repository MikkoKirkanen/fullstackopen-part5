import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogFrom from './BlogForm'

describe('Blog form', () => {
  test('should return correct information on submit', async () => {
    const submitBlog = vi.fn(
      () =>
        new Promise((resolve, reject) => {
          resolve()
        })
    )
    const { container } = render(<BlogFrom submitBlog={submitBlog} />)
    const blog = { title: 'Test title', author: 'Tester', url: 'test-url' }

    await userEvent.type(container.querySelector('#title'), blog.title)
    await userEvent.type(container.querySelector('#author'), blog.author)
    await userEvent.type(container.querySelector('#url'), blog.url)

    const submitButton = screen.getByText('Send')
    await userEvent.click(submitButton)

    expect(submitBlog.mock.calls).toHaveLength(1)
    expect(submitBlog.mock.lastCall[0]).toEqual(blog)
  })
})
