import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UserProfileSidebar from '@/components/UserProfileSidebar';

// Shadcn UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { toast } from "@/components/ui/use-toast"; // For simple toasts

// Icons
import { Edit, Trash2, PlusCircle, Eye, Save, Settings2 } from 'lucide-react';

// React Hook Form + Zod for Profile Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod Schema for Profile Form
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal('')),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Placeholder Data Types
interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemCount: number;
  restaurantName: string;
}

// Sample Data
const sampleAddresses: Address[] = [
  { id: '1', type: 'Home', street: '123 Main St', city: 'Anytown', zip: '12345', country: 'USA', isDefault: true },
  { id: '2', type: 'Work', street: '456 Business Ave', city: 'Workville', zip: '67890', country: 'USA' },
];

const samplePaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'Visa', last4: '1234', expiryMonth: '12', expiryYear: '2025', isDefault: true },
  { id: '2', type: 'Mastercard', last4: '5678', expiryMonth: '06', expiryYear: '2024' },
];

const sampleOrders: Order[] = [
  { id: 'ORD001', date: '2023-10-26', total: 25.99, status: 'Delivered', itemCount: 2, restaurantName: 'Pizza Place' },
  { id: 'ORD002', date: '2023-11-05', total: 15.50, status: 'Processing', itemCount: 1, restaurantName: 'Burger Joint' },
  { id: 'ORD003', date: '2023-11-10', total: 42.00, status: 'Cancelled', itemCount: 3, restaurantName: 'Sushi Stop' },
];


const UserProfilePage = () => {
  console.log('UserProfilePage loaded');
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // User data state (placeholders, would typically come from context/API)
  const [userAddresses, setUserAddresses] = useState<Address[]>(sampleAddresses);
  const [userPaymentMethods, setUserPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [userOrders] = useState<Order[]>(sampleOrders); // Orders usually not mutable here
  const [notificationSettings, setNotificationSettings] = useState({
    emailMarketing: true,
    emailOrderStatus: true,
    smsOrderStatus: false,
  });

  useEffect(() => {
    const path = location.pathname;
    if (path === '/user-profile/addresses') setActiveTab("addresses");
    else if (path === '/user-profile/payment-methods') setActiveTab("payment");
    else if (path === '/user-profile/order-history') setActiveTab("orders");
    else if (path === '/user-profile/settings') setActiveTab("settings");
    else if (path === '/user-profile' || path === '/user-profile/') setActiveTab("profile");
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/user-profile${value === 'profile' ? '' : '/' + value}`);
  };
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { // Placeholder, fetch real data in useEffect
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "555-123-4567",
    },
    mode: "onChange",
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile form submitted:", data);
    toast({ title: "Profile Updated", description: "Your profile information has been successfully saved." });
  }

  const handleNotificationChange = (key: keyof typeof notificationSettings, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
  };

  const saveNotificationSettings = () => {
    console.log("Notification settings saved:", notificationSettings);
    toast({ title: "Settings Saved", description: "Notification preferences updated." });
  };

  // Placeholder delete functions
  const handleDeleteAddress = (id: string) => {
    console.log("Delete address:", id);
    setUserAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({ title: "Address Removed", description: "The address has been removed.", variant: "destructive" });
  };

  const handleDeletePaymentMethod = (id: string) => {
    console.log("Delete payment method:", id);
    setUserPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast({ title: "Payment Method Removed", description: "The payment method has been removed.", variant: "destructive" });
  };


  return (
    <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background">
      <Header />
      <div className="container mx-auto flex-grow py-6 sm:py-8 px-4 md:px-6 flex flex-col md:flex-row gap-6 lg:gap-8">
        <aside className="w-full md:w-60 lg:w-64">
          {/* UserProfileSidebar handles its own active state based on route */}
          <UserProfileSidebar />
        </aside>
        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
              {/* These TabsTriggers also navigate, complementing UserProfileSidebar */}
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Information Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal details and contact information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="e.g., 555-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses.</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => console.log("Open add address modal/form")}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userAddresses.length > 0 ? (
                    userAddresses.map(addr => (
                      <Card key={addr.id} className="p-4 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{addr.type}</p>
                            {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.zip}, {addr.country}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => console.log("Edit address:", addr.id)}>
                            <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" /> <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">You have no saved addresses.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods Tab */}
            <TabsContent value="payment">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment options.</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => console.log("Open add payment method modal/form")}>
                     <PlusCircle className="mr-2 h-4 w-4" /> Add New Method
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                   {userPaymentMethods.length > 0 ? (
                    userPaymentMethods.map(pm => (
                      <Card key={pm.id} className="p-4 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{pm.type} ending in {pm.last4}</p>
                             {pm.isDefault && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">Expires: {pm.expiryMonth}/{pm.expiryYear}</p>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="ghost" size="icon" onClick={() => console.log("Edit payment method:", pm.id)}>
                            <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePaymentMethod(pm.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" /> <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">You have no saved payment methods.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Review your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                  {userOrders.length > 0 ? (
                    <Table>
                      <TableCaption>A list of your recent orders.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Restaurant</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.restaurantName}</TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === 'Delivered' ? 'default' : // 'default' often green/primary
                                order.status === 'Processing' ? 'secondary' : // 'secondary' often grey/blue
                                order.status === 'Cancelled' ? 'destructive' : // 'destructive' for red
                                'outline' // fallback
                              }>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/order-tracking?orderId=${order.id}`}>
                                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                     <p className="text-sm text-muted-foreground py-4 text-center">You have no past orders.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications from us.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emailMarketing"
                        checked={notificationSettings.emailMarketing}
                        onCheckedChange={(checked) => handleNotificationChange('emailMarketing', !!checked)}
                      />
                      <Label htmlFor="emailMarketing" className="font-normal">
                        Receive marketing emails and promotions.
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Checkbox 
                        id="emailOrderStatus"
                        checked={notificationSettings.emailOrderStatus}
                        onCheckedChange={(checked) => handleNotificationChange('emailOrderStatus', !!checked)}
                       />
                      <Label htmlFor="emailOrderStatus" className="font-normal">
                        Get order status updates via email.
                      </Label>
                    </div>
                     <div className="flex items-center space-x-2">
                       <Checkbox 
                        id="smsOrderStatus"
                        checked={notificationSettings.smsOrderStatus}
                        onCheckedChange={(checked) => handleNotificationChange('smsOrderStatus', !!checked)}
                       />
                      <Label htmlFor="smsOrderStatus" className="font-normal">
                        Get order status updates via SMS (if phone provided).
                      </Label>
                    </div>
                  </div>
                  <Button onClick={saveNotificationSettings}>
                    <Settings2 className="mr-2 h-4 w-4" /> Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;