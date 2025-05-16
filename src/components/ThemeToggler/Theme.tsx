// import { useTheme } from '@/context/ThemeProvider';
// import { Sun, Moon } from "lucide-react";

// export const ThemeToggle = () => {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <button
//       onClick={toggleTheme}
//       className={`
//         p-2
//         rounded-lg
//         transition-all
//         duration-200
//         ${theme === 'dark' 
//           ? 'bg-gray-800 hover:bg-gray-700 text-white' 
//           : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
//         }
//       `}
//       aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//       title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//     >
//       {theme === 'light' ? (
//         <Sun className="h-5 w-5" />
//       ) : (
//         <Moon className="h-5 w-5" />
//       )}
//     </button>
//   );
// };