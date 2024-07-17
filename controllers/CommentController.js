import CommentModel from '../models/Comment.js'

export const create = async (req, res) => {
	try {
		const doc = new CommentModel({
			text: req.body.text,
			postId: req.body.postId,
			user: req.userId,
		})

		const comment = await doc.save()
		res.json(comment)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать комментарий',
		})
	}
}

export const getAllComments = async (req, res) => {
	try {
		const comments = await CommentModel.find()
			.populate({
				path: 'user',
				select: ['fullName', 'avatarUrl'],
			})
			.exec()

		res.json(comments)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить комментарии',
		})
	}
}

export const getPostComments = async (req, res) => {
	try {
		const postIdent = req.params.id

		CommentModel.find({ postId: postIdent })
			.populate('user')
			.then(doc => res.json(doc))
			.catch(err => res.status(404).json({ message: 'Комментарии не найдены' }))
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статью',
		})
	}
}

export const deletePostComments = async (req, res) => {
	try {
		const postIdent = req.params.id

		CommentModel.deleteMany({
			postId: postIdent,
		})
			.then(doc => res.json(doc))
			.catch(err => res.status(404).json({ message: 'Комментарии не найдены' }))
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить комментарии',
		})
	}
}
