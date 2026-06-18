import { NavLink, useNavigate } from "react-router-dom";
import { CirclePlay, SquarePlay, GitFork, Bot, User } from "lucide-react";
import { useFoxio } from "@/app/providers/FoxioProvider";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { DiscardModal } from "@/components/common/DiscardModal";
import { useState } from "react";

const navItems = [
  { to: "/tutorial", icon: CirclePlay, label: "Tutorial" },
  { to: "/library", icon: SquarePlay, label: "Library" },
  // { to: "/overview", icon: GitFork, label: "Overview" },
  { to: "/chatbot", icon: Bot, label: "Chatbot" },
];

export function Sidebar() {
  const { logo } = useFoxio();
  const { canNavigate } = useNavigationGuard();
  const navigate = useNavigate();
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleNavClick = (e: React.MouseEvent, to: string) => {
    if (!canNavigate()) {
      e.preventDefault();
      setPendingPath(to);
    }
  };

  const handleDiscard = () => {
    const path = pendingPath;
    setPendingPath(null);
    if (path) navigate(path);
  };

  return (
    <>
      <aside
        style={{ borderRight: "1px solid var(--border)" }}
        className="flex w-12 shrink-0 flex-col items-center py-1 sm:w-14"
      >
        <div className="mb-2 flex items-center justify-center">
          {logo && <img src={logo} alt="Logo" className="h-10 w-10" />}
        </div>

        <nav className="flex w-full flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={(e) => handleNavClick(e, to)}
              className={({ isActive }) =>
                `flex w-full cursor-pointer items-center justify-center py-2.5 text-muted-foreground transition-colors ${
                  isActive ? "bg-accent text-primary" : "hover:bg-accent"
                }`
              }
              style={({ isActive }) =>
                isActive ? { boxShadow: "inset -3px 0 0 0 var(--primary)" } : undefined
              }
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </NavLink>
          ))}

          <div className="flex w-full items-center justify-center py-2.5">
            <NavLink
              to="/profile"
              title="Profile"
              onClick={(e) => handleNavClick(e, "/profile")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary transition-all hover:[box-shadow:inset_0_0_0_2.5px_var(--primary)]"
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "inset 0 0 0 2.5px var(--primary)"
                  : "inset 0 0 0 1.5px var(--primary)",
              })}
            >
              <User className="h-4 w-4" />
            </NavLink>
          </div>
        </nav>
      </aside>

      <DiscardModal
        open={!!pendingPath}
        title="Leave page?"
        description="You have unsaved changes. Leaving will discard them."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={handleDiscard}
        onCancel={() => setPendingPath(null)}
      />
    </>
  );
}
