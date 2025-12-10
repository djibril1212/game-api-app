import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import type { Game, GameInput } from "@/lib/api";

interface GameFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	game?: Game | null;
	onSubmit: (data: GameInput) => Promise<void>;
}

const GENRES_COMMON = [
	"Action",
	"Aventure",
	"RPG",
	"FPS",
	"Sport",
	"Course",
	"Stratégie",
	"Simulation",
	"Puzzle",
	"Horreur",
	"Plateforme",
	"Combat",
	"MMORPG",
	"Indie",
];

const PLATFORMS_COMMON = [
	"PC",
	"PlayStation 5",
	"PlayStation 4",
	"Xbox Series X/S",
	"Xbox One",
	"Nintendo Switch",
	"Mobile",
];

export function GameForm({ open, onOpenChange, game, onSubmit }: GameFormProps) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<GameInput>({
		titre: "",
		genre: [],
		plateforme: [],
		editeur: "",
		developpeur: "",
		annee_sortie: new Date().getFullYear(),
		metacritic_score: undefined,
		temps_jeu_heures: 0,
		termine: false,
	});

	useEffect(() => {
		if (game) {
			setFormData({
				titre: game.titre,
				genre: game.genre,
				plateforme: game.plateforme,
				editeur: game.editeur,
				developpeur: game.developpeur,
				annee_sortie: game.annee_sortie,
				metacritic_score: game.metacritic_score,
				temps_jeu_heures: game.temps_jeu_heures,
				termine: game.termine,
			});
		} else {
			setFormData({
				titre: "",
				genre: [],
				plateforme: [],
				editeur: "",
				developpeur: "",
				annee_sortie: new Date().getFullYear(),
				metacritic_score: undefined,
				temps_jeu_heures: 0,
				termine: false,
			});
		}
	}, [game, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
			onOpenChange(false);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const toggleArrayItem = (array: string[], item: string) => {
		return array.includes(item)
			? array.filter((i) => i !== item)
			: [...array, item];
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{game ? "Modifier le jeu" : "Ajouter un jeu"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="titre">Titre *</Label>
						<Input
							id="titre"
							value={formData.titre}
							onChange={(e) =>
								setFormData({ ...formData, titre: e.target.value })
							}
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="editeur">Éditeur *</Label>
							<Input
								id="editeur"
								value={formData.editeur}
								onChange={(e) =>
									setFormData({ ...formData, editeur: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="developpeur">Développeur *</Label>
							<Input
								id="developpeur"
								value={formData.developpeur}
								onChange={(e) =>
									setFormData({ ...formData, developpeur: e.target.value })
								}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Genres *</Label>
						<div className="flex flex-wrap gap-2">
							{GENRES_COMMON.map((genre) => (
								<Button
									key={genre}
									type="button"
									variant={formData.genre.includes(genre) ? "default" : "outline"}
									size="sm"
									onClick={() =>
										setFormData({
											...formData,
											genre: toggleArrayItem(formData.genre, genre),
										})
									}
								>
									{genre}
								</Button>
							))}
						</div>
						{formData.genre.length === 0 && (
							<p className="text-xs text-destructive">
								Sélectionnez au moins un genre
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>Plateformes *</Label>
						<div className="flex flex-wrap gap-2">
							{PLATFORMS_COMMON.map((platform) => (
								<Button
									key={platform}
									type="button"
									variant={
										formData.plateforme.includes(platform) ? "default" : "outline"
									}
									size="sm"
									onClick={() =>
										setFormData({
											...formData,
											plateforme: toggleArrayItem(formData.plateforme, platform),
										})
									}
								>
									{platform}
								</Button>
							))}
						</div>
						{formData.plateforme.length === 0 && (
							<p className="text-xs text-destructive">
								Sélectionnez au moins une plateforme
							</p>
						)}
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="annee_sortie">Année de sortie *</Label>
							<Input
								id="annee_sortie"
								type="number"
								min="1970"
								max={new Date().getFullYear()}
								value={formData.annee_sortie}
								onChange={(e) =>
									setFormData({
										...formData,
										annee_sortie: parseInt(e.target.value) || 0,
									})
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="metacritic_score">Score Metacritic</Label>
							<Input
								id="metacritic_score"
								type="number"
								min="0"
								max="100"
								value={formData.metacritic_score ?? ""}
								onChange={(e) =>
									setFormData({
										...formData,
										metacritic_score: e.target.value
											? parseInt(e.target.value)
											: undefined,
									})
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="temps_jeu_heures">Temps de jeu (h)</Label>
							<Input
								id="temps_jeu_heures"
								type="number"
								min="0"
								value={formData.temps_jeu_heures}
								onChange={(e) =>
									setFormData({
										...formData,
										temps_jeu_heures: parseInt(e.target.value) || 0,
									})
								}
							/>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="termine"
							checked={formData.termine}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, termine: !!checked })
							}
						/>
						<Label htmlFor="termine">Jeu terminé</Label>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Annuler
						</Button>
						<Button
							type="submit"
							disabled={
								loading ||
								formData.genre.length === 0 ||
								formData.plateforme.length === 0
							}
						>
							{loading ? "Enregistrement..." : game ? "Modifier" : "Ajouter"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
