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
          ? "border-sky-950 text-sky-950 focus:border-white "
          : "border-transparent text-slate-400 hover:text-slate-500 hover:border-slate-300 focus:text-orange-300 focus:border-orange-300 ") +
        className
      }
    >
      {children}
    </Link>
  );
}
