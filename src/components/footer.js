export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#00000014]">
      <div className="max-w-screen-lg mx-auto px-4 py-6 text-center text-xs">
        © {year} MyWebsitesDirectory
      </div>
    </footer>
  );
}
