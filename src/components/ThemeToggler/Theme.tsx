import { useTheme } from '@/context/ThemeProvider';
import { Search, Bell, Sun, Moon, User, ChevronDown, Menu, PawPrint } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (<>
    <button
    onClick={toggleTheme}
    className={`
      p-2 rounded-lg 
      ${theme=="dark"  ? "hover:bg-gray-800" : "hover:bg-gray-300"} 
      transition-colors
    `}
>
    {theme=="light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
</button>



    
    </>
  );
};