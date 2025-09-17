import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
          <div className="text-foreground/90">© {new Date().getFullYear()} GigmateAI</div>
          <nav className="flex flex-wrap items-center gap-4">
            <Link to="/" className="hover:text-primary">Job Search</Link>
            <a href="#filters" className="hover:text-primary">Filters</a>
            <a href="#help" className="hover:text-primary">Help</a>
            <Link to="/builder" className="hover:text-primary">Resume Builder</Link>
            <Link to="/faq" className="hover:text-primary">FAQ</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}; 