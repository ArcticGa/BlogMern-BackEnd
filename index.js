import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'

import {
	CommentController,
	PostController,
	UserController,
} from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import {
	loginValidation,
	postCreateCommentValidation,
	postCreateValidation,
	registerValidation,
} from './validations.js'

mongoose
	.connect(
		'mongodb+srv://admin:wwwwww@database.kg8eltp.mongodb.net/blogmern?retryWrites=true&w=majority&appName=database'
	)
	.then(() => {
		console.log('DB OK')
	})
	.catch(err => {
		console.log('DB is error', err)
	})

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	handleValidationErrors,
	PostController.update
)

app.post(
	'/comments',
	checkAuth,
	postCreateCommentValidation,
	handleValidationErrors,
	CommentController.create
)
app.get('/comments', CommentController.getAllComments)
app.get('/comments/:id', CommentController.getPostComments)
app.delete('/comments/:id', checkAuth, CommentController.deletePostComments)

//Start localhost on port 4444
app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server OK')
})
