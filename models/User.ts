import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  image?: string
  provider?: string
  likedPosts: string[]
  viewedPosts: string[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['google', 'kakao'],
    },
    likedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }],
    viewedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
