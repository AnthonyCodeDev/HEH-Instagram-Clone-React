import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Charger les fonctions de test de la messagerie en mode développement
if (import.meta.env.DEV) {
    import('./utils/messagingTest.ts').catch(() => {
        // Les tests ne sont pas critiques, ignorer l'erreur si le fichier n'existe pas
    });
}

createRoot(document.getElementById("root")!).render(<App />);
