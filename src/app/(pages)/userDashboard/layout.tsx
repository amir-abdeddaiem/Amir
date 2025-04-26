import Sidebar from "@/components/sidebar/UserSideBar";
import NavBarDashboard from "@/components/sidebar/NavbarOfuserDashboard";
export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>


      <div>
        <div className="grid">
          <NavBarDashboard />
          <div className="flex">
            <Sidebar />
            <main className="p-6">
              {children}
            </main>
          </div>

        </div>


      </div>
    </>
  );
}
