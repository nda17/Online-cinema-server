import {
	Body,
	Controller,
	HttpCode,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UpdateUserDto } from '@user/dto/update-user.dto'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}

	@Post('restore-password')
	@HttpCode(200)
	async restorePassword(@Body() dto: UpdateUserDto) {
		return this.AuthService.restorePassword(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('login')
	@HttpCode(200)
	async login(@Body() dto: AuthDto) {
		return this.AuthService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('login/access-token')
	@HttpCode(200)
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.AuthService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@Post('register')
	@HttpCode(200)
	async register(@Body() dto: AuthDto) {
		return this.AuthService.register(dto)
	}

	@Patch('confirmation-email/:id')
	@HttpCode(200)
	async confirmationEmail(@Body() _id: string) {
		return this.AuthService.confirmationEmail(_id)
	}

	@Post('confirmation-email/:id')
	@HttpCode(200)
	async getById(@Body() _id: string) {
		return this.AuthService.getById(_id)
	}
}
