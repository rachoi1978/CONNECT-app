import mongoose from 'mongoose'

export interface IPost extends mongoose.Document {
  title: string
  content: string
  mainImage: string
  additionalImages?: string[]
  instagramUrl?: string
  author: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  views: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    additionalImages: [{
      type: String,
    }],
    instagramUrl: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
