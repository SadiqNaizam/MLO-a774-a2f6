import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MenuItemCard, { MenuItemData } from '@/components/MenuItemCard'; // Assuming MenuItemData is exported

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner';
import { ChefHat, Utensils, IceCream, ShoppingBasket, Home, Salad, Coffee } from 'lucide-react';

interface RestaurantInfo {
  slug: string;
  name: string;
  description: string;
  cuisine: string;
  bannerImageUrl: string;
  rating: number;
  deliveryTime: string;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: MenuItemData[];
}

interface FullRestaurantData extends RestaurantInfo {
  menu: MenuCategory[];
}

// Mock data for demonstration
const mockRestaurantDatabase: Record<string, FullRestaurantData> = {
  'pasta-paradise': {
    slug: 'pasta-paradise',
    name: 'Pasta Paradise',
    description: 'Authentic Italian pasta dishes made with love and the freshest ingredients. Buon Appetito!',
    cuisine: 'Italian',
    bannerImageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
    rating: 4.7,
    deliveryTime: "30-40 min",
    menu: [
      {
        id: 'appetizers',
        name: 'Appetizers',
        icon: Salad,
        items: [
          { id: 'ap1', name: 'Bruschetta Classica', description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, and fresh tomatoes.', price: 8.99, imageUrl: 'https://images.unsplash.com/photo-1505253716362-af242227bc07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80', customizationRequired: false },
          { id: 'ap2', name: 'Caprese Salad', description: 'Fresh mozzarella, ripe tomatoes, and basil, drizzled with balsamic glaze.', price: 10.50, imageUrl: 'https://images.unsplash.com/photo-1579290977990-c819c178ef0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80' },
        ],
      },
      {
        id: 'main-courses',
        name: 'Main Courses',
        icon: ChefHat,
        items: [
          { id: 'mc1', name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with eggs, Pecorino Romano, pancetta, and black pepper.', price: 15.99, imageUrl: 'https://images.unsplash.com/photo-1588013273468-31508b966733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80', customizationRequired: true },
          { id: 'mc2', name: 'Lasagna Bolognese', description: 'Layers of fresh pasta, rich meat sauce, béchamel, and Parmesan cheese.', price: 17.50, imageUrl: 'https://images.unsplash.com/photo-1574894709920-81b29d016106?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80' },
          { id: 'mc3', name: 'Margherita Pizza', description: 'Traditional Neapolitan pizza with San Marzano tomatoes, mozzarella fior di latte, fresh basil, and olive oil.', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1595854368080-b3d18366986aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80', customizationRequired: true, isOutOfStock: false },
        ],
      },
      {
        id: 'desserts',
        name: 'Desserts',
        icon: IceCream,
        items: [
          { id: 'ds1', name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert, made of ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese.', price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1571877276327-360f970a071d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80' },
        ],
      },
       {
        id: 'drinks',
        name: 'Drinks',
        icon: Coffee,
        items: [
          { id: 'dr1', name: 'Espresso', description: 'Strong Italian coffee.', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1511920183353-ace249560596?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80' },
          { id: 'dr2', name: 'Sparkling Water', description: 'Refreshing sparkling water.', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1580900410096-705575092fad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80', isOutOfStock: true },
        ],
      }
    ],
  },
  'sushi-central': {
    slug: 'sushi-central',
    name: 'Sushi Central',
    description: 'Exquisite sushi and Japanese cuisine, crafted by master chefs. Your journey to Japan starts here.',
    cuisine: 'Japanese',
    bannerImageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80',
    rating: 4.9,
    deliveryTime: "35-45 min",
    menu: [
      {
        id: 'sushi-rolls',
        name: 'Sushi Rolls',
        icon: Utensils,
        items: [
          { id: 'sr1', name: 'California Roll', description: 'Crab, avocado, and cucumber wrapped in seaweed and rice.', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80' },
          { id: 'sr2', name: 'Spicy Tuna Roll', description: 'Tuna, spicy mayo, and cucumber.', price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1611141857432-53d0d5e56def?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80', customizationRequired: true },
        ],
      },
    ],
  },
};

interface CustomizationState {
  size: string;
  extraToppings: string[];
  notes: string;
}

const RestaurantMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const restaurantSlug = searchParams.get('slug');

  const [restaurantData, setRestaurantData] = useState<FullRestaurantData | null>(null);
  const [selectedItemForCustomization, setSelectedItemForCustomization] = useState<MenuItemData | null>(null);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [customizationValues, setCustomizationValues] = useState<CustomizationState>({
    size: 'medium',
    extraToppings: [],
    notes: '',
  });

  useEffect(() => {
    console.log('RestaurantMenuPage loaded');
    if (restaurantSlug && mockRestaurantDatabase[restaurantSlug]) {
      // Simulate API call
      setTimeout(() => {
        setRestaurantData(mockRestaurantDatabase[restaurantSlug]);
      }, 300);
    } else {
      // Handle restaurant not found, maybe redirect or show error
      setRestaurantData(null); // Or set to an error state
      toast.error(`Restaurant with slug "${restaurantSlug}" not found.`);
    }
  }, [restaurantSlug]);

  const handleAddToCart = (item: MenuItemData) => {
    console.log('Adding to cart (direct):', item);
    toast.success(`${item.name} added to cart!`);
    // Add to cart logic here
  };

  const handleOpenCustomizeDialog = (item: MenuItemData) => {
    setSelectedItemForCustomization(item);
    // Reset customization options for the new item
    setCustomizationValues({ size: 'medium', extraToppings: [], notes: '' });
    setIsCustomizationDialogOpen(true);
  };

  const handleCustomizationDialogClose = () => {
    setIsCustomizationDialogOpen(false);
    setSelectedItemForCustomization(null);
     // It's good practice to reset options, though they are reset on open too
    setCustomizationValues({ size: 'medium', extraToppings: [], notes: '' });
  };

  const handleCustomizationSubmit = () => {
    if (!selectedItemForCustomization) return;
    console.log('Adding to cart (customized):', selectedItemForCustomization, 'with options:', customizationValues);
    toast.success(`${selectedItemForCustomization.name} (customized) added to cart!`);
    // Add to cart logic here with customizationValues
    handleCustomizationDialogClose();
  };

  const handleToppingChange = (topping: string, checked: boolean | "indeterminate") => {
    setCustomizationValues(prev => ({
      ...prev,
      extraToppings: checked
        ? [...prev.extraToppings, topping]
        : prev.extraToppings.filter(t => t !== topping),
    }));
  };


  if (!restaurantData) {
    // Could be a loading state or a "Not Found" message
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <ShoppingBasket className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold">Loading restaurant data or restaurant not found...</h1>
          <p className="text-muted-foreground mt-2">
            If you typed the address, please check it again. Otherwise, try returning to the list of restaurants.
          </p>
          <Button asChild className="mt-6">
            <Link to="/restaurant-listing">Back to Restaurants</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const { name, description, cuisine, bannerImageUrl, menu } = restaurantData;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      {/* Restaurant Banner & Info */}
      <section className="relative h-64 md:h-80 bg-gray-800">
        <img src={bannerImageUrl} alt={`${name} banner`} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 bg-black bg-opacity-40">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{name}</h1>
          <p className="text-lg md:text-xl mb-1">{cuisine}</p>
          <p className="text-md max-w-2xl">{description}</p>
        </div>
      </section>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/"><Home className="h-4 w-4 mr-1 inline-block"/>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/restaurant-listing">Restaurants</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {menu.map((category) => (
          <section key={category.id} className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              <category.icon className="mr-3 h-7 w-7 text-primary" />
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onCustomize={item.customizationRequired ? handleOpenCustomizeDialog : undefined}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />

      {/* Customization Dialog */}
      {selectedItemForCustomization && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={(open) => { if (!open) handleCustomizationDialogClose(); else setIsCustomizationDialogOpen(open); }}>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Customize {selectedItemForCustomization.name}</DialogTitle>
              <DialogDescription>
                Make it just the way you like it. Price ${selectedItemForCustomization.price.toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Example: Pizza Size */}
              {selectedItemForCustomization.name.toLowerCase().includes('pizza') && (
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-md font-medium">Size</Label>
                  <RadioGroup
                    defaultValue={customizationValues.size}
                    onValueChange={(value) => setCustomizationValues(prev => ({ ...prev, size: value }))}
                    className="flex space-x-4"
                    id="size"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="s" />
                      <Label htmlFor="s">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="m" />
                      <Label htmlFor="m">Medium (+$2.00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="l" />
                      <Label htmlFor="l">Large (+$4.00)</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Example: Extra Toppings */}
               <div className="space-y-2">
                  <Label className="text-md font-medium">Extra Toppings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Extra Cheese (+$1.50)', 'Pepperoni (+$2.00)', 'Mushrooms (+$1.00)', 'Olives (+$1.00)'].map(topping => (
                      <div key={topping} className="flex items-center space-x-2">
                        <Checkbox
                          id={`topping-${topping.split(' ')[0]}`}
                          checked={customizationValues.extraToppings.includes(topping)}
                          onCheckedChange={(checked) => handleToppingChange(topping, checked)}
                        />
                        <Label htmlFor={`topping-${topping.split(' ')[0]}`} className="font-normal text-sm">{topping}</Label>
                      </div>
                    ))}
                  </div>
                </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-md font-medium">Special Instructions</Label>
                <Input
                  id="notes"
                  placeholder="e.g., no onions, extra spicy"
                  value={customizationValues.notes}
                  onChange={(e) => setCustomizationValues(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCustomizationSubmit}>Add to Cart</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantMenuPage;