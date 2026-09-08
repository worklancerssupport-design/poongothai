import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Sparkles } from "lucide-react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import EditLogin from "./EditLogin";
import EditServicesEditor from "./EditServicesEditor";
import EditHairstylesEditor from "./EditHairstylesEditor";
import EditPackagesEditor from "./EditPackagesEditor";
import EditOwnerEditor from "./EditOwnerEditor";
import EditContactEditor from "./EditContactEditor";

function EditShell() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return <EditLogin />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F1E7" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "rgba(248,241,231,0.85)", borderBottom: "1px solid #E8D8C3" }}>
        <div className="wrap flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="font-heading font-bold text-[11px] tracking-[0.3em] text-[#C6A15B]">
                POONGOTHAI
              </div>
              <div className="font-body text-[9px] tracking-[0.3em] text-[#7A6152] uppercase">
                EDIT PANEL
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full bg-[#FDF3E3] border border-[#C6A15B]/30">
              <Sparkles className="w-3 h-3 text-[#B4821F]" />
              <span className="font-body text-[9px] font-semibold tracking-widest uppercase text-[#B4821F]">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-[#5C3A2E] border border-[#5C3A2E]/40 rounded-lg hover:bg-[#5C3A2E]/5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Back to Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-white bg-[#5C3A2E] rounded-lg hover:bg-[#3E2723] transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main editor */}
      <main>
        <EditHairstylesEditor />
        <EditServicesEditor />
        <EditPackagesEditor />
        <EditOwnerEditor />
        <EditContactEditor />
      </main>
    </div>
  );
}

export default function EditPage() {
  return (
    <AuthProvider>
      <EditShell />
    </AuthProvider>
  );
}