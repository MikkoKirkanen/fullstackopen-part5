import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { HandThumbsUpFill, TrashFill } from 'react-bootstrap-icons'

const Blog = ({ blog, userId, like, remove }) => {
  const [show, setShow] = useState(false)

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <div className='blog accordion-item'>
      <h2 className='accordion-header'>
        <button
          className={`title accordion-button ${show ? '' : 'collapsed'}`}
          type='button'
          onClick={toggleShow}
        >
          {blog?.title}
        </button>
      </h2>
      <div
        className={`accordion-collapse collapse ${show ? 'show' : ''}`}
        aria-hidden={!show}
      >
        <div className='accordion-body p-0'>
          <div className='accordion-content'>
            {blog?.author ? (
              <div className='author mb-2 text-muted h6'>{blog.author}</div>
            ) : null}
            {blog?.url ? (
              <div className='mb-3'>
                <a className='url text-break' href={blog.url}>
                  {blog.url}
                </a>
              </div>
            ) : null}
            {blog?.user?.name ? (
              <div className='text-secondary'>
                Creator: <span className='creator'>{blog.user.name}</span>
              </div>
            ) : null}
          </div>
          {userId ? (
            <div className='accordion-footer bg-light-subtle border-top d-flex justify-content-between'>
              <Button
                className='like-button'
                variant='success'
                title='Like'
                onClick={() => like(blog)}
              >
                <HandThumbsUpFill className='me-2' />
                <span className='likes'>{blog?.likes}</span>
              </Button>
              {blog?.user?.id && blog.user.id === userId ? (
                <Button
                  variant='danger'
                  title='Remove'
                  onClick={() => remove(blog)}
                >
                  <TrashFill />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  userId: PropTypes.string,
  like: PropTypes.func,
  remove: PropTypes.func,
}

export default Blog
