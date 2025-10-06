import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour gérer le focus sur le champ de composition
 * sans déclencher de navigation inutile lorsqu'on est déjà sur la page d'accueil
 */
export const useFocusCompose = () => {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Fonction pour mettre le focus sur le champ de composition
     * @param e - L'événement de clic (optionnel)
     */
    const focusCompose = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }

        // Si on est déjà sur la page d'accueil, on met directement le focus sans modifier l'URL
        if (location.pathname === "/") {
            // Trouver le champ de texte et mettre le focus dessus
            setTimeout(() => {
                const textarea = document.querySelector('textarea[placeholder="Quoi de neuf ?"]');
                if (textarea) {
                    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
                    (textarea as HTMLTextAreaElement).focus();
                }
            }, 0);
        } else {
            // Si on n'est pas sur la page d'accueil, on navigue normalement
            navigate("/");

            // Après la navigation, mettre le focus sur le champ de texte
            setTimeout(() => {
                const textarea = document.querySelector('textarea[placeholder="Quoi de neuf ?"]');
                if (textarea) {
                    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
                    (textarea as HTMLTextAreaElement).focus();
                }
            }, 100);
        }
    };

    return { focusCompose };
};
