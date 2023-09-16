import { Router } from "express";
import { MovieController } from "../controllers/MovieController";
import { authenticateUser, checkRole } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", MovieController.getAllMovies);
router.post(
  "/",
  authenticateUser,
  checkRole("Admin"),
  MovieController.createMovie
);
router.put(
  "/:id",
  authenticateUser,
  checkRole("Admin"),
  MovieController.updateMovie
);
router.delete(
  "/:id",
  authenticateUser,
  checkRole("Admin"),
  MovieController.deleteMovie
);
router.post("/:id/rate", authenticateUser, MovieController.rateMovie);
router.get("/:id", MovieController.getMovieDetails);

export default router;
