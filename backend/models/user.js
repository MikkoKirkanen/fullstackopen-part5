import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Username minimum length is 3 characters'],
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.post('save', (error, doc, next) => {
  next(error)
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

export default User
