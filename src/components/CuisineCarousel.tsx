import React from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pizza,
  Salad,
  Fish,
  Beef,
  Cake,
  Coffee,
  Utensils,
  Soup,
  ChefHat
} from 'lucide-react';

interface Cuisine {
  name: string;
  slug: string;
  IconComponent: React.ElementType;
}

// Sample cuisine data - in a real app, this would likely come from props or an API
const cuisines: Cuisine[] = [
  { name: 'Italian', slug: 'italian', IconComponent: Pizza },
  { name: 'Mexican', slug: 'mexican', IconComponent: Utensils }, // Placeholder, consider a more specific icon
  { name: 'Chinese', slug: 'chinese', IconComponent: Soup },
  { name: 'Indian', slug: 'indian', IconComponent: ChefHat }, // Placeholder
  { name: 'Vegetarian', slug: 'vegetarian', IconComponent: Salad },
  { name: 'Seafood', slug: 'seafood', IconComponent: Fish },
  { name: 'Steakhouse', slug: 'steakhouse', IconComponent: Beef },
  { name: 'Desserts', slug: 'desserts', IconComponent: Cake },
  { name: 'Café', slug: 'cafe', IconComponent: Coffee },
];

interface CuisineCarouselProps {
  title?: string;
  items?: Cuisine[]; // Allow passing custom cuisine items
}

const CuisineCarousel: React.FC<CuisineCarouselProps> = ({ title = "Explore Cuisines", items = cuisines }) => {
  console.log('CuisineCarousel loaded');

  if (!items || items.length === 0) {
    return null; // Don't render anything if there are no items
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {title && <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">{title}</h2>}
      <Carousel
        opts={{
          align: "start",
          loop: false, // Depending on preference, can be true if many items
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((cuisine, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
              <Link
                to={`/restaurant-listing?cuisine=${cuisine.slug}`}
                className="group block h-full"
                aria-label={`Filter by ${cuisine.name} cuisine`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 flex flex-col items-center justify-center text-center">
                  <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                    <cuisine.IconComponent className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 group-hover:scale-110 transition-transform duration-200" />
                    <p className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary transition-colors duration-200">
                      {cuisine.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 4 && <CarouselPrevious className="hidden sm:flex" />} 
        {items.length > 4 && <CarouselNext className="hidden sm:flex" />}
      </Carousel>
    </div>
  );
};

export default CuisineCarousel;