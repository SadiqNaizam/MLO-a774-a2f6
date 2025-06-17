import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, Tag } from 'lucide-react';

interface RestaurantCardProps {
  slug: string; // Unique identifier for navigation (e.g., "pasta-paradise")
  imageUrl: string;
  name: string;
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  specialOffer?: string; // e.g., "20% OFF"
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  slug,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  deliveryTime,
  specialOffer,
}) => {
  console.log('RestaurantCard loaded for:', name);

  return (
    <Link to={`/restaurant-menu?slug=${slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {specialOffer && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10 text-xs px-2 py-1">
              <Tag className="mr-1 h-3 w-3" /> {specialOffer}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary truncate" title={name}>
            {name}
          </h3>
          
          {cuisineTypes && cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.slice(0, 3).map((cuisine) => ( // Show max 3 cuisine types for brevity
                <Badge key={cuisine} variant="secondary" className="text-xs font-normal">
                  {cuisine}
                </Badge>
              ))}
              {cuisineTypes.length > 3 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{cuisineTypes.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-2"> {/* mt-auto pushes this to bottom */}
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{rating ? rating.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;