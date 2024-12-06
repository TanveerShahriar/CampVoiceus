import CustomLink from "./CustomLink";

export default function Header() {
    return (
      <h1 className="text-3xl font-bold underline">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/register">Register</CustomLink>
        <CustomLink to="/login">Login</CustomLink>
      </h1>
    )
}