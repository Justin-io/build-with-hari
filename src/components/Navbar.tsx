import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onStartProjectClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartProjectClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5F5F7]/85 backdrop-blur-md border-b border-[#E4E4E7] shadow-[0_1px_12px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <a
          href="#"
          className="group flex items-center gap-2 text-base font-bold tracking-tight text-[#171717] hover:text-[#4778F5] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-[#4778F5] inline-block transition-transform group-hover:scale-110" />
          <span>BUILD WITH HARI</span>
        </a>

        {/* Center Nav Links (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B6B73]"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="hover:text-[#171717] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:text-[#4778F5]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onStartProjectClick}
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-[#4778F5] rounded-full transition-all duration-200 shadow-sm active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4778F5]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 text-[#171717] hover:text-[#4778F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4778F5] rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF]/98 backdrop-blur-xl border-b border-[#E4E4E7] px-6 py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#171717]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="py-1 text-[#6B6B73] hover:text-[#171717] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#E4E4E7]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onStartProjectClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#171717] hover:bg-[#4778F5] rounded-xl transition-colors"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
