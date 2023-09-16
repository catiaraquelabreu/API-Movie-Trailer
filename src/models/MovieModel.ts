import mongoose from "mongoose";

interface IRating {
  user: string;
  rating: number;
  comment?: string;
}

interface IMovie extends mongoose.Document {
  title: string;
  releaseDate: Date;
  trailerLink: string;
  posterUrl: string;
  genres: string[];
  ratings: IRating[];
}

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  trailerLink: { type: String, required: true },
  posterUrl: { type: String, required: true },
  genres: [{ type: String, required: true }],
  ratings: [{ user: String, rating: Number, comment: String }],
});

const Movie = mongoose.model<IMovie>("Movie", MovieSchema);
export default Movie;
