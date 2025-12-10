import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Filters, GameFilters } from "@/lib/api";

interface GameFiltersProps {
	filters: GameFilters;
	availableFilters: Filters | null;
	onFilterChange: (filters: GameFilters) => void;
}

export function GameFiltersBar({
	filters,
	availableFilters,
	onFilterChange,
}: GameFiltersProps) {
	const updateFilter = (key: keyof GameFilters, value: string | boolean | undefined) => {
		onFilterChange({
			...filters,
			[key]: value === "all" ? undefined : value,
		});
	};

	const clearFilters = () => {
		onFilterChange({});
	};

	const hasActiveFilters = Object.values(filters).some(
		(v) => v !== undefined && v !== ""
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Rechercher un jeu..."
						value={filters.search || ""}
						onChange={(e) => updateFilter("search", e.target.value)}
						className="pl-9"
					/>
				</div>
				<div className="flex flex-wrap gap-2">
					<Select
						value={filters.genre || "all"}
						onValueChange={(value) => updateFilter("genre", value)}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Genre" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tous genres</SelectItem>
							{availableFilters?.genres.map((genre) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filters.plateforme || "all"}
						onValueChange={(value) => updateFilter("plateforme", value)}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue placeholder="Plateforme" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Toutes plateformes</SelectItem>
							{availableFilters?.plateformes.map((platform) => (
								<SelectItem key={platform} value={platform}>
									{platform}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={
							filters.termine === undefined
								? "all"
								: filters.termine
									? "true"
									: "false"
						}
						onValueChange={(value) =>
							updateFilter(
								"termine",
								value === "all" ? undefined : value === "true"
							)
						}
					>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Statut" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tous statuts</SelectItem>
							<SelectItem value="true">Terminé</SelectItem>
							<SelectItem value="false">Non terminé</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={
							filters.favori === undefined
								? "all"
								: filters.favori
									? "true"
									: "false"
						}
						onValueChange={(value) =>
							updateFilter(
								"favori",
								value === "all" ? undefined : value === "true"
							)
						}
					>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Favoris" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tous</SelectItem>
							<SelectItem value="true">Favoris</SelectItem>
							<SelectItem value="false">Non favoris</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={filters.sort || "date_ajout"}
						onValueChange={(value) => updateFilter("sort", value)}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Trier par" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date_ajout">Date d'ajout</SelectItem>
							<SelectItem value="titre">Titre</SelectItem>
							<SelectItem value="annee_sortie">Année</SelectItem>
							<SelectItem value="metacritic_score">Score</SelectItem>
							<SelectItem value="temps_jeu_heures">Temps de jeu</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={filters.order || "desc"}
						onValueChange={(value) =>
							updateFilter("order", value as "asc" | "desc")
						}
					>
						<SelectTrigger className="w-[100px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="desc">Desc</SelectItem>
							<SelectItem value="asc">Asc</SelectItem>
						</SelectContent>
					</Select>

					{hasActiveFilters && (
						<Button variant="ghost" size="icon" onClick={clearFilters}>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
