import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  test('should renders content with title and author', () => {
    const blog = {
      title: 'New blog test',
      author: 'Aku Ankka',
    }

    const { container } = render(<Blog blog={blog} />)

    expect(container.querySelector('.title')).toHaveTextContent(blog.title)
    expect(container.querySelector('.author')).toHaveTextContent(blog.author)
    // Testing if content is hidden
    expect(container.querySelector('.accordion-collapse')).not.toHaveClass(
      'show'
    )
    expect(container.querySelector('.url')).toBeNull()
    expect(container.querySelector('.likes')).toHaveTextContent('')
  })

  test('should renders content with title, author, url, likes and creator when button is clicked', async () => {
    const blog = {
      title: 'New blog test',
      author: 'Aku Ankka',
      url: 'https://url.test/',
      likes: 10,
      user: { name: 'Mikko Kirkanen' },
    }

    const { container } = render(<Blog blog={blog} />)

    expect(container.querySelector('.title')).toHaveTextContent(blog.title)
    expect(container.querySelector('.author')).toHaveTextContent(blog.author)
    // Testing if content is hidden
    expect(container.querySelector('.accordion-collapse')).not.toHaveClass(
      'show'
    )

    // Get button and click content to visible
    const user = userEvent.setup()
    const titleButton = screen.getByText(blog.title)
    await user.click(titleButton)

    // Testing if content is visible
    expect(container.querySelector('.accordion-collapse')).toHaveClass('show')
    const link = container.querySelector('.url')
    expect(link.href).toEqual(blog.url)
    expect(link.innerHTML).toEqual(blog.url)
    expect(container.querySelector('.creator')).toHaveTextContent(blog.user.name)
  })

  test('should call like fuction twice if like button is clicked twice', async () => {
    const like = vi.fn()

    render(<Blog blog={{}} like={like} />)

    const likeButton = document.querySelector('.like-button')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(like.mock.calls).toHaveLength(2)
  })
})
