import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X, Home, User, PlusSquare, LogOut, Calendar } from "lucide-react";
import CustomLink from "./CustomLink";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn = location.pathname !== "/login" && location.pathname !== "/register";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isCreateEventPage = location.pathname === "/calendar/create";
  const showCreateThread =
    !["/calendar", "/myevents", "/calendar/create"].includes(location.pathname) &&
    !isCreateEventPage;
  const showExploreAndCreateEvent = location.pathname === "/myevents";

  return (
    <nav className="bg-indigo-600 shadow-lg mb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-10 w-28" src="/campvoiceus.png" alt="CampVoiceUs" />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <CustomLink to="/" icon={<Home className="w-5 h-5 mr-1" />}>
                  Home
                </CustomLink>
                {isLoggedIn && (
                  <>
                    <CustomLink to="/dashboard" icon={<User className="w-5 h-5 mr-1" />}>
                      Profile
                    </CustomLink>
                    {showCreateThread && (
                      <CustomLink to="/createthread" icon={<PlusSquare className="w-5 h-5 mr-1" />}>
                        Create Thread
                      </CustomLink>
                    )}
                    {isCreateEventPage && (
                      <CustomLink to="/calendar" icon={<Calendar className="w-5 h-5 mr-1" />}>
                        Explore Events
                      </CustomLink>
                    )}
                    <CustomLink to="/myevents" icon={<Calendar className="w-5 h-5 mr-1" />}>
                      My Events
                    </CustomLink>
                    {showExploreAndCreateEvent && (
                      <>
                        <CustomLink to="/calendar" icon={<Calendar className="w-5 h-5 mr-1" />}>
                          Explore Events
                        </CustomLink>
                        <CustomLink
                          to="/calendar/create"
                          icon={<PlusSquare className="w-5 h-5 mr-1" />}
                        >
                          Create Event
                        </CustomLink>
                      </>
                    )}
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
    </nav>
  );
}
