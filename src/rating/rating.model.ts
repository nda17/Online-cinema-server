import { MovieModel } from '@movie/movie.model'
import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { UserModel } from '@user/user.model'
// eslint-disable-next-line
export interface RatingModel extends Base {}
// eslint-disable-next-line
export class RatingModel extends TimeStamps {
	@prop({ ref: () => UserModel })
	userId: Ref<UserModel>

	@prop({ ref: () => MovieModel })
	movieId: Ref<MovieModel>

	@prop()
	value: number
}
