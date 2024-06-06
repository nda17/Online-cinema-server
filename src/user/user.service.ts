import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) throw new NotFoundException('User not found.')

		return user
	}

	async byIdStatusConfirmationEmail(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) throw new NotFoundException('User not found.')

		return { email: user.email, isActivated: user.isActivated }
	}

	async updateStatusConfirmationEmail(_id: string) {
		const user = await this.UserModel.findById(_id)

		if (user && !user.isActivated) {
			user.isActivated = true

			await user.save()
			return
		}

		throw new NotFoundException('Email confirmation error')
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

			if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

			if (dto.isSubscription || dto.isSubscription === false)
				user.isSubscription = dto.isSubscription

			await user.save()
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

			if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

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
