const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-6 sm:py-8 relative z-[999]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
          {/* Copyright section - Stacks vertically on mobile */}
          <div className="text-[11px] sm:text-sm text-center sm:text-left">
            <span className="block sm:inline">
              © {new Date().getFullYear()}{" "}
              <span className="text-red-500 dark:text-red-400">Smart</span>
              <span className="text-cyan-500 dark:text-cyan-400">Wave</span>{" "}
              Cards.
            </span>
            <span className="block sm:inline">
              {" "}Crafted by{" "}
              <span className="italic text-cyan-500 dark:text-cyan-400">
                xBeyond LLP
              </span>
              .
            </span>
            <span className="hidden sm:inline"> All rights reserved.</span>
          </div>

          {/* Navigation links - Centered on mobile */}
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a 
              href="/privacy" 
              className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 