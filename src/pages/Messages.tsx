import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import { useBreakpointClass } from "@/hooks/use-mobile";

// Données fictives pour les conversations
const conversations = [
    {
        id: "1",
        user: {
            name: "Lucas Hergz",
            username: "lucashergz20",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            status: "En ligne"
        },
        lastMessage: "Salut, tu es dispo pour parler ?",
        messages: [
            { id: "m1", sender: "them", content: "Hello ! Comment ça va ?", time: "10:24" },
            { id: "m2", sender: "me", content: "Super et toi ? Je bosse sur Stragram ;)", time: "10:25" },
            { id: "m3", sender: "them", content: "Ça avance bien ? J'ai hâte de voir ça !", time: "10:26" },
            { id: "m4", sender: "me", content: "Oui, je suis en train de finaliser la page de messages justement", time: "10:27" },
            { id: "m5", sender: "them", content: "Génial ! Tu me montres quand c'est prêt ?", time: "10:28" }
        ]
    },
    {
        id: "2",
        user: {
            name: "Marie Marind",
            username: "mariemaring",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            status: "Hors ligne"
        },
        lastMessage: "Merci pour ton aide !",
        messages: [
            { id: "m1", sender: "me", content: "Salut Marie, comment vas-tu ?", time: "Hier" },
            { id: "m2", sender: "them", content: "Très bien merci ! Et toi ?", time: "Hier" },
            { id: "m3", sender: "me", content: "Super ! J'avais une question sur le projet", time: "Hier" },
            { id: "m4", sender: "them", content: "Bien sûr, dis-moi tout", time: "Hier" },
            { id: "m5", sender: "me", content: "Comment on fait pour intégrer l'API ?", time: "Hier" },
            { id: "m6", sender: "them", content: "C'est simple, je t'envoie un exemple de code", time: "Hier" },
            { id: "m7", sender: "me", content: "Merci beaucoup !", time: "Hier" },
            { id: "m8", sender: "them", content: "Merci pour ton aide !", time: "Hier" }
        ]
    },
    {
        id: "3",
        user: {
            name: "Tom Berton",
            username: "tomberton",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
            status: "En ligne"
        },
        lastMessage: "On se voit demain ?",
        messages: [
            { id: "m1", sender: "them", content: "Hey, ça te dit d'aller au cinéma demain ?", time: "09:15" },
            { id: "m2", sender: "me", content: "Oui pourquoi pas ! Quel film ?", time: "09:20" },
            { id: "m3", sender: "them", content: "Le nouveau Nolan, il paraît qu'il est génial", time: "09:22" },
            { id: "m4", sender: "me", content: "Parfait ! Quelle séance ?", time: "09:25" },
            { id: "m5", sender: "them", content: "19h30 ça te va ?", time: "09:26" },
            { id: "m6", sender: "me", content: "Nickel, on se retrouve devant le cinéma ?", time: "09:28" },
            { id: "m7", sender: "them", content: "On se voit demain ?", time: "09:30" }
        ]
    },
    {
        id: "4",
        user: {
            name: "Lucie Marinier",
            username: "luciemarinier10",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
            status: "Inactive"
        },
        lastMessage: "Nouvelle conversation",
        messages: []
    }
];

const Messages = () => {
    // State pour stocker toutes les conversations (pour pouvoir les modifier)
    const [allConversations, setAllConversations] = useState(conversations);
    const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Fonction pour changer de conversation active et mettre à jour l'URL
    const handleConversationChange = (conversationId: string) => {
        setActiveConversationId(conversationId);
        // Mettre à jour l'URL pour supprimer le paramètre u
        navigate("/messages");
    };

    // Vérifier s'il y a un paramètre d'URL pour un utilisateur spécifique
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const userParam = searchParams.get('u');

        if (userParam) {
            // Trouver la conversation avec cet utilisateur
            const conversation = allConversations.find(conv => conv.user.username === userParam);
            if (conversation) {
                setActiveConversationId(conversation.id);
            }
        }
    }, [allConversations]);

    // Trouver la conversation active
    const activeConversation = allConversations.find(conv => conv.id === activeConversationId) || allConversations[0];

    const filteredConversations = allConversations.filter(conv =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fonction pour scroller jusqu'au dernier message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll automatique quand on change de conversation ou au chargement initial
    useEffect(() => {
        scrollToBottom();
    }, [activeConversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        // Créer un nouveau message
        const newMessageObj = {
            id: `m${Date.now()}`, // ID unique basé sur le timestamp
            sender: "me",
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Mettre à jour la conversation avec le nouveau message
        setAllConversations(prevConversations =>
            prevConversations.map(conv =>
                conv.id === activeConversationId
                    ? {
                        ...conv,
                        messages: [...conv.messages, newMessageObj],
                        lastMessage: newMessage // Mettre à jour le dernier message
                    }
                    : conv
            )
        );

        // Vider le champ de saisie
        setNewMessage("");

        // Scroll après l'envoi d'un message
        setTimeout(scrollToBottom, 100);
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
                    </div>

                    <div className="grid grid-cols-12 md:grid-cols-12 grid-rows-[100px_1fr] md:grid-rows-1 gap-6 h-[calc(100vh-10rem)]">
                        {/* Conversations list */}
                        <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:max-h-full max-h-[100px]">
                            <div className="p-4 border-b border-gray-100 flex-shrink-0 md:block hidden">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC3558]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100 overflow-y-auto flex-1 md:max-h-[calc(100vh-15rem)] flex md:flex-col flex-row flex-nowrap py-2">
                                {filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${activeConversation.id === conversation.id ? 'bg-gray-50' : ''} md:w-full w-auto md:mb-0 mb-0 flex-shrink-0`}
                                        onClick={() => handleConversationChange(conversation.id)}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                                                <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${conversation.user.status === "En ligne" ? "bg-green-500" : "bg-gray-300"}`}></div>
                                        </div>
                                        <div className="flex-1 min-w-0 hidden sm:block lg:block">
                                            <div className="font-medium text-gray-900">
                                                {conversation.user.name}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active conversation */}
                        <div className="col-span-12 md:col-span-8 bg-white rounded-xl border border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
                                <div>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={activeConversation.user.avatar} alt={activeConversation.user.name} />
                                        <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {activeConversation.user.name}
                                    </div>
                                    <p className="text-xs text-gray-500">{activeConversation.user.status}</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 md:max-h-[calc(100vh-15rem)] max-h-[calc(100vh-22rem)]">
                                {activeConversation.messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-gray-500">
                                            <p className="mb-2 font-medium">Aucun message</p>
                                            <p className="text-sm">Commencez la conversation</p>
                                        </div>
                                    </div>
                                ) : (
                                    activeConversation.messages.map((message) => (
                                        <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-2xl ${message.sender === 'me'
                                                    ? 'bg-[#EC3558] text-white rounded-tr-sm'
                                                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                                                    }`}
                                            >
                                                {message.content}
                                                <div className={`text-xs mt-1 ${message.sender === 'me' ? 'text-white/70' : 'text-gray-500'}`}>
                                                    {message.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))
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
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="h-11 sm:px-5 px-3 bg-[#EC3558] text-white rounded-xl hover:bg-[#EC3558]/90 transition-colors flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="sm:inline hidden">Envoyer</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className={`w-96 p-6 flex-shrink-0 overflow-y-auto ${useBreakpointClass(1000, 'hidden', '')}`}>
                    <QuickAdd />
                </div>
            </div>
        </div>
    );
};

export default Messages;