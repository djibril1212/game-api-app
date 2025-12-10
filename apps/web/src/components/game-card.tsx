import { Star, Clock, Trophy, Trash2, Edit, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/lib/api";

interface GameCardProps {
	game: Game;
	onEdit: (game: Game) => void;
	onDelete: (id: string) => void;
	onToggleFavorite: (id: string) => void;
}

export function GameCard({ game, onEdit, onDelete, onToggleFavorite }: GameCardProps) {
	return (
		<Card className="group relative overflow-hidden transition-all hover:shadow-lg">
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="line-clamp-2 text-lg">{game.titre}</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						className="shrink-0"
						onClick={() => onToggleFavorite(game._id)}
					>
						<Star
							className={`h-5 w-5 ${game.favori ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
						/>
					</Button>
				</div>
				<p className="text-sm text-muted-foreground">
					{game.developpeur} • {game.annee_sortie}
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-1">
					{game.genre.map((g) => (
						<Badge key={g} variant="secondary" className="text-xs">
							{g}
						</Badge>
					))}
				</div>
				<div className="flex flex-wrap gap-1">
					{game.plateforme.map((p) => (
						<Badge key={p} variant="outline" className="text-xs">
							<Gamepad2 className="mr-1 h-3 w-3" />
							{p}
						</Badge>
					))}
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					{game.metacritic_score !== undefined && (
						<span className="flex items-center gap-1">
							<Trophy className="h-4 w-4 text-green-500" />
							{game.metacritic_score}/100
						</span>
					)}
					<span className="flex items-center gap-1">
						<Clock className="h-4 w-4" />
						{game.temps_jeu_heures}h
					</span>
					{game.termine && (
						<Badge variant="default" className="bg-green-600">
							Terminé
						</Badge>
					)}
				</div>
				<div className="flex gap-2 pt-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => onEdit(game)}
					>
						<Edit className="mr-1 h-4 w-4" />
						Modifier
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => onDelete(game._id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
