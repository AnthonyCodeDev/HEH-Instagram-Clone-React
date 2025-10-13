import { useBreakpointClass } from "@/hooks/use-mobile";
import SearchBar from "./SearchBar";
import QuickAdd from "./QuickAdd";
import { Link } from "react-router-dom";

const RightBar = () => {
    return (
        <div className={`w-96 p-6 flex-shrink-0 overflow-y-auto ${useBreakpointClass(1000, 'hidden', '')}`}>
            <SearchBar />
            <QuickAdd />

            {/* Footer */}
            <div className="mt-8 text-xs text-gray-400">
                <div className="flex flex-wrap gap-x-3 gap-y-2 mb-4">
                    <Link to="/#" className="hover:underline">À propos</Link>
                    <Link to="/#" className="hover:underline">Aide</Link>
                    <Link to="/#" className="hover:underline">Presse</Link>
                    <Link to="/#" className="hover:underline">API</Link>
                    <Link to="/#" className="hover:underline">Emplois</Link>
                    <Link to="/#" className="hover:underline">Confidentialité</Link>
                    <Link to="/#" className="hover:underline">Conditions</Link>
                    <Link to="/#" className="hover:underline">Lieux</Link>
                    <Link to="/#" className="hover:underline">Langue</Link>
                </div>
                <p className="text-xs text-gray-400">© 2025 Stragram</p>
            </div>
        </div>
    );
};

export default RightBar;
