const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Types
export interface Game {
	_id: string;
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
	date_ajout: string;
	date_modification: string;
}

export interface GameInput {
	titre: string;
	genre: string[];
	plateforme: string[];
	editeur: string;
	developpeur: string;
	annee_sortie: number;
	metacritic_score?: number;
	temps_jeu_heures: number;
	termine: boolean;
	favori?: boolean;
}

export interface GameStats {
	total_jeux: number;
	jeux_termines: number;
	jeux_favoris: number;
	temps_jeu_total: number;
	score_metacritic_moyen: number;
	stats_par_genre: { _id: string; count: number }[];
	stats_par_plateforme: { _id: string; count: number }[];
	stats_par_annee: { _id: number; count: number }[];
}

export interface Filters {
	genres: string[];
	plateformes: string[];
	editeurs: string[];
	developpeurs: string[];
}

export interface GameFilters {
	genre?: string;
	plateforme?: string;
	termine?: boolean;
	favori?: boolean;
	search?: string;
	sort?: string;
	order?: "asc" | "desc";
}

// API Functions
export async function fetchGames(filters: GameFilters = {}): Promise<Game[]> {
	const params = new URLSearchParams();
	Object.entries(filters).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			params.append(key, String(value));
		}
	});
	const response = await fetch(`${API_URL}/api/games?${params}`);
	if (!response.ok) throw new Error("Erreur lors de la récupération des jeux");
	return response.json();
}

export async function fetchGame(id: string): Promise<Game> {
	const response = await fetch(`${API_URL}/api/games/${id}`);
	if (!response.ok) throw new Error("Jeu non trouvé");
	return response.json();
}

export async function createGame(game: GameInput): Promise<Game> {
	const response = await fetch(`${API_URL}/api/games`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(game),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erreur lors de la création");
	}
	return response.json();
}

export async function updateGame(id: string, game: Partial<GameInput>): Promise<Game> {
	const response = await fetch(`${API_URL}/api/games/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(game),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Erreur lors de la mise à jour");
	}
	return response.json();
}

export async function deleteGame(id: string): Promise<void> {
	const response = await fetch(`${API_URL}/api/games/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Erreur lors de la suppression");
}

export async function toggleFavorite(id: string): Promise<Game> {
	const response = await fetch(`${API_URL}/api/games/${id}/favorite`, {
		method: "POST",
	});
	if (!response.ok) throw new Error("Erreur lors du toggle favori");
	return response.json();
}

export async function fetchStats(): Promise<GameStats> {
	const response = await fetch(`${API_URL}/api/stats`);
	if (!response.ok) throw new Error("Erreur lors de la récupération des stats");
	return response.json();
}

export async function fetchFilters(): Promise<Filters> {
	const response = await fetch(`${API_URL}/api/filters`);
	if (!response.ok) throw new Error("Erreur lors de la récupération des filtres");
	return response.json();
}

export async function exportGames(): Promise<void> {
	const response = await fetch(`${API_URL}/api/export`);
	if (!response.ok) throw new Error("Erreur lors de l'export");
	const blob = await response.blob();
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "games_export.json";
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
	a.remove();
}
