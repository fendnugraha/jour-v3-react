import { Link } from "@inertiajs/react";

export default function Paginator({ links }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <Link
          href={links.prev_page_url}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous &laquo;
        </Link>
        <Link
          href={links.next_page_url}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 p-1">
            Showing
            <span className="font-medium mx-1">{links.from}</span>
            to
            <span className="font-medium mx-1">{links.to}</span>
            of
            <span className="font-medium mx-1">{links.total}</span>
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {links.links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={
                  link.active
                    ? "z-10 bg-gray-600 text-white text-md relative inline-flex items-center px-3 py-1 border font-medium first:rounded-l-md last:rounded-r-md border-gray-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-3 py-1 border text-sm font-medium first:rounded-l-md last:rounded-r-md"
                }
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }} />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
