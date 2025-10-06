import Sidebar from "@/components/Sidebar";

const Messages = () => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex max-w-none h-full">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
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

                    <div className="grid grid-cols-12 gap-6 h-[calc(100%-3.5rem)]">
                        {/* Conversations list */}
                        <div className="col-span-4 bg-white rounded-xl border border-gray-200 h-full overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC3558]"
                                />
                            </div>
                            <div className="divide-y divide-gray-100 overflow-y-auto h-full">
                                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                                    <p className="font-medium text-gray-900">Lucas Hergz</p>
                                    <p className="text-sm text-gray-500 truncate">Salut, tu es dispo pour parler ?</p>
                                </div>
                                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                                    <p className="font-medium text-gray-900">Camille</p>
                                    <p className="text-sm text-gray-500 truncate">On se voit demain ?</p>
                                </div>
                            </div>
                        </div>

                        {/* Active conversation */}
                        <div className="col-span-8 bg-white rounded-xl border border-gray-200 h-full flex flex-col">
                            <div className="p-4 border-b border-gray-100">
                                <p className="font-semibold text-gray-900">Lucas Hergz</p>
                                <p className="text-xs text-gray-500">En ligne</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-start">
                                    <div className="max-w-[70%] bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2">
                                        Hello ! Comment ça va ?
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="max-w-[70%] bg-[#EC3558] text-white rounded-2xl rounded-tr-sm px-4 py-2">
                                        Super et toi ? Je bosse sur Stragram ;)
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <form className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Écrire un message..."
                                        className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EC3558]"
                                    />
                                    <button
                                        type="submit"
                                        className="h-11 px-5 bg-[#EC3558] text-white rounded-xl hover:bg-[#EC3558]/90 transition-colors"
                                    >
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;


