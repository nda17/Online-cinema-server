import { NestFactory } from '@nestjs/core'
import 'colors'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')

	if (process.env.NODE_ENV === 'development') {
		app.use(require('morgan')('dev'))
	}

	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})

	const PORT = process.env.PORT || 5000

	await app.listen(PORT, () =>
		console.log(
			`🚀🚀🚀 Server running in ${process.env.NODE_ENV} mode at http://localhost:${PORT} 🚀🚀🚀`
				.white.bgRed.bold
		)
	)
}
bootstrap()
