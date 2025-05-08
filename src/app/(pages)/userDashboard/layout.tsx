import Sidebar from "@/components/sidebar/UserSideBar";
import NavBarDashboard from "@/components/sidebar/NavbarOfuserDashboard";
import UserInfo from "@/components/dashboard/UserInfo";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        <div className="grid">
          <NavBarDashboard />
          <div className="flex">
            <Sidebar />
            <main className="p-6">
              <div className="mb-6">
                <UserInfo />
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
