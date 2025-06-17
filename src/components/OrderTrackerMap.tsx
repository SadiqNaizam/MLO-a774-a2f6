import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Bike, Home, Landmark } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface OrderTrackerMapProps {
  deliveryPartnerLocation?: Location;
  userAddressLocation: Location;
  restaurantLocation: Location;
  // In a real implementation, routeCoordinates would be used to draw the path
  // routeCoordinates?: Location[]; 
  estimatedArrivalTime?: string;
}

const OrderTrackerMap: React.FC<OrderTrackerMapProps> = ({
  deliveryPartnerLocation,
  userAddressLocation,
  restaurantLocation,
  estimatedArrivalTime,
}) => {
  console.log('OrderTrackerMap loaded');

  // Placeholder coordinates for visual representation if actual data isn't passed
  const partnerPos = deliveryPartnerLocation ? { top: '50%', left: '50%' } : { top: '45%', left: '60%' }; // Example positions
  const userPos = { top: '80%', left: '70%' }; // Example positions
  const restaurantPos = { top: '20%', left: '30%' }; // Example positions

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Delivery Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-md overflow-hidden border border-gray-300">
          {/* Placeholder for map tiles */}
          <div className="absolute inset-0 bg-blue-100 opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 bg-white/70 p-2 rounded shadow">
              Map Integration Placeholder
            </p>
          </div>

          {/* Restaurant Location */}
          <div
            className="absolute p-1 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: restaurantPos.top, left: restaurantPos.left }}
            title={`Restaurant: ${restaurantLocation.address || 'Origin'}`}
          >
            <Landmark className="h-6 w-6 text-orange-500" />
          </div>

          {/* User Address Location */}
          <div
            className="absolute p-1 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: userPos.top, left: userPos.left }}
            title={`Your Address: ${userAddressLocation.address || 'Destination'}`}
          >
            <Home className="h-6 w-6 text-blue-500" />
          </div>

          {/* Delivery Partner Location (if available) */}
          {deliveryPartnerLocation && (
            <div
              className="absolute p-1 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
              style={{ top: partnerPos.top, left: partnerPos.left }}
              title={`Delivery Partner: ${deliveryPartnerLocation.address || 'Current Location'}`}
            >
              <Bike className="h-7 w-7 text-green-600 animate-pulse" />
            </div>
          )}

          {/* Placeholder for route line (SVG or styled divs) */}
          {/* This is a very simplified representation */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1={restaurantPos.left} y1={restaurantPos.top}
              x2={partnerPos.left} y2={partnerPos.top}
              stroke="#FDBA74" strokeWidth="3" strokeDasharray="5,5"
              style={{
                transform: 'scale(1, 1) translate(0, 0)', // Adjust if necessary
                transformOrigin: 'center center',
              }}
            />
            {deliveryPartnerLocation && (
                <line
                x1={partnerPos.left} y1={partnerPos.top}
                x2={userPos.left} y2={userPos.top}
                stroke="#60A5FA" strokeWidth="3" strokeDasharray="5,5"
                style={{
                    transform: 'scale(1, 1) translate(0, 0)', // Adjust if necessary
                    transformOrigin: 'center center',
                }}
                />
            )}
            {!deliveryPartnerLocation && (
                <line
                    x1={restaurantPos.left} y1={restaurantPos.top}
                    x2={userPos.left} y2={userPos.top}
                    stroke="#A5B4FC" strokeWidth="3" strokeDasharray="5,5"
                    style={{
                        transform: 'scale(1, 1) translate(0, 0)', // Adjust if necessary
                        transformOrigin: 'center center',
                    }}
                />
            )}
          </svg>

        </div>
        {estimatedArrivalTime && (
          <div className="mt-4 text-center">
            <p className="text-md font-medium text-gray-700">
              Estimated Arrival: <span className="font-bold text-green-600">{estimatedArrivalTime}</span>
            </p>
          </div>
        )}
        <div className="mt-2 text-sm text-center text-gray-500">
          <p>This is a visual representation. Actual map integration (e.g., Google Maps, Mapbox) would provide live tracking.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackerMap;