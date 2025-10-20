import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Type pour les utilisateurs renvoyés par l'API
interface User {
    id: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
}

// Type pour la réponse de l'API de recherche
interface SearchResponse {
    users: User[];
    page: number;
    size: number;
    hasMore: boolean;
    totalElements: number;
}

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fonction pour rechercher des utilisateurs via l'API
    const searchUsers = async (query: string, pageNum: number = 0, size: number = 10) => {
        if (!query || query.trim() === "") {
            setUsers([]);
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            // Construire l'URL avec les paramètres de recherche
            const url = `http://localhost:8081/users/search?query=${encodeURIComponent(query)}&page=${pageNum}&size=${size}`;

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };

            // Ajouter le token d'authentification s'il est disponible
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`);
            }

            const data: SearchResponse = await response.json();

            setUsers(data.users);
            setPage(data.page);
            setHasMore(data.hasMore);
            setTotalResults(data.totalElements);

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de rechercher des utilisateurs",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Déclencher la recherche après un délai pour éviter trop de requêtes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim() !== "") {
                searchUsers(searchTerm);
            } else {
                setUsers([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full bg-white rounded-2xl shadow-card p-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recherche</h2>

            <div className="relative" ref={dropdownRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Rechercher des personnes..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(e.target.value.trim() !== "");
                        }}
                        onFocus={() => {
                            if (searchTerm.trim() !== "") {
                                setIsDropdownOpen(true);
                            }
                        }}
                    />
                </div>

                {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {isLoading && (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-stragram-primary" />
                                <span className="ml-2 text-sm text-gray-500">Recherche en cours...</span>
                            </div>
                        )}

                        {!isLoading && users.length > 0 && users.map((user) => (
                            <Link
                                key={user.id}
                                to={`/u/${user.username}`}
                                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setSearchTerm("");
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"} alt={user.username} />
                                        <AvatarFallback className="bg-stragram-primary text-white text-xs">
                                            {user.username.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{user.username}</p>
                                        {user.bio && <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.bio}</p>}
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {!isLoading && users.length > 0 && hasMore && (
                            <div className="p-2 text-center border-t border-gray-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-stragram-primary hover:text-stragram-primary/80 w-full"
                                    onClick={() => searchUsers(searchTerm, page + 1)}
                                >
                                    Voir plus de résultats
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {isDropdownOpen && !isLoading && users.length === 0 && searchTerm.trim() !== "" && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center">
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
