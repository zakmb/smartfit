
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon, 
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Check-in', href: '/checkin', icon: ClipboardDocumentCheckIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarDaysIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">SmartFit</h1>
      </div>
      
      <nav className="flex flex-1 flex-col px-6 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto">
            <Link
              to="/personalization"
              className={`
                group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                ${location.pathname === '/personalization'
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Personalisation
            </Link>
            <button
              onClick={handleLogout}
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-300 hover:text-white hover:bg-gray-700 w-full"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
              Logout
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
} 