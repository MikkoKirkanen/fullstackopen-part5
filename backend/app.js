import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import connectDb from './db/connection.js'
import middleware from './utils/middleware.js'
import loginRouter from './controllers/login.js'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import testingRouter from './controllers/testing.js'

connectDb()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

if (process.env.NODE_ENV === 'test') {
  // import('./controllers/testing.js').then(({ default: testingRouter}) => {
    app.use('/api/testing', testingRouter)
  // }).catch((err) => {
    // console.error('Failed to load testing router:', err)
  // })
}

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
