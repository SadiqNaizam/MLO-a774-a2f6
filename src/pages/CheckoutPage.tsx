import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, MapPin, Percent, ShoppingBag, ShieldCheck, VenetianMaskIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define Zod schema for form validation
const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  addressLine1: z.string().min(5, { message: "Address line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format." }),
  phoneNumber: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Invalid phone number format." }),
  saveAddress: z.boolean().optional(),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal", "cod"], { required_error: "Please select a payment method." }),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

const checkoutFormSchema = addressSchema.extend(paymentSchema.shape).extend({
    promoCode: z.string().optional(),
    agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Sample order summary data
const sampleOrderItems = [
  { id: '1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
  { id: '2', name: 'Coke Zero', quantity: 2, price: 1.50 },
  { id: '3', name: 'Garlic Knots', quantity: 1, price: 5.00 },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      saveAddress: false,
      paymentMethod: undefined,
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      promoCode: '',
      agreeToTerms: false,
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Checkout form submitted:', data);
    // Simulate API call
    toast.promise(
        new Promise(resolve => setTimeout(resolve, 1500)),
        {
          loading: 'Processing your order...',
          success: () => {
            navigate('/order-tracking', { state: { orderDetails: data, items: sampleOrderItems } }); // Navigate to order tracking page
            return 'Order placed successfully!';
          },
          error: 'Failed to place order. Please try again.',
        }
      );
  };

  const subtotal = sampleOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.00;
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + taxes;

  React.useEffect(() => {
    console.log('CheckoutPage loaded');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Address & Payment */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><MapPin className="mr-2 h-6 w-6 text-primary" />Delivery Address</CardTitle>
                  <CardDescription>Enter your shipping details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, etc." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Anytown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CA">California</SelectItem>
                                    <SelectItem value="NY">New York</SelectItem>
                                    <SelectItem value="TX">Texas</SelectItem>
                                    {/* Add more states as needed */}
                                </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saveAddress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Save this address for future orders</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><CreditCard className="mr-2 h-6 w-6 text-primary" />Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="creditCard" />
                              </FormControl>
                              <FormLabel className="font-normal">Credit Card</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal">PayPal</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchPaymentMethod === 'creditCard' && (
                    <div className="space-y-4 mt-4 pt-4 border-t">
                        <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name on Card</FormLabel>
                                    <FormControl><Input placeholder="John M Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cardExpiry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date (MM/YY)</FormLabel>
                                        <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cardCvc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CVC</FormLabel>
                                        <FormControl><Input placeholder="•••" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
                            <ShieldCheck className="h-4 w-4 !text-blue-700" />
                            <AlertTitle>Secure Payment</AlertTitle>
                            <AlertDescription>
                                Your payment information is encrypted and secure.
                            </AlertDescription>
                        </Alert>
                    </div>
                  )}
                   {watchPaymentMethod === 'paypal' && (
                    <Alert variant="default" className="mt-4 bg-sky-50 border-sky-200 text-sky-700">
                      <VenetianMaskIcon className="h-4 w-4 !text-sky-700" /> {/* Replace with PayPal icon if available */}
                      <AlertTitle>Redirecting to PayPal</AlertTitle>
                      <AlertDescription>
                        You will be redirected to PayPal to complete your payment securely.
                      </AlertDescription>
                    </Alert>
                  )}
                  {watchPaymentMethod === 'cod' && (
                     <Alert variant="default" className="mt-4 bg-green-50 border-green-200 text-green-700">
                        <ShoppingBag className="h-4 w-4 !text-green-700" />
                        <AlertTitle>Cash on Delivery</AlertTitle>
                        <AlertDescription>
                        Please have the exact amount ready for the delivery person.
                        </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary & Promo */}
            <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><ShoppingBag className="mr-2 h-6 w-6 text-primary" />Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sampleOrderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Delivery Fee</p>
                    <p>${deliveryFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Taxes (8%)</p>
                    <p>${taxes.toFixed(2)}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><Percent className="mr-2 h-6 w-6 text-primary" />Promo Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <FormField
                    control={form.control}
                    name="promoCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter your promo code</FormLabel>
                        <div className="flex space-x-2">
                            <FormControl>
                                <Input placeholder="SUMMER20" {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={() => toast.info('Promo code applied (placeholder)!')}>Apply</Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                    <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>
                                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />
                    <Button type="submit" size="lg" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
                    </Button>
                    {form.formState.errors.root && (
                         <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;