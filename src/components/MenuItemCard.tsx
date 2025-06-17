import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Settings2, PackageX } from 'lucide-react';

// Define the structure for a menu item's data
interface MenuItemData {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isOutOfStock?: boolean;
  customizationRequired?: boolean; // If true, the primary button should trigger customization
}

// Define the props for the MenuItemCard component
interface MenuItemCardProps {
  item: MenuItemData;
  /**
   * Callback function when "Add to Cart" is clicked for items not requiring customization.
   * The parent component is responsible for handling the cart logic and any related UI feedback (e.g., toasts).
   */
  onAddToCart: (item: MenuItemData) => void;
  /**
   * Callback function when "Customize" or "Select Options" is clicked for items that require customization.
   * This prop is optional; if customizationRequired is true but onCustomize is not provided,
   * the component will fall back to displaying the "Add to Cart" button.
   * The parent component is responsible for opening the customization UI (e.g., a dialog).
   */
  onCustomize?: (item: MenuItemData) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, onCustomize }) => {
  console.log(`MenuItemCard loaded for item ID: ${item.id}, Name: ${item.name}`);

  const {
    name,
    description,
    price,
    imageUrl,
    isOutOfStock = false,
    customizationRequired = false,
  } = item;

  return (
    <Card className="w-full overflow-hidden flex flex-col h-full transition-shadow duration-300 hover:shadow-lg group border border-gray-200 dark:border-gray-700">
      {/* Image Section */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || 'https://via.placeholder.com/400x225?text=No+Image+Available'}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </AspectRatio>
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Name and Description Section */}
      <CardHeader className="p-4">
        <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2 leading-tight">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow space-y-2">
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </CardDescription>
        <p className="text-xl md:text-2xl font-bold text-primary">
          ${price.toFixed(2)}
        </p>
      </CardContent>

      {/* Action Button Section */}
      <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        {isOutOfStock ? (
          <Button className="w-full" disabled variant="secondary">
            <PackageX className="mr-2 h-4 w-4" />
            Out of Stock
          </Button>
        ) : customizationRequired && onCustomize ? (
          <Button className="w-full" onClick={() => onCustomize(item)}>
            <Settings2 className="mr-2 h-4 w-4" />
            Customize
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onAddToCart(item)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;