import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) => {
	console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("game_collection_db");

// Schéma Zod pour la validation
export const gameValidationSchema = z.object({
	titre: z.string().min(1, "Le titre est requis"),
	genre: z.array(z.string()).min(1, "Au moins un genre est requis"),
	plateforme: z.array(z.string()).min(1, "Au moins une plateforme est requise"),
	editeur: z.string().min(1, "L'éditeur est requis"),
	developpeur: z.string().min(1, "Le développeur est requis"),
	annee_sortie: z.number().min(1970).max(new Date().getFullYear()),
	metacritic_score: z.number().min(0).max(100).optional(),
	temps_jeu_heures: z.number().min(0).default(0),
	termine: z.boolean().default(false),
	favori: z.boolean().default(false),
});

export const gameUpdateSchema = gameValidationSchema.partial();

export type GameInput = z.infer<typeof gameValidationSchema>;

// Interface pour le document MongoDB
export interface IGame extends Document {
	titre: string;
	genre: string[];
	plateforme: string[];
	editeur: string;
	developpeur: string;
	annee_sortie: number;
	metacritic_score?: number;
	temps_jeu_heures: number;
	termine: boolean;
	favori: boolean;
	date_ajout: Date;
	date_modification: Date;
}

// Schéma Mongoose
const gameSchema = new Schema<IGame>(
	{
		titre: { type: String, required: true },
		genre: { type: [String], required: true },
		plateforme: { type: [String], required: true },
		editeur: { type: String, required: true },
		developpeur: { type: String, required: true },
		annee_sortie: { type: Number, required: true },
		metacritic_score: { type: Number, min: 0, max: 100 },
		temps_jeu_heures: { type: Number, default: 0 },
		termine: { type: Boolean, default: false },
		favori: { type: Boolean, default: false },
	},
	{
		timestamps: {
			createdAt: "date_ajout",
			updatedAt: "date_modification",
		},
	}
);

// Indexation pour les recherches
gameSchema.index({ titre: "text" });
gameSchema.index({ genre: 1 });
gameSchema.index({ plateforme: 1 });
gameSchema.index({ favori: 1 });

export const Game = mongoose.model<IGame>("Game", gameSchema);

export { client };
