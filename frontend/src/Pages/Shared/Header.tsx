import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  User,
  Bell,
  PlusSquare,
  ShieldQuestion,
  LogOut,
  Calendar,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import CustomLink from "./CustomLink";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn =
    location.pathname !== "/login" && location.pathname !== "/register";
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleGroupsMenu = () => setIsGroupsOpen(!isGroupsOpen);
  const showCreateThread = !location.pathname.startsWith("/groups");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsGroupsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-indigo-600 shadow-lg mb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-10 w-28"
                src="/campvoiceus.png"
                alt="CampVoiceUs"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <CustomLink to="/" icon={<Home className="w-5 h-5 mr-1" />}>
                  Home
                </CustomLink>
                {isLoggedIn && (
                  <>
                    <CustomLink
                      to="/dashboard"
                      icon={<User className="w-5 h-5 mr-1" />}
                    >
                      Profile
                    </CustomLink>
                    <CustomLink
                      to="/notifications"
                      icon={<Bell className="w-5 h-5 mr-1" />}
                    >
                      Notifications
                    </CustomLink>
                    {showCreateThread && (
                      <CustomLink
                        to="/createthread"
                        icon={<PlusSquare className="w-5 h-5 mr-1" />}
                      >
                        Create Thread
                      </CustomLink>
                    )}
                    <CustomLink
                      to="/createqna"
                      icon={<ShieldQuestion className="w-5 h-5 mr-1" />}
                    >
                      QNA
                    </CustomLink>
                    <CustomLink
                      to="/myevents"
                      icon={<Calendar className="w-5 h-5 mr-1" />}
                    >
                      My Events
                    </CustomLink>
                    {/* Groups Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={toggleGroupsMenu}
                        className="flex items-center text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        <Users className="w-5 h-5 mr-1" />
                        Groups
                        {isGroupsOpen ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                      {isGroupsOpen && (
                        <div className="absolute z-10 bg-white shadow-lg rounded-md mt-1 w-48">
                          <CustomLink
                            to="/groups"
                            className="block text-gray-800 px-3 py-2 hover:bg-indigo-100"
                          >
                            All Groups
                          </CustomLink>
                          <CustomLink
                            to="/groups/mine"
                            className="block text-gray-800 px-3 py-2 hover:bg-indigo-100"
                          >
                            My Groups
                          </CustomLink>
                          <CustomLink
                            to="/groups/create"
                            className="block text-gray-800 px-3 py-2 hover:bg-indigo-100"
                          >
                            Create Group
                          </CustomLink>
                          <button
                            onClick={toggleGroupsMenu}
                            className="w-full text-left text-gray-800 px-3 py-2 hover:bg-indigo-100"
                          >
                            Hide Menu
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              ) : (
                <>
                  <CustomLink
                    to="/register"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium mr-2"
                  >
                    Register
                  </CustomLink>
                  <CustomLink
                    to="/login"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </CustomLink>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <CustomLink
              to="/"
              icon={<Home className="w-5 h-5 mr-1" />}
              className="block text-white px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </CustomLink>
            {isLoggedIn && (
              <>
                <CustomLink
                  to="/dashboard"
                  icon={<User className="w-5 h-5 mr-1" />}
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </CustomLink>
                <CustomLink
                  to="/notifications"
                  icon={<Bell className="w-5 h-5 mr-1" />}
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Notifications
                </CustomLink>
                {showCreateThread && (
                  <CustomLink
                    to="/createthread"
                    icon={<PlusSquare className="w-5 h-5 mr-1" />}
                    className="block text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Create Thread
                  </CustomLink>
                )}
                <CustomLink
                  to="/createqna"
                  icon={<ShieldQuestion className="w-5 h-5 mr-1" />}
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  QNA
                </CustomLink>
                <CustomLink
                  to="/myevents"
                  icon={<Calendar className="w-5 h-5 mr-1" />}
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  My Events
                </CustomLink>
                {/* Groups Dropdown for Mobile */}
                <button
                  onClick={toggleGroupsMenu}
                  className="flex justify-between items-center w-full text-left text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  👥Groups
                  {isGroupsOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {isGroupsOpen && (
                  <div className="pl-4">
                    <CustomLink
                      to="/groups"
                      className="block text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      All Groups
                    </CustomLink>
                    <CustomLink
                      to="/groups/mine"
                      className="block text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      My Groups
                    </CustomLink>
                    <CustomLink
                      to="/groups/create"
                      className="block text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      Create Group
                    </CustomLink>
                  </div>
                )}
              </>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-white px-3 py-2 rounded-md text-base font-medium"
              >
                <LogOut className="w-5 h-5 mr-1 inline" />
                Logout
              </button>
            ) : (
              <>
                <CustomLink
                  to="/register"
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </CustomLink>
                <CustomLink
                  to="/login"
                  className="block text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </CustomLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
