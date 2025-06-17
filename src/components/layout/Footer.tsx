import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"; // Optional: for visual separation

const Footer: React.FC = () => {
  console.log('Footer component loaded');

  const footerLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-muted text-muted-foreground py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FoodDeliveryApp. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6" />
        <div className="text-center text-xs">
          <p>
            Built with passion for delicious food.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;