import NotFoundClient from "./not-found-client";

// Note: not-found.tsx must be a server component in Next.js
// Metadata exports are not supported in not-found.tsx files
// The 404 page title will use the default from layout.tsx

export default function NotFound() {
  return <NotFoundClient />;
}

