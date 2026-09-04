export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} KatalogKu. Ditenagai oleh Next.js Server Actions & Prisma ORM.</p>
      </div>
    </footer>
  );
}
