import Sidebar from "@/components/Sidebar";
import RightBar from "@/components/RightBar";
import MobileNavbar from "@/components/MobileNavbar";
import NotificationsList from "@/components/NotificationsList";

const Notifications = () => {

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-none h-full overflow-x-hidden">
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto w-full">
          <div className="w-full max-w-3xl mx-auto">
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
                Notifications
              </h1>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <NotificationsList />
            </div>
          </div>
        </div>

        {/* Right Sidebar - hidden on mobile and small tablets */}
        <div className="hidden lg:block">
          <RightBar />
        </div>
      </div>

      {/* Mobile Navigation Bar - visible only on mobile */}
      <MobileNavbar />
    </div>
  );
};

export default Notifications;