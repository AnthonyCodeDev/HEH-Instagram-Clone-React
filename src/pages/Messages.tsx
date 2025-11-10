import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Loader2, AlertCircle, Wifi, WifiOff, Trash2 } from "lucide-react";
import { messageService } from "@/services/messageService";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ConversationDto, MessageDto, ConversationDeletedNotification } from "@/types/message";
import { userService } from "@/services/userService";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

// Type pour les utilisateurs de la recherche
interface SearchUser {
    id: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
}

const Messages = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [messages, setMessages] = useState<Record<string, MessageDto[]>>({});
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, [navigate]);
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const [backendAvailable, setBackendAvailable] = useState(false); // Commencer à false, sera mis à true si le backend répond
    const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]); // Résultats de recherche d'utilisateurs
    const [isSearching, setIsSearching] = useState(false); // État de chargement de la recherche
    const [showSearchDropdown, setShowSearchDropdown] = useState(false); // Afficher le dropdown de recherche
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();
    const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
    const searchDropdownRef = useRef<HTMLDivElement>(null);

    // Fonction pour rechercher des utilisateurs
    const handleSearchUsers = async (query: string) => {
        if (!query || query.trim() === "") {
            setSearchUsers([]);
            setShowSearchDropdown(false);
            return;
        }

        try {
            setIsSearching(true);
            const token = localStorage.getItem('token');
            const url = `http://localhost:8081/users/search?query=${encodeURIComponent(query)}&page=0&size=10`;

            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const data = await response.json();
            setSearchUsers(data.users || []);
            setShowSearchDropdown(true);
        } catch (error) {
            console.error('Erreur recherche utilisateurs:', error);
            setSearchUsers([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce pour la recherche
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim() !== "") {
                handleSearchUsers(searchQuery);
            } else {
                setSearchUsers([]);
                setShowSearchDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Ouvrir une conversation avec un utilisateur depuis la recherche
    const handleOpenConversationWithUser = async (username: string) => {
        setShowSearchDropdown(false);
        setSearchQuery("");
        navigate(`/messages?u=${username}`);
    };

    // Callback pour recevoir les messages WebSocket
    const handleMessageReceived = useCallback((message: MessageDto) => {
        console.log('📨 New message received:', message);

        // Vérifier si c'est notre propre message (déjà affiché en optimiste)
        const isOwnMessage = message.senderId === currentUserId;

        // Ajouter ou remplacer le message dans la conversation
        setMessages(prev => {
            const existingMessages = prev[message.conversationId] || [];

            if (isOwnMessage) {
                // Si c'est notre message, remplacer le message temporaire par le vrai
                // Trouver un message temporaire récent (moins de 5 secondes) avec le même contenu
                const tempMessageIndex = existingMessages.findIndex(msg =>
                    msg.id.startsWith('temp-') &&
                    msg.content === message.content &&
                    msg.senderId === currentUserId
                );

                if (tempMessageIndex !== -1) {
                    // Remplacer le message temporaire par le vrai
                    const updatedMessages = [...existingMessages];
                    updatedMessages[tempMessageIndex] = message;
                    return {
                        ...prev,
                        [message.conversationId]: updatedMessages
                    };
                }
            }

            // Vérifier si le message existe déjà (par ID)
            const messageExists = existingMessages.some(msg => msg.id === message.id);
            if (messageExists) {
                console.log('⚠️ Message déjà présent, ignoré');
                return prev;
            }

            // Ajouter le nouveau message
            return {
                ...prev,
                [message.conversationId]: [...existingMessages, message]
            };
        });

        // Mettre à jour ou créer la conversation dans la liste
        setConversations(prev => {
            // Chercher la conversation par son ID OU par l'autre utilisateur
            const conversationByIdIndex = prev.findIndex(conv => conv.id === message.conversationId);
            const conversationByUserIndex = message.senderId !== currentUserId
                ? prev.findIndex(conv => conv.otherUserId === message.senderId)
                : -1;

            // Si la conversation existe (par ID ou par utilisateur)
            if (conversationByIdIndex !== -1 || conversationByUserIndex !== -1) {
                const existingIndex = conversationByIdIndex !== -1 ? conversationByIdIndex : conversationByUserIndex;
                const existingConv = prev[existingIndex];

                // Si l'ID change et que c'est la conversation active, mettre à jour activeConversationId
                if (existingConv.id !== message.conversationId && existingConv.id === activeConversationId) {
                    console.log('🔄 Mise à jour de l\'ID de la conversation active:', existingConv.id, '→', message.conversationId);
                    setActiveConversationId(message.conversationId);
                }

                // La conversation existe, la mettre à jour
                const updated = prev.map((conv, index) => {
                    if (index === existingIndex) {
                        return {
                            ...conv,
                            id: message.conversationId, // Mettre à jour l'ID si nécessaire
                            lastMessage: message,
                            unreadCount: message.senderId !== currentUserId ? conv.unreadCount + 1 : conv.unreadCount,
                            updatedAt: message.sentAt
                        };
                    }
                    return conv;
                });
                return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            } else if (message.senderId !== currentUserId) {
                // La conversation n'existe pas encore ET ce n'est pas nous qui envoyons, la créer
                console.log('🆕 Nouvelle conversation détectée, création...');

                // Créer une nouvelle conversation avec les infos du message
                const newConversation: ConversationDto = {
                    id: message.conversationId,
                    otherUserId: message.senderId,
                    otherUserUsername: message.senderUsername,
                    otherUserAvatarUrl: message.senderAvatarUrl,
                    lastMessage: message,
                    unreadCount: 1,
                    createdAt: message.sentAt,
                    updatedAt: message.sentAt
                };

                return [newConversation, ...prev].sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            }

            // Si c'est nous qui envoyons à quelqu'un qui n'est pas dans notre liste, ne rien faire
            // (la conversation sera créée par le backend lors de l'envoi)
            return prev;
        });

        // Si la conversation est active, marquer comme lu
        if (message.conversationId === activeConversationId && message.senderId !== currentUserId) {
            messageService.markAsRead(message.conversationId).catch(console.error);
            // Pas besoin de déclencher l'événement ici car le message est marqué comme lu
        } else if (message.senderId !== currentUserId) {
            // Si le message n'est pas lu, déclencher l'événement pour mettre à jour le compteur
            window.dispatchEvent(new CustomEvent('unreadMessagesChanged'));
        }
    }, [activeConversationId, currentUserId]);

    // Callback pour recevoir les notifications de frappe
    const handleTypingReceived = useCallback((typing: any) => {
        console.log('⌨️ Typing notification:', typing);

        const { userId, conversationId } = typing;

        // Effacer le timeout précédent si existe
        if (typingTimeoutRef.current[userId]) {
            clearTimeout(typingTimeoutRef.current[userId]);
        }

        // Marquer l'utilisateur comme en train d'écrire
        setTypingUsers(prev => ({ ...prev, [conversationId]: true }));

        // Supprimer après 3 secondes
        typingTimeoutRef.current[userId] = setTimeout(() => {
            setTypingUsers(prev => ({ ...prev, [conversationId]: false }));
        }, 3000);
    }, []);

    // Callback pour recevoir les notifications de suppression de conversation
    const handleConversationDeleted = useCallback((notification: any) => {
        console.log('🗑️ Conversation deleted notification:', notification);

        const { conversationId } = notification;

        // Retirer la conversation de la liste
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));

        // Retirer les messages de cette conversation
        setMessages(prev => {
            const newMessages = { ...prev };
            delete newMessages[conversationId];
            return newMessages;
        });

        // Si c'était la conversation active, la désélectionner
        if (activeConversationId === conversationId) {
            setActiveConversationId(null);
        }

        // Mettre à jour le compteur
        window.dispatchEvent(new CustomEvent('unreadMessagesChanged'));

        console.log('✅ Conversation supprimée localement suite à notification WebSocket');
    }, [activeConversationId]);

    // Initialiser la connexion WebSocket (seulement si le backend est disponible)
    const { isConnected, sendMessage: wsSendMessage, sendTyping, error: wsError } = useWebSocket(
        handleMessageReceived,
        handleTypingReceived,
        handleConversationDeleted,
        { enabled: backendAvailable } // Ne connecter que si le backend est disponible
    );

    // Récupérer l'utilisateur courant
    useEffect(() => {
        userService.getCurrentUser().then(user => {
            if (user) {
                setCurrentUserId(user.id);
            }
        }).catch(console.error);
    }, []);

    // Charger les conversations au montage
    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        // console.log('🚀 [Messages] Début du chargement des conversations...');
        try {
            setLoading(true);
            setError(null);
            const convs = await messageService.getConversations();

            // console.log('📊 [Messages] Résultat:', convs.length, 'conversations reçues');

            // Si on arrive ici sans erreur, le backend est disponible (même si 0 conversations)
            // console.log('✅ [Messages] Backend disponible !');
            setBackendAvailable(true);
            setConversations(convs);

            // Si pas de conversation active et qu'il y en a, sélectionner la première
            if (!activeConversationId && convs.length > 0) {
                // console.log('📌 [Messages] Sélection de la première conversation:', convs[0].id);
                setActiveConversationId(convs[0].id);
            }
        } catch (err) {
            console.error('❌ [Messages] Erreur lors du chargement:', err);
            setBackendAvailable(false);
            setError('Serveur déconnecté');
        } finally {
            setLoading(false);
            // console.log('🏁 [Messages] Fin du chargement');
        }
    };

    // Gérer le paramètre URL pour ouvrir une conversation avec un utilisateur
    useEffect(() => {
        const userParam = searchParams.get('u');
        if (!userParam) return;

        const createConversationWithUser = async () => {
            try {
                // Trouver l'utilisateur par username
                const user = await userService.getUserByUsername(userParam);

                // Créer ou récupérer la conversation
                const conversation = await messageService.getOrCreateConversation(user.id);

                // Ajouter à la liste si pas déjà présent
                setConversations(prev => {
                    const exists = prev.find(c => c.id === conversation.id);
                    if (exists) return prev;
                    return [conversation, ...prev];
                });

                // Sélectionner cette conversation
                setActiveConversationId(conversation.id);

                // Nettoyer l'URL
                navigate('/messages', { replace: true });
            } catch (err) {
                console.error('Error creating conversation:', err);
                setError(`Impossible de créer une conversation avec ${userParam}`);
            }
        };

        createConversationWithUser();
    }, [searchParams, navigate]);

    // Charger les messages quand on change de conversation
    useEffect(() => {
        if (!activeConversationId) return;

        const loadMessages = async () => {
            // Si déjà chargés, pas besoin de recharger
            if (messages[activeConversationId]) return;

            try {
                setLoadingMessages(true);
                const msgs = await messageService.getConversationMessages(activeConversationId);
                setMessages(prev => ({
                    ...prev,
                    [activeConversationId]: msgs
                }));

                // Marquer comme lu
                await messageService.markAsRead(activeConversationId);

                // Mettre à jour le compteur de non lus
                setConversations(prev => prev.map(conv =>
                    conv.id === activeConversationId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                ));
            } catch (err) {
                console.error('Error loading messages:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [activeConversationId]);

    // Variables calculées (avant les useEffect qui les utilisent)
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeMessages = activeConversationId ? (messages[activeConversationId] || []) : [];

    const filteredConversations = conversations.filter(conv =>
        conv.otherUserUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.lastMessage?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isTyping = activeConversationId ? typingUsers[activeConversationId] : false;

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    };

    // Scroller au chargement initial et quand les messages changent
    useEffect(() => {
        scrollToBottom();
    }, [messages, activeConversationId]);

    // Scroller aussi après le chargement des messages
    useEffect(() => {
        if (!loadingMessages && activeMessages.length > 0) {
            // Petit délai pour s'assurer que le DOM est bien mis à jour
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [loadingMessages, activeMessages.length]);

    // Changer de conversation
    const handleConversationChange = async (conversationId: string) => {
        setActiveConversationId(conversationId);

        // Marquer comme lu
        try {
            await messageService.markAsRead(conversationId);
            setConversations(prev => prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));

            // Déclencher un événement pour rafraîchir le compteur dans la sidebar
            window.dispatchEvent(new CustomEvent('unreadMessagesChanged'));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    // Envoyer un message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId || !isConnected || !currentUserId) return;

        const activeConv = conversations.find(c => c.id === activeConversationId);
        if (!activeConv) return;

        const messageContent = newMessage.trim();

        // Récupérer l'utilisateur actuel pour avoir avatar et username
        const currentUser = await userService.getCurrentUser();
        if (!currentUser) return;

        // Créer un message optimiste (affichage immédiat avant la réponse du serveur)
        const optimisticMessage: MessageDto = {
            id: `temp-${Date.now()}`, // ID temporaire
            conversationId: activeConversationId,
            senderId: currentUserId,
            senderUsername: currentUser.username,
            senderAvatarUrl: currentUser.avatarUrl || '',
            content: messageContent,
            sentAt: new Date().toISOString(),
            isRead: false,
            readAt: null
        };

        // Ajouter le message optimistiquement à l'interface
        setMessages(prev => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), optimisticMessage]
        }));

        // Mettre à jour la conversation dans la liste
        setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
                return {
                    ...conv,
                    lastMessage: optimisticMessage,
                    updatedAt: optimisticMessage.sentAt
                };
            }
            return conv;
        }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));

        // Envoyer via WebSocket
        wsSendMessage({
            receiverId: activeConv.otherUserId,
            content: messageContent
        });

        setNewMessage("");
    };

    // Gérer la frappe (typing indicator)
    const handleTyping = () => {
        if (!activeConversationId || !isConnected) return;

        const activeConv = conversations.find(c => c.id === activeConversationId);
        if (!activeConv) return;

        sendTyping(activeConv.otherUserId);
    };

    // Supprimer une conversation
    const handleDeleteConversation = async () => {
        if (!activeConversationId) return;

        // console.log('🗑️ [Messages] Suppression de la conversation:', activeConversationId);

        try {
            await messageService.deleteConversation(activeConversationId);

            // Retirer la conversation de la liste
            setConversations(prev => prev.filter(conv => conv.id !== activeConversationId));

            // Retirer les messages de cette conversation
            setMessages(prev => {
                const newMessages = { ...prev };
                delete newMessages[activeConversationId];
                return newMessages;
            });

            // Désélectionner la conversation
            setActiveConversationId(null);

            // Déclencher un événement pour rafraîchir le compteur dans la sidebar
            window.dispatchEvent(new CustomEvent('unreadMessagesChanged'));

            // console.log('✅ [Messages] Conversation supprimée localement');
        } catch (err) {
            console.error('❌ [Messages] Erreur suppression:', err);
            alert('Erreur lors de la suppression de la conversation');
        }
    };

    // Formater la date des messages
    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        } else if (isYesterday(date)) {
            return 'Hier';
        } else {
            return format(date, 'dd/MM/yyyy', { locale: fr });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex max-w-none h-full overflow-x-hidden">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-hidden w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1
                            className="font-medium capitalize"
                            style={{
                                fontFamily: '"SF Pro", sans-serif',
                                fontSize: '19px',
                                fontWeight: 590,
                                color: '#252525',
                                textAlign: 'center',
                                textTransform: 'capitalize'
                            }}
                        >
                            Messages
                        </h1>
                        {/* Indicateur de connexion WebSocket */}
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                    <Wifi className="w-4 h-4" />
                                    <span className="hidden md:inline">Connecté</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                    <WifiOff className="w-4 h-4" />
                                    <span className="hidden md:inline">Déconnecté</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Erreur globale ou information */}
                    {(error || wsError) && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error || wsError}</span>
                        </div>
                    )}

                    {/* Chargement */}
                    {loading ? (
                        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
                            <Loader2 className="w-8 h-8 animate-spin text-[#EC3558]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-12 md:grid-cols-12 grid-rows-[100px_1fr] md:grid-rows-1 gap-6 h-[calc(100vh-10rem)]">
                            {/* Conversations list */}
                            <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:max-h-full max-h-[100px]">
                                <div className="p-4 border-b border-gray-100 flex-shrink-0 md:block hidden">
                                    <div className="relative" ref={searchDropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Rechercher des personnes..."
                                            className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC3558]"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => {
                                                if (searchQuery.trim() !== "") {
                                                    setShowSearchDropdown(true);
                                                }
                                            }}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                                        {/* Dropdown de recherche */}
                                        {showSearchDropdown && (
                                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                                                {isSearching && (
                                                    <div className="flex justify-center items-center py-4">
                                                        <Loader2 className="w-5 h-5 animate-spin text-[#EC3558]" />
                                                        <span className="ml-2 text-sm text-gray-500">Recherche...</span>
                                                    </div>
                                                )}

                                                {!isSearching && searchUsers.length > 0 && searchUsers.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                                        onClick={() => handleOpenConversationWithUser(user.username)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-10 h-10">
                                                                <AvatarImage src={user.avatarUrl} alt={user.username} />
                                                                <AvatarFallback className="bg-[#EC3558] text-white">
                                                                    {user.username.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm text-gray-900">{user.username}</p>
                                                                {user.bio && <p className="text-xs text-gray-500 truncate">{user.bio}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {!isSearching && searchUsers.length === 0 && searchQuery.trim() !== "" && (
                                                    <div className="p-4 text-center text-gray-500 text-sm">
                                                        Aucun utilisateur trouvé
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100 overflow-y-auto flex-1 md:max-h-[calc(100vh-15rem)] flex md:flex-col flex-row flex-nowrap py-2">
                                    {filteredConversations.length === 0 ? (
                                        <div className="flex items-center justify-center h-full p-4 text-gray-500 text-center">
                                            <p>Aucune conversation</p>
                                        </div>
                                    ) : (
                                        filteredConversations.map((conversation) => (
                                            <div
                                                key={conversation.id}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${activeConversation?.id === conversation.id ? 'bg-gray-50' : ''} md:w-full w-auto md:mb-0 mb-0 flex-shrink-0`}
                                                onClick={() => handleConversationChange(conversation.id)}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={conversation.otherUserAvatarUrl} alt={conversation.otherUserUsername} />
                                                        <AvatarFallback>{conversation.otherUserUsername.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-1 min-w-0 hidden sm:block lg:block">
                                                    <div className="font-medium text-gray-900">
                                                        {conversation.otherUserUsername}
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conversation.lastMessage?.content || 'Nouvelle conversation'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Active conversation */}
                            {activeConversation ? (
                                <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-200 flex flex-col">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={activeConversation.otherUserAvatarUrl} alt={activeConversation.otherUserUsername} />
                                                    <AvatarFallback>{activeConversation.otherUserUsername.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {activeConversation.otherUserUsername}
                                                </div>
                                                {isTyping && (
                                                    <p className="text-xs text-[#EC3558] italic">En train d'écrire...</p>
                                                )}
                                            </div>
                                        </div>
                                        {/* Bouton supprimer */}
                                        <button
                                            onClick={handleDeleteConversation}
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                            title="Supprimer la conversation"
                                        >
                                            <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 md:max-h-[calc(100vh-15rem)] max-h-[calc(100vh-22rem)]">
                                        {loadingMessages ? (
                                            <div className="flex items-center justify-center h-full">
                                                <Loader2 className="w-6 h-6 animate-spin text-[#EC3558]" />
                                            </div>
                                        ) : activeMessages.length === 0 ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center text-gray-500">
                                                    <p className="mb-2 font-medium">Aucun message</p>
                                                    <p className="text-sm">Commencez la conversation</p>
                                                </div>
                                            </div>
                                        ) : (
                                            activeMessages.map((message) => {
                                                const isMe = message.senderId === currentUserId;
                                                return (
                                                    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div
                                                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe
                                                                ? 'bg-[#EC3558] text-white rounded-tr-sm'
                                                                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                                                                }`}
                                                        >
                                                            {message.content}
                                                            <div className={`text-xs mt-1 flex items-center gap-1 ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                                                <span>{formatMessageTime(message.sentAt)}</span>
                                                                {isMe && message.isRead && (
                                                                    <span className="text-white/70">✓✓</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        {/* Élément invisible pour le scroll automatique */}
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <div className="p-4 border-t border-gray-100 flex-shrink-0">
                                        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                                            <input
                                                type="text"
                                                placeholder="Écrire un message..."
                                                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC3558]"
                                                value={newMessage}
                                                onChange={(e) => {
                                                    setNewMessage(e.target.value);
                                                    handleTyping();
                                                }}
                                                disabled={!isConnected}
                                            />
                                            <button
                                                type="submit"
                                                className="h-11 sm:px-5 px-3 bg-[#EC3558] text-white rounded-xl hover:bg-[#EC3558]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!isConnected || !newMessage.trim()}
                                            >
                                                <Send className="w-4 h-4" />
                                                <span className="sm:inline hidden">Envoyer</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-200 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <p className="mb-2 font-medium">Sélectionnez une conversation</p>
                                        <p className="text-sm">Choisissez une conversation pour commencer à discuter</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <RightBar />
            </div>
        </div>
    );
};

export default Messages;