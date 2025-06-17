import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderTrackerMap from '@/components/OrderTrackerMap';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Utensils, Bike, Home as HomeIcon, Package as PackageIcon, Clock } from 'lucide-react';

// Define order stages
type OrderStatus = "CONFIRMED" | "PREPARING" | "DISPATCHED" | "DELIVERED";

const orderStages = [
  { id: "CONFIRMED", label: "Order Confirmed", Icon: CheckCircle },
  { id: "PREPARING", label: "Restaurant Preparing", Icon: Utensils },
  { id: "DISPATCHED", label: "Out for Delivery", Icon: Bike },
  { id: "DELIVERED", label: "Delivered", Icon: HomeIcon },
] as const; // Use "as const" for stricter typing of ids

const OrderTrackingPage: React.FC = () => {
  console.log('OrderTrackingPage loaded');

  const [orderId] = useState("FOODAPP-123XYZ");
  // Simulate order status progression for demonstration, or set a fixed one
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("DISPATCHED");
  const [estimatedArrivalTime] = useState("6:45 PM - 7:00 PM");

  // Placeholder locations
  const userLocation = { 
    lat: 34.0522, 
    lng: -118.2437, 
    address: "123 Main St, FoodCity, FC 90210" 
  };
  const restaurantLocation = { 
    lat: 34.0550, 
    lng: -118.2500, 
    address: "The Great Pizza Place, 456 Culinary Ave, FoodCity" 
  };
  
  const deliveryPartnerLocation = 
    (currentStatus === "DISPATCHED" || currentStatus === "DELIVERED") 
    ? { lat: 34.0535, lng: -118.2480, address: "En route near Downtown" } 
    : undefined;

  const progressValues: Record<OrderStatus, number> = {
    CONFIRMED: 25,
    PREPARING: 50,
    DISPATCHED: 75,
    DELIVERED: 100,
  };
  const progressValue = progressValues[currentStatus];

  const statusMessages: Record<OrderStatus, string> = {
    CONFIRMED: "Your order has been confirmed by the restaurant.",
    PREPARING: "The restaurant is preparing your delicious meal.",
    DISPATCHED: "Your order is on its way!",
    DELIVERED: "Your order has been delivered. Enjoy!",
  };
  
  // Example order items
  const orderItems = [
    { name: "Pepperoni Feast Pizza", quantity: 1, price: 18.99 },
    { name: "Garlic Knots (6 pcs)", quantity: 1, price: 6.50 },
    { name: "Soda (2L)", quantity: 1, price: 3.00 },
  ];
  const orderTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  // Simulate status update (optional, for dynamic demo if page were interactive)
  // useEffect(() => {
  //   if (currentStatus !== "DELIVERED") {
  //     const currentIndex = orderStages.findIndex(s => s.id === currentStatus);
  //     const nextIndex = (currentIndex + 1) % orderStages.length;
  //     const timer = setTimeout(() => {
  //       setCurrentStatus(orderStages[nextIndex].id);
  //     }, 15000); // Change status every 15 seconds
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentStatus]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <section aria-labelledby="order-tracking-title" className="mb-8 text-center">
            <h1 id="order-tracking-title" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
              Track Your Order
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Order ID: <span className="font-semibold text-primary">{orderId}</span>
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Map Section */}
            <section className="lg:col-span-2" aria-labelledby="map-section-title">
              <h2 id="map-section-title" className="sr-only">Delivery Map</h2>
              <OrderTrackerMap
                userAddressLocation={userLocation}
                restaurantLocation={restaurantLocation}
                deliveryPartnerLocation={deliveryPartnerLocation}
                estimatedArrivalTime={estimatedArrivalTime}
              />
            </section>

            {/* Order Status Details Section */}
            <section className="lg:col-span-1" aria-labelledby="status-section-title">
               <h2 id="status-section-title" className="sr-only">Order Status Details</h2>
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Order Status</CardTitle>
                  <CardDescription className="flex items-center pt-1">
                     <Clock className="h-4 w-4 mr-2 text-gray-500" /> 
                     Estimated Arrival: {estimatedArrivalTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-md font-medium text-gray-700 mb-2">{statusMessages[currentStatus]}</p>
                    <Progress value={progressValue} aria-label={`Order progress: ${progressValue}%`} className="w-full h-2.5" />
                  </div>

                  <ul className="space-y-3">
                    {orderStages.map((stage, index) => {
                      const currentStageIndex = orderStages.findIndex(s => s.id === currentStatus);
                      const isCompleted = index < currentStageIndex;
                      const isActive = index === currentStageIndex;
                      
                      let iconColor = "text-gray-400";
                      let textColor = "text-muted-foreground";

                      if (isCompleted) {
                        iconColor = "text-green-500";
                        textColor = "text-gray-700 line-through";
                      } else if (isActive) {
                        iconColor = "text-primary";
                        textColor = "text-primary font-semibold";
                      }

                      return (
                        <li key={stage.id} className="flex items-center">
                          <stage.Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${iconColor} ${isActive && stage.id === "DISPATCHED" ? "animate-pulse" : ""}`} />
                          <span className={`text-sm ${textColor}`}>
                            {stage.label}
                          </span>
                          {isCompleted && <CheckCircle className="ml-auto h-5 w-5 text-green-500 flex-shrink-0" />}
                        </li>
                      );
                    })}
                  </ul>
                  
                  <Separator />

                  <div>
                    <h3 className="text-md font-semibold mb-2 flex items-center">
                        <PackageIcon className="h-5 w-5 mr-2 text-gray-600" />
                        Order Summary
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {orderItems.map(item => (
                            <li key={item.name} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                        <Separator className="my-1" />
                        <li className="flex justify-between font-semibold text-gray-700">
                            <span>Total</span>
                            <span>${orderTotal.toFixed(2)}</span>
                        </li>
                    </ul>
                  </div>

                  <Separator />
                  
                  <div>
                    <h3 className="text-md font-semibold mb-1">Delivery To:</h3>
                    <p className="text-sm text-muted-foreground">{userLocation.address}</p>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Need Help? Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;