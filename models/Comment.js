import mongoose from 'mongoose'

const CommentScheme = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		postId: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String,
	},
	{
		timestamps: true,
	}
)

export default mongoose.model('Comment', CommentScheme)
