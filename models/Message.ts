import mongoose from 'mongoose'

export interface IMessage extends mongoose.Document {
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  text: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)

export default Message
