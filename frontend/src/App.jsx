import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import loginService from './services/login'
import blogService from './services/blog'
import Login from './components/Login'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Menubar from './components/Menubar'
import BlogForm from './components/BlogForm'

function App() {
  const [user, setUser] = useState(null)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [notification, setNotification] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)
  const [blogs, setBlogs] = useState(null)

  useEffect(() => {
    const loggerUser = localStorage.getItem('loggedUser')
    if (loggerUser) {
      const user = JSON.parse(loggerUser)
      setUser(user)
      blogService.setToken(user.token)
    }
    getBlogs()
  }, [])

  const handleLoginChange = (event) => {
    const target = event.target
    setLogin((prev) => ({
      ...prev,
      [target.name]: target.value,
    }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    loginService
      .login(login)
      .then((user) => {
        setUser(user)
        localStorage.setItem('loggedUser', JSON.stringify(user))
        blogService.setToken(user.token)
        setLogin({username: '', password: ''})
        showNotification(user, 'success')
      })
      .catch((error) => {
        showNotification(error.response.data, 'danger')
      })
  }

  const getBlogs = () => {
    blogService.getAll().then((data) => {
      const sortedBlogs = sortByLikes(data)
      setBlogs(sortedBlogs)
    })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedUser')
    showNotification({ title: 'Logged out' }, 'info')
  }

  const handleBlog = (blog) => {
    return new Promise((resolve, reject) => {
      blogService
        .create(blog)
        .then((res) => {
          setBlogs(blogs.concat(res))
          const title = `A new blog added: ${res.title} by ${res.author}`
          showNotification({ title: title }, 'success')
          resolve()
        })
        .catch((error) => {
          showNotification(error.response.data, 'danger')
          reject()
        })
    })
  }

  const like = (blog) => {
    const updatableBlog = { ...blog }
    updatableBlog.likes += 1
    const userId = blog.user?.id
    if (userId) {
      updatableBlog.user = userId
    }
    delete updatableBlog.id
    blogService
      .update(updatableBlog, blog.id)
      .then((res) => {
        setBlogs(blogs.map((b) => (b.id !== res.id ? b : res)))
        const title = 'Liked blog: ' + getTitleAndAuthor(res)
        showNotification({ title: title }, 'success')
      })
      .catch((error) => {
        showNotification(error.response.data, 'danger')
      })
  }

  const getTitleAndAuthor = (blog) => {
    return blog.title + (blog.author ? ` by ${blog.author}` : '')
  }

  const sortByLikes = (data) => {
    return data?.sort((a, b) => b.likes - a.likes)
  }

  const remove = (blog) => {
    const message = 'Remove blog: ' + getTitleAndAuthor(blog)
    if (confirm(message)) {
      blogService
        .remove(blog.id)
        .then((res) => {
          const updatedBlogs = blogs.filter((b) => b.id !== blog.id)
          setBlogs(updatedBlogs)
          showNotification(res, 'success')
        })
        .catch((error) => {
          showNotification(error.response.data, 'danger')
        })
    }
  }

  const showNotification = (data, type) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setNotification({
      title: data.title,
      messages: data.messages,
      type: type,
      show: true,
    })

    const newTimeoutId = setTimeout(() => {
      hideNotification()
    }, 5000)
    setTimeoutId(newTimeoutId)
  }

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      show: false,
    }))
  }

  return (
      <Container className='pb-3'>
        <Menubar onLogout={handleLogout} user={user} />
        <Notification notification={notification} onClose={hideNotification} />
        {user ? (
          <BlogForm submitBlog={handleBlog} />
        ) : (
          <Login
            login={login}
            onLoginChange={handleLoginChange}
            submit={handleLogin}
          />
        )}
        <h1>Blogs</h1>
        <Blogs blogs={blogs} userId={user?.id} like={like} remove={remove} />
      </Container>
  )
}

export default App
