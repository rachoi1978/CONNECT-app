import mongoose from 'mongoose'

export interface IConversation extends mongoose.Document {
  participants: mongoose.Types.ObjectId[]
  lastMessage?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
)

const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)

export default Conversation
