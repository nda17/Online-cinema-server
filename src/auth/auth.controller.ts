import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
//eslint-disable-next-line
import { IdValidationPipe } from '@pipes/id.validation.pipe'
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
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.AuthService.login(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.AuthService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.AuthService.register(dto)
	}

	@Get('confirmation-email/:id')
	@HttpCode(200)
	async getStatusConfirmationEmail(@Param('id', IdValidationPipe) id: string) {
		return this.AuthService.getStatusConfirmationEmail(id)
	}

	@Patch('confirmation-email/:id')
	@HttpCode(200)
	async confirmationEmail(@Param('id', IdValidationPipe) id: string) {
		return this.AuthService.confirmationEmail(id)
	}
}
