import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import express from 'express'
import User from '../models/user.js'

const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = user?.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : false

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET,
    { expiresIn: 3600 })

  res.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
