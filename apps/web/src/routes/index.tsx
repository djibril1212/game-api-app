import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Download, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { GameForm } from "@/components/game-form";
import { GameFiltersBar } from "@/components/game-filters";
import { StatsCard, StatsDetail } from "@/components/stats-card";
import {
	fetchGames,
	fetchStats,
	fetchFilters,
	createGame,
	updateGame,
	deleteGame,
	toggleFavorite,
	exportGames,
	type Game,
	type GameInput,
	type GameStats,
	type Filters,
	type GameFilters,
} from "@/lib/api";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const [games, setGames] = useState<Game[]>([]);
	const [stats, setStats] = useState<GameStats | null>(null);
	const [availableFilters, setAvailableFilters] = useState<Filters | null>(null);
	const [filters, setFilters] = useState<GameFilters>({});
	const [loading, setLoading] = useState(true);
	const [statsLoading, setStatsLoading] = useState(true);
	const [formOpen, setFormOpen] = useState(false);
	const [editingGame, setEditingGame] = useState<Game | null>(null);
	const [showStats, setShowStats] = useState(false);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [gamesData, filtersData] = await Promise.all([
				fetchGames(filters),
				fetchFilters(),
			]);
			setGames(gamesData);
			setAvailableFilters(filtersData);
		} catch (error) {
			toast.error("Erreur lors du chargement des jeux");
		} finally {
			setLoading(false);
		}
	}, [filters]);

	const loadStats = useCallback(async () => {
		setStatsLoading(true);
		try {
			const statsData = await fetchStats();
			setStats(statsData);
		} catch (error) {
			toast.error("Erreur lors du chargement des statistiques");
		} finally {
			setStatsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		loadStats();
	}, [loadStats]);

	const handleCreate = async (data: GameInput) => {
		await createGame(data);
		toast.success("Jeu ajouté avec succès !");
		loadData();
		loadStats();
	};

	const handleUpdate = async (data: GameInput) => {
		if (!editingGame) return;
		await updateGame(editingGame._id, data);
		toast.success("Jeu modifié avec succès !");
		setEditingGame(null);
		loadData();
		loadStats();
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) return;
		try {
			await deleteGame(id);
			toast.success("Jeu supprimé !");
			loadData();
			loadStats();
		} catch (error) {
			toast.error("Erreur lors de la suppression");
		}
	};

	const handleToggleFavorite = async (id: string) => {
		try {
			await toggleFavorite(id);
			loadData();
			loadStats();
		} catch (error) {
			toast.error("Erreur lors de la mise à jour");
		}
	};

	const handleExport = async () => {
		try {
			await exportGames();
			toast.success("Export téléchargé !");
		} catch (error) {
			toast.error("Erreur lors de l'export");
		}
	};

	const handleEdit = (game: Game) => {
		setEditingGame(game);
		setFormOpen(true);
	};

	return (
		<div className="container mx-auto max-w-7xl px-4 py-6">
			{/* Header */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<Gamepad2 className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-2xl font-bold">Ma Collection de Jeux</h1>
						<p className="text-sm text-muted-foreground">
							{games.length} jeu{games.length > 1 ? "x" : ""} dans votre collection
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => setShowStats(!showStats)}>
						{showStats ? "Masquer stats" : "Voir stats"}
					</Button>
					<Button variant="outline" onClick={handleExport}>
						<Download className="mr-2 h-4 w-4" />
						Exporter
					</Button>
					<Button onClick={() => { setEditingGame(null); setFormOpen(true); }}>
						<Plus className="mr-2 h-4 w-4" />
						Ajouter un jeu
					</Button>
				</div>
			</div>

			{/* Stats */}
			{showStats && (
				<div className="mb-6 space-y-4">
					<StatsCard stats={stats} loading={statsLoading} />
					<StatsDetail stats={stats} />
				</div>
			)}

			{/* Filters */}
			<div className="mb-6">
				<GameFiltersBar
					filters={filters}
					availableFilters={availableFilters}
					onFilterChange={setFilters}
				/>
			</div>

			{/* Games Grid */}
			{loading ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="h-64 animate-pulse rounded-lg bg-muted"
						/>
					))}
				</div>
			) : games.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12">
					<Gamepad2 className="mb-4 h-16 w-16 text-muted-foreground" />
					<h2 className="text-xl font-semibold">Aucun jeu trouvé</h2>
					<p className="text-muted-foreground">
						{Object.keys(filters).length > 0
							? "Essayez de modifier vos filtres"
							: "Commencez par ajouter votre premier jeu !"}
					</p>
					{Object.keys(filters).length === 0 && (
						<Button
							className="mt-4"
							onClick={() => { setEditingGame(null); setFormOpen(true); }}
						>
							<Plus className="mr-2 h-4 w-4" />
							Ajouter un jeu
						</Button>
					)}
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{games.map((game) => (
						<GameCard
							key={game._id}
							game={game}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onToggleFavorite={handleToggleFavorite}
						/>
					))}
				</div>
			)}

			{/* Form Dialog */}
			<GameForm
				open={formOpen}
				onOpenChange={(open) => {
					setFormOpen(open);
					if (!open) setEditingGame(null);
				}}
				game={editingGame}
				onSubmit={editingGame ? handleUpdate : handleCreate}
			/>
		</div>
	);
}
