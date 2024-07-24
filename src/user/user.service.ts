import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import sendMail from 'src/nodemailer/useMail'
import { v4 as uuidv4 } from 'uuid'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) {
			throw new NotFoundException('User not found.')
		}

		return user
	}

	async adminUpdateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.UserModel.findById(_id)
		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email busy')
		}

		if (user) {
			user.email = dto.email

			if (dto.password) {
				const salt = await genSalt(10)
				user.password = await hash(dto.password, salt)
			}

			if (dto.isAdmin || dto.isAdmin === false) {
				user.isAdmin = dto.isAdmin
			}

			await user.save()

			return
		}

		throw new NotFoundException('User not found')
	}

	async resendingEmailConfirmationLink(email: string) {
		const user = await this.UserModel.findOne({ email })

		if (user) {
			const newActivationKey = uuidv4()

			user.activationKey = newActivationKey
			await user.save()

			const userId = String(user._id)

			const textSubject = 'Online-Cinema REPEAT confirmation email'
			const textTitle =
				'<h2>Someone created an Online-Cinema account with this E-mail. If it was you, click on the link to confirm your email:</h2>'
			const textLink = `<a href="${process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_HOST : process.env.DEV_HOST}/auth/confirmation-email/${userId}/${newActivationKey}">Email confirmation link</a>`
			sendMail(textSubject, textTitle, textLink, email)

			return
		}

		throw new NotFoundException('User not found')
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.UserModel.findById(_id)
		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email busy')
		}

		if (user) {
			user.email = dto.email

			if (dto.password) {
				const salt = await genSalt(10)
				user.password = await hash(dto.password, salt)
			}

			if (dto.isAdmin || dto.isAdmin === false) {
				user.isAdmin = dto.isAdmin
			}

			await user.save()

			return
		}

		throw new NotFoundException('User not found')
	}

	async getCount() {
		return this.UserModel.find().count().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({
				createdAt: 'desc'
			})
			.exec()
	}

	async delete(id: string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
		const { _id, favorites } = user

		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter(id => String(id) !== String(movieId))
				: [...favorites, movieId]
		})
	}

	async getFavoriteMovies(_id: Types.ObjectId) {
		return this.UserModel.findById(_id, 'favorites')
			.populate({ path: 'favorites', populate: { path: 'genres' } })
			.exec()
			.then(data => data.favorites)
	}
}
