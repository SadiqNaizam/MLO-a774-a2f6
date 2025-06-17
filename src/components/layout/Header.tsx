import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User, Search, UtensilsCrossed } from 'lucide-react';

const Header: React.FC = () => {
  const [cartItemCount] = React.useState(3); // Placeholder
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  console.log('Header loaded');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you'd navigate to a search results page or update a filter
      console.log('Search submitted:', searchQuery);
      // Example: navigate(`/search?q=${searchQuery}`);
      // For now, let's navigate to restaurant listing with a query param if it were supported
      // navigate(`/restaurant-listing?search=${searchQuery}`);
      // Or just log it for now.
      setSearchQuery(''); // Clear search input
    }
  };

  const navLinks = [
    { href: '/restaurant-listing', label: 'Restaurants' },
    { href: '/user-profile', label: 'My Orders' }, // User profile contains order history
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
              <div className="p-4">
                <Link to="/" className="flex items-center mb-6">
                  <UtensilsCrossed className="h-7 w-7 mr-2 text-primary" />
                  <span className="text-xl font-bold">FoodApp</span>
                </Link>
                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className="text-md font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <form onSubmit={handleSearchSubmit} className="mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search restaurants or dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <UtensilsCrossed className="h-7 w-7 mr-2 text-primary" />
            <span className="text-xl font-bold hidden sm:inline-block">FoodApp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </form>
        </div>


        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="View Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/user-profile" aria-label="User Profile">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;