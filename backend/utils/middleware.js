import jwt from 'jsonwebtoken'
import logger from './logger.js'
import User from '../models/user.js'

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const auth = req.get('Authorization')
  req.token = auth?.startsWith('Bearer ') ? auth.replace('Bearer ', '') : null
  next()
}

const userExtractor = async (req, res, next) => {
  const token = jwt.verify(req.token, process.env.SECRET)
  if (!token?.id) {
    return res.status(401).json({ error: 'Token invalid' })
  }
  req.user = await User.findById(token.id)
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((e) => e.message)
    return res.status(400).json({ errors: errors })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(500).json({ error: 'Username is already in use' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  next(error)
}

export default {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}
