import mongoose from 'mongoose'

const blogSchema = mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'] },
  author: String,
  url: { type: String, required: [true, 'Url is required'] },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.user?.blogs
  },
})

export default Blog
