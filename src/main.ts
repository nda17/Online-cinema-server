import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.enableCors() //Enable CORS

	const PORT = process.env.PORT || 5000

	await app.listen(PORT, () =>
		console.log(
			`🚀🚀🚀 Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT} 🚀🚀🚀`
		)
	)
}
bootstrap()
