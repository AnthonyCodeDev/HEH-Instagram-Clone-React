// Test des routes de l'API
async function testRoutes() {
    const token = localStorage.getItem('token');
    const username = 'anthony';
    const API_URL = 'http://localhost:8080';

    console.log('=== Test de la route de recherche publique ===');
    try {
        const searchResponse = await fetch(`${API_URL}/users/search?query=${username}`);
        console.log('Status:', searchResponse.status);
        const searchText = await searchResponse.text();
        console.log('Response:', searchText);
        try {
            console.log('Parsed JSON:', JSON.parse(searchText));
        } catch (e) {
            console.log('Not valid JSON');
        }
    } catch (error) {
        console.error('Error with search endpoint:', error);
    }

    console.log('\n=== Test de la route authentifiée ===');
    try {
        const response = await fetch(`${API_URL}/users/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);
        try {
            console.log('Parsed JSON:', JSON.parse(text));
        } catch (e) {
            console.log('Not valid JSON');
        }
    } catch (error) {
        console.error('Error with authenticated endpoint:', error);
    }
}

// Exécuter les tests
testRoutes();