import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex max-w-none h-full">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="font-medium capitalize"
              style={{
                fontFamily: '"SF Pro", sans-serif',
                fontSize: '19px',
                fontWeight: 590,
                color: '#252525',
                textAlign: 'left',
                textTransform: 'capitalize'
              }}
            >
              Page non trouvée
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
            <div className="text-center">
              <h1 className="mb-4 text-8xl font-bold text-stragram-primary">404</h1>
              <p className="mb-6 text-xl text-gray-600">Oops! Cette page n'existe pas</p>
              <Link to="/" className="px-6 py-3 bg-stragram-primary text-white rounded-xl hover:bg-stragram-primary/90 transition-colors">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 p-6 flex-shrink-0 overflow-y-auto">
          <QuickAdd />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
