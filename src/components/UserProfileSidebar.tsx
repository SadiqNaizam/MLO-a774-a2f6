import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, MapPin, CreditCard, ScrollText, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/user-profile', label: 'Profile Details', icon: User },
  { href: '/user-profile/addresses', label: 'Addresses', icon: MapPin },
  { href: '/user-profile/payment-methods', label: 'Payment Methods', icon: CreditCard },
  { href: '/user-profile/order-history', label: 'Order History', icon: ScrollText },
  { href: '/user-profile/settings', label: 'Settings', icon: SettingsIcon },
];

const UserProfileSidebar: React.FC = () => {
  const location = useLocation();
  console.log('UserProfileSidebar loaded, current path:', location.pathname);

  return (
    <nav className="flex flex-col space-y-1 p-4 md:p-2 bg-muted/30 rounded-lg h-full min-w-[200px] md:min-w-[250px]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || (item.href === '/user-profile' && location.pathname.startsWith('/user-profile') && !navItems.slice(1).some(subItem => location.pathname.startsWith(subItem.href)));
        // The condition for 'Profile Details' to be active is if the path is exactly '/user-profile'
        // or if it's '/user-profile/' and not any other more specific sub-route.
        // More robust check for base path:
        let effectiveIsActive = location.pathname === item.href;
        if (item.href === '/user-profile' && location.pathname.startsWith('/user-profile')) {
          // Check if it's the base path and not a sub-path handled by other items
          const isSubPath = navItems.some(nav => nav.href !== '/user-profile' && location.pathname.startsWith(nav.href));
          if (!isSubPath) {
            effectiveIsActive = true;
          }
        }


        return (
          <Button
            key={item.href}
            asChild
            variant={effectiveIsActive ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start text-sm font-medium',
              effectiveIsActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Link to={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default UserProfileSidebar;