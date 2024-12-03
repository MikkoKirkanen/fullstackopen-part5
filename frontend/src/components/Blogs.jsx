import Blog from './Blog'
import PropTypes from 'prop-types'

const Blogs = ({ blogs, userId, like, remove }) => {
  return (
    <div id='blogs' className='accordion'>
      {blogs?.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          userId={userId}
          like={like}
          remove={remove}
        />
      ))}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array,
  userId: PropTypes.string,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
}

export default Blogs
