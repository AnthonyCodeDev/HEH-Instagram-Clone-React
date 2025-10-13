import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

// Sample user data - in a real app, this would come from an API
const users = [
    {
        id: 1,
        name: "Lucas Hergz",
        username: "lucashergz20",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
        id: 2,
        name: "Tom Berton",
        username: "tomberton",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
        id: 3,
        name: "Lucie Marinier",
        username: "luciemarinier10",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
    },
    {
        id: 4,
        name: "Marie Marind",
        username: "mariemaring",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    {
        id: 5,
        name: "John Doe",
        username: "johndoe",
        avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400"
    },
    {
        id: 6,
        name: "Anna Smith",
        username: "annasmith",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    }
];

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers([]);
            return;
        }

        const lowercasedSearch = searchTerm.toLowerCase();
        const results = users.filter(
            user =>
                user.name.toLowerCase().includes(lowercasedSearch) ||
                user.username.toLowerCase().includes(lowercasedSearch)
        );
        setFilteredUsers(results);
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

                {isDropdownOpen && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.map((user) => (
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
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-stragram-primary text-white text-xs">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {isDropdownOpen && filteredUsers.length === 0 && searchTerm.trim() !== "" && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center">
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
