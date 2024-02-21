import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModel } from '@user/user.model'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		ConfigModule
	],
	providers: [UserService],
	controllers: [UserController]
})
export class UserModule {}
