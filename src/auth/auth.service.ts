import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from '@user/dto/update-user.dto'

import { compare, genSalt, hash } from 'bcryptjs'
import generator from 'generate-password-ts'
import { InjectModel } from 'nestjs-typegoose'
import { v4 as uuidv4 } from 'uuid'
import sendMail from '../nodemailer/useMail'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async getById(_id: string) {
		const user = await this.UserModel.findById(_id)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async confirmationEmail(_id: string) {
		const user = await this.UserModel.findById(_id)

		if (user && !user.isActivated) {
			user.isActivated = true

			await user.save()
			return
		}

		throw new NotFoundException('Email confirmation error')
	}

	async restorePassword(dto: UpdateUserDto) {
		const user = await this.UserModel.findOne({ email: dto.email })

		if (user) {
			const newPassword = generator.generate({
				length: 6,
				uppercase: true,
				lowercase: true,
				numbers: true,
				strict: true
			})

			const salt = await genSalt(10)
			user.password = await hash(newPassword, salt)
			await user.save()

			const textSubject = 'Online-cinema recovering your password'
			const textTitle = `<h2>Your temporary password: <span style="color: #FF2400">${newPassword}</span> , please change your password after logging in.</h2>`
			const textLink = `<a href="${process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_HOST : process.env.DEV_HOST}/auth">Link to login page</a>`
			sendMail(textSubject, textTitle, textLink, dto.email)

			return
		}

		throw new NotFoundException('User not found')
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Please sign in.')
		}

		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) {
			throw new UnauthorizedException('Invalid token or expired.')
		}

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })
		if (oldUser) {
			throw new BadRequestException(
				'The user is already registered in the system.'
			)
		}

		const salt = await genSalt(10)

		const activationKey = uuidv4()

		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
			activationKey
		})

		const user = await newUser.save()

		const userId = String(user._id)

		const textSubject = 'Online-Cinema Email confirmation'
		const textTitle =
			'<h2>Someone created an Online-Cinema account with this E-mail. If it was you, click on the link to confirm your email:</h2>'
		const textLink = `<a href="${process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_HOST : process.env.DEV_HOST}/auth/confirmation-email/${userId}/${activationKey}">Email confirmation link</a>`
		sendMail(textSubject, textTitle, textLink, dto.email)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) {
			throw new UnauthorizedException('User is not found!')
		}

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) {
			throw new UnauthorizedException('Incorrect password!')
		}

		return user
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '7d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '15m'
		})

		return { refreshToken, accessToken }
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
			password: user.password,
			activationKey: user.activationKey,
			isActivated: user.isActivated,
			isAdmin: user.isAdmin,
			isSubscription: user.isSubscription
		}
	}
}
