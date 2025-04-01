import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  path: BreadcrumbItem[];
}

export default function Breadcrumbs({ path }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ul className="flex space-x-2">
        {path.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="hover:underline text-blue-500">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-semibold">{item.label}</span>
            )}
            {index < path.length - 1 && <span className="mx-1">/</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
