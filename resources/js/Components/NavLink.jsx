import { Link } from "@inertiajs/react";

export default function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Link
      {...props}
      className={
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
        (active
          ? "border-yellow-500 text-yellow-200 focus:border-white "
          : "border-transparent text-slate-300 hover:text-yellow-200 hover:border-yellow-300 focus:text-yellow-300 focus:border-yellow-300 ") +
        className
      }
    >
      {children}
    </Link>
  );
}
