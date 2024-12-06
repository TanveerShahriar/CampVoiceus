import CustomLink from "./CustomLink";

export default function Header() {
  return (
    <nav className="flex justify-around items-center bg-indigo-600 p-4 text-white shadow-lg">
      <CustomLink to="/">Home</CustomLink>
      <CustomLink to="/register">Register</CustomLink>
      <CustomLink to="/login">Login</CustomLink>
    </nav>
  );
}