import "dotenv/config";
import cors from "cors";
import express from "express";
import { Game, gameValidationSchema, gameUpdateSchema } from "@game-api-app/db";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}),
);

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

// ============ CRUD OPERATIONS ============

// POST /api/games - Ajouter un nouveau jeu
app.post("/api/games", async (req, res) => {
	try {
		const validatedData = gameValidationSchema.parse(req.body);
		const game = new Game(validatedData);
		await game.save();
		res.status(201).json(game);
	} catch (error: any) {
		if (error.name === "ZodError") {
			res.status(400).json({ error: "Validation échouée", details: error.errors });
		} else {
			res.status(500).json({ error: "Erreur serveur", message: error.message });
		}
	}
});

// GET /api/games - Lister tous les jeux avec filtrage
app.get("/api/games", async (req, res) => {
	try {
		const { genre, plateforme, termine, favori, editeur, search, sort, order } = req.query;
		
		// Construction du filtre
		const filter: any = {};
		
		if (genre) {
			filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
		}
		if (plateforme) {
			filter.plateforme = { $in: Array.isArray(plateforme) ? plateforme : [plateforme] };
		}
		if (termine !== undefined) {
			filter.termine = termine === "true";
		}
		if (favori !== undefined) {
			filter.favori = favori === "true";
		}
		if (editeur) {
			filter.editeur = { $regex: editeur, $options: "i" };
		}
		if (search) {
			filter.$or = [
				{ titre: { $regex: search, $options: "i" } },
				{ developpeur: { $regex: search, $options: "i" } },
				{ editeur: { $regex: search, $options: "i" } },
			];
		}

		// Tri
		const sortField = (sort as string) || "date_ajout";
		const sortOrder = order === "asc" ? 1 : -1;

		const games = await Game.find(filter).sort({ [sortField]: sortOrder });
		res.json(games);
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// GET /api/games/:id - Obtenir un jeu spécifique
app.get("/api/games/:id", async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);
		if (!game) {
			return res.status(404).json({ error: "Jeu non trouvé" });
		}
		res.json(game);
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// PUT /api/games/:id - Modifier un jeu
app.put("/api/games/:id", async (req, res) => {
	try {
		const validatedData = gameUpdateSchema.parse(req.body);
		const game = await Game.findByIdAndUpdate(
			req.params.id,
			{ ...validatedData, date_modification: new Date() },
			{ new: true, runValidators: true }
		);
		if (!game) {
			return res.status(404).json({ error: "Jeu non trouvé" });
		}
		res.json(game);
	} catch (error: any) {
		if (error.name === "ZodError") {
			res.status(400).json({ error: "Validation échouée", details: error.errors });
		} else {
			res.status(500).json({ error: "Erreur serveur", message: error.message });
		}
	}
});

// DELETE /api/games/:id - Supprimer un jeu
app.delete("/api/games/:id", async (req, res) => {
	try {
		const game = await Game.findByIdAndDelete(req.params.id);
		if (!game) {
			return res.status(404).json({ error: "Jeu non trouvé" });
		}
		res.json({ message: "Jeu supprimé avec succès", game });
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// ============ FONCTIONNALITÉS AVANCÉES ============

// POST /api/games/:id/favorite - Toggle favori
app.post("/api/games/:id/favorite", async (req, res) => {
	try {
		const game = await Game.findById(req.params.id);
		if (!game) {
			return res.status(404).json({ error: "Jeu non trouvé" });
		}
		game.favori = !game.favori;
		await game.save();
		res.json(game);
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// GET /api/stats - Statistiques de la collection
app.get("/api/stats", async (_req, res) => {
	try {
		const totalGames = await Game.countDocuments();
		const gamesCompleted = await Game.countDocuments({ termine: true });
		const gamesFavorites = await Game.countDocuments({ favori: true });
		
		const totalPlayTime = await Game.aggregate([
			{ $group: { _id: null, total: { $sum: "$temps_jeu_heures" } } }
		]);
		
		const avgMetacritic = await Game.aggregate([
			{ $match: { metacritic_score: { $exists: true, $ne: null } } },
			{ $group: { _id: null, avg: { $avg: "$metacritic_score" } } }
		]);
		
		const genreStats = await Game.aggregate([
			{ $unwind: "$genre" },
			{ $group: { _id: "$genre", count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		]);
		
		const platformStats = await Game.aggregate([
			{ $unwind: "$plateforme" },
			{ $group: { _id: "$plateforme", count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		]);
		
		const yearStats = await Game.aggregate([
			{ $group: { _id: "$annee_sortie", count: { $sum: 1 } } },
			{ $sort: { _id: -1 } }
		]);

		res.json({
			total_jeux: totalGames,
			jeux_termines: gamesCompleted,
			jeux_favoris: gamesFavorites,
			temps_jeu_total: totalPlayTime[0]?.total || 0,
			score_metacritic_moyen: Math.round(avgMetacritic[0]?.avg || 0),
			stats_par_genre: genreStats,
			stats_par_plateforme: platformStats,
			stats_par_annee: yearStats,
		});
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// GET /api/games/export - Export des données
app.get("/api/export", async (_req, res) => {
	try {
		const games = await Game.find().lean();
		res.setHeader("Content-Type", "application/json");
		res.setHeader("Content-Disposition", "attachment; filename=games_export.json");
		res.json({
			export_date: new Date().toISOString(),
			total_games: games.length,
			games: games,
		});
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

// GET /api/filters - Obtenir les valeurs uniques pour les filtres
app.get("/api/filters", async (_req, res) => {
	try {
		const genres = await Game.distinct("genre");
		const plateformes = await Game.distinct("plateforme");
		const editeurs = await Game.distinct("editeur");
		const developpeurs = await Game.distinct("developpeur");
		
		res.json({
			genres: genres.sort(),
			plateformes: plateformes.sort(),
			editeurs: editeurs.sort(),
			developpeurs: developpeurs.sort(),
		});
	} catch (error: any) {
		res.status(500).json({ error: "Erreur serveur", message: error.message });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
