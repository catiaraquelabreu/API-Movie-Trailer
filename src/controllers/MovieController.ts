import { Request, Response } from "express";
import Movie from "../models/MovieModel";
import { ApiError } from "../utils/ApiError";

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await Movie.find();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Não foi possível fazer fetch." });
    }
  }

  static async createMovie(req: Request, res: Response) {
    try {
      const { title, releaseDate, trailerLink, posterUrl, genres } = req.body;
      const movie = new Movie({
        title,
        releaseDate,
        trailerLink,
        posterUrl,
        genres,
      });
      await movie.save();
      res.status(201).json({ message: "Filme criado." });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno servidor" });
      }
    }
  }

  static async updateMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, releaseDate, trailerLink, posterUrl, genres } = req.body;

      const movie = await Movie.findByIdAndUpdate(id, {
        title,
        releaseDate,
        trailerLink,
        posterUrl,
        genres,
      });

      if (!movie) throw new ApiError(404, "File não encontrado");

      res.json({ message: "Filme atualizado!" });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno servidor" });
      }
    }
  }

  static async deleteMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.roles.includes("Admin")) {
        const movie = await Movie.findByIdAndDelete(id);

        if (!movie) throw new ApiError(404, "Filme não encontrado");

        res.json({ message: "Filme apagado!" });
      } else {
        throw new ApiError(
          403,
          "O utilizador não tem permissão para fazer isto."
        );
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno servidor" });
      }
    }
  }

  static async rateMovie(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      const movie = await Movie.findById(id);

      if (!movie) throw new ApiError(404, "Filme não encontrado");

      movie.ratings.push({ user: req.user!.userId, rating, comment });
      await movie.save();

      res.json({ message: "Filme avaliado!" });
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno servidor" });
      }
    }
  }

  static async getMovieDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id);
      if (!movie) throw new ApiError(404, "Filme não encontrado");

      const totalRatings = movie.ratings.length;
      const averageRating =
        totalRatings > 0
          ? movie.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            totalRatings
          : 0;

      const movieDetails = {
        _id: movie._id,
        title: movie.title,
        releaseDate: movie.releaseDate,
        trailerLink: movie.trailerLink,
        posterUrl: movie.posterUrl,
        genres: movie.genres,
        totalRatings,
        averageRating,
        ratings: movie.ratings,
      };

      res.json(movieDetails);
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro interno servidor" });
      }
    }
  }
}
