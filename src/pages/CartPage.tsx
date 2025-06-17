import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ChevronLeft } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  restaurantName?: string; // Optional: If items can be from different restaurants
}

const initialCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    price: 12.99,
    quantity: 1,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1675451537703-ACb5b954ce9a?q=80&w=600',
    restaurantName: 'Pizza Heaven',
  },
  {
    id: 'item2',
    name: 'Coca-Cola Can',
    price: 1.50,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=600',
    restaurantName: 'Pizza Heaven',
  },
  {
    id: 'item3',
    name: 'Garlic Bread Sticks',
    price: 4.75,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1593231364000-58950c729219?q=80&w=600',
    restaurantName: 'Pizza Heaven',
  },
];

const CartPage: React.FC = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fixed delivery fee
  const taxes = cartItems.length > 0 ? subtotal * 0.08 : 0; // Example 8% tax
  const total = subtotal + deliveryFee + taxes;

  useEffect(() => {
    // This effect can be used if cartItems were fetched from localStorage or API
    // For now, it just logs when cartItems change
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto flex-grow py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center">
            <ShoppingBag className="mr-3 h-8 w-8 text-primary" />
            Your Shopping Cart
          </h1>
          <Button variant="outline" onClick={() => navigate('/restaurant-listing')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild size="lg">
                <Link to="/restaurant-listing">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <section className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center w-[100px]">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center w-[50px]">Remove</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">
                            <img
                              src={item.imageUrl || 'https://via.placeholder.com/64'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                            {item.restaurantName && (
                               <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="w-16 text-center mx-auto h-9"
                              aria-label={`Quantity for ${item.name}`}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Order Summary Section */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-24"> {/* sticky for long item lists */}
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (Est.)</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;