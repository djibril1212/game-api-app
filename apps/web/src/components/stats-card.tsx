import { Gamepad2, Trophy, Clock, Star, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameStats } from "@/lib/api";

interface StatsCardProps {
	stats: GameStats | null;
	loading: boolean;
}

export function StatsCard({ stats, loading }: StatsCardProps) {
	if (loading) {
		return (
			<Card>
				<CardContent className="py-6">
					<p className="text-center text-muted-foreground">Chargement des statistiques...</p>
				</CardContent>
			</Card>
		);
	}

	if (!stats) {
		return null;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Jeux</CardTitle>
					<Gamepad2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.total_jeux}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Terminés</CardTitle>
					<Trophy className="h-4 w-4 text-green-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.jeux_termines}</div>
					<p className="text-xs text-muted-foreground">
						{stats.total_jeux > 0
							? `${Math.round((stats.jeux_termines / stats.total_jeux) * 100)}%`
							: "0%"}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Favoris</CardTitle>
					<Star className="h-4 w-4 text-yellow-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.jeux_favoris}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Temps de jeu</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.temps_jeu_total}h</div>
					<p className="text-xs text-muted-foreground">
						{Math.round(stats.temps_jeu_total / 24)} jours
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Score moyen</CardTitle>
					<BarChart3 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{stats.score_metacritic_moyen}/100
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

interface StatsDetailProps {
	stats: GameStats | null;
}

export function StatsDetail({ stats }: StatsDetailProps) {
	if (!stats) return null;

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">Jeux par genre</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{stats.stats_par_genre.slice(0, 5).map((item) => (
							<div key={item._id} className="flex items-center justify-between">
								<span className="text-sm">{item._id}</span>
								<div className="flex items-center gap-2">
									<div
										className="h-2 bg-primary rounded"
										style={{
											width: `${Math.min((item.count / stats.total_jeux) * 100, 100)}px`,
										}}
									/>
									<span className="text-sm text-muted-foreground w-8">
										{item.count}
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">Jeux par plateforme</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{stats.stats_par_plateforme.slice(0, 5).map((item) => (
							<div key={item._id} className="flex items-center justify-between">
								<span className="text-sm">{item._id}</span>
								<div className="flex items-center gap-2">
									<div
										className="h-2 bg-blue-500 rounded"
										style={{
											width: `${Math.min((item.count / stats.total_jeux) * 100, 100)}px`,
										}}
									/>
									<span className="text-sm text-muted-foreground w-8">
										{item.count}
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
