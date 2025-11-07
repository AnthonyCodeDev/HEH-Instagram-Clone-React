/**
 * 🧪 Script de test pour la messagerie WebSocket
 * 
 * Ce fichier contient des fonctions utiles pour tester
 * la connexion et les fonctionnalités WebSocket en développement.
 * 
 * Utilisez ces fonctions dans la console du navigateur.
 */

// Test de connexion à l'API REST
export async function testRestAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Aucun token trouvé. Connectez-vous d\'abord.');
        return;
    }

    console.log('🔍 Test de l\'API REST...');

    try {
        // Test GET /conversations
        console.log('📋 Test GET /conversations');
        const response = await fetch('http://localhost:8080/api/messages/conversations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const conversations = await response.json();
        console.log('✅ Conversations récupérées:', conversations);

        // Test GET /unread-count
        console.log('📊 Test GET /unread-count');
        const countResponse = await fetch('http://localhost:8080/api/messages/unread-count', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!countResponse.ok) {
            throw new Error(`HTTP ${countResponse.status}: ${countResponse.statusText}`);
        }

        const unreadCount = await countResponse.json();
        console.log('✅ Messages non lus:', unreadCount);

        console.log('✅ Tous les tests REST ont réussi !');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors du test REST:', error);
        return false;
    }
}

// Test de connexion WebSocket
export function testWebSocket() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Aucun token trouvé. Connectez-vous d\'abord.');
        return;
    }

    console.log('🔌 Test de connexion WebSocket...');

    try {
        // Importer dynamiquement SockJS (si disponible)
        import('sockjs-client').then(({ default: SockJS }) => {
            const socket = new SockJS('http://localhost:8080/ws');

            socket.onopen = () => {
                console.log('✅ WebSocket connecté !');
                console.log('🔗 URL:', 'ws://localhost:8080/ws');
                socket.close();
            };

            socket.onerror = (error) => {
                console.error('❌ Erreur WebSocket:', error);
            };

            socket.onclose = () => {
                console.log('🔌 WebSocket fermé');
            };
        }).catch(() => {
            console.error('❌ SockJS non installé. Exécutez: npm install sockjs-client');
        });
    } catch (error) {
        console.error('❌ Erreur lors du test WebSocket:', error);
    }
}

// Afficher les informations de connexion
export function showConnectionInfo() {
    console.log('📊 Informations de connexion');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 REST API:', 'http://localhost:8080/api/messages');
    console.log('🔌 WebSocket:', 'ws://localhost:8080/ws');
    console.log('🔑 Token JWT:', localStorage.getItem('token') ? '✅ Présent' : '❌ Absent');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Vérifier la configuration complète
export async function checkSetup() {
    console.log('🔍 Vérification de la configuration...\n');

    // 1. Vérifier le token
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Aucun token JWT trouvé. Connectez-vous d\'abord.');
        return false;
    }
    console.log('✅ Token JWT présent');

    // 2. Vérifier l'API REST
    console.log('\n📡 Test de l\'API REST...');
    const restOk = await testRestAPI();

    if (!restOk) {
        console.error('❌ L\'API REST n\'est pas accessible.');
        console.log('💡 Vérifiez que le backend est lancé sur http://localhost:8080');
        return false;
    }

    // 3. Test WebSocket
    console.log('\n🔌 Test WebSocket...');
    testWebSocket();

    console.log('\n✅ Configuration vérifiée avec succès !');
    console.log('🚀 Vous pouvez maintenant utiliser la messagerie.');

    return true;
}

// Auto-export pour utilisation dans la console
if (typeof window !== 'undefined') {
    (window as any).messagingTest = {
        testRestAPI,
        testWebSocket,
        showConnectionInfo,
        checkSetup
    };
}
