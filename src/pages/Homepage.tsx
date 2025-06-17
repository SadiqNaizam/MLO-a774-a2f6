import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CuisineCarousel from '@/components/CuisineCarousel';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Icons
import { Search } from 'lucide-react';

const popularRestaurantsData = [
  {
    slug: "pizza-palace-123",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=60",
    name: "Pizza Palace",
    cuisineTypes: ["Italian", "Pizza", "Pasta"],
    rating: 4.5,
    deliveryTime: "25-35 min",
    specialOffer: "15% OFF",
  },
  {
    slug: "burger-bliss-456",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=60",
    name: "Burger Bliss",
    cuisineTypes: ["American", "Burgers", "Fries"],
    rating: 4.2,
    deliveryTime: "20-30 min",
  },
  {
    slug: "sushi-central-789",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=60",
    name: "Sushi Central",
    cuisineTypes: ["Japanese", "Sushi", "Seafood"],
    rating: 4.8,
    deliveryTime: "30-40 min",
    specialOffer: "Free Edamame",
  },
  {
    slug: "taco-fiesta-101",
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=400&q=60",
    name: "Taco Fiesta",
    cuisineTypes: ["Mexican", "Tacos", "Burritos"],
    rating: 4.3,
    deliveryTime: "20-25 min",
  }
];

const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  console.log('Homepage loaded');

  const handleHomepageSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurant-listing?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section with Prominent Search */}
        <section className="relative py-16 md:py-24 lg:py-32 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1950&q=80')" }} // Vibrant food collage
          >
            <div className="absolute inset-0 bg-black/60"></div> {/* Dark overlay */}
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Your Next Meal, Delivered.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Browse local restaurants, discover new flavors, and get your food delivered fast.
            </p>
            <form onSubmit={handleHomepageSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 px-4">
              <Input
                type="search"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow h-14 text-lg px-5 !ring-offset-background !bg-white !text-gray-900 placeholder:!text-gray-500 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
                aria-label="Search for food"
              />
              <Button type="submit" size="lg" className="h-14 text-lg px-8 bg-primary hover:bg-primary/90">
                <Search className="mr-2 h-5 w-5" /> Find Food
              </Button>
            </form>
          </div>
        </section>

        {/* Cuisine Carousel Section */}
        <section className="py-12 md:py-16 bg-background">
          <CuisineCarousel title="Explore Cuisines" />
        </section>

        {/* Popular Restaurants Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
              Popular Restaurants Near You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {popularRestaurantsData.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.slug}
                  slug={restaurant.slug}
                  imageUrl={restaurant.imageUrl}
                  name={restaurant.name}
                  cuisineTypes={restaurant.cuisineTypes}
                  rating={restaurant.rating}
                  deliveryTime={restaurant.deliveryTime}
                  specialOffer={restaurant.specialOffer}
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" asChild variant="outline">
                <Link to="/restaurant-listing">
                  View All Restaurants
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Call to Action / App Features (Optional - based on project growth) */}
        <section className="py-12 md:py-16 bg-muted/40">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Why Choose FoodApp?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We offer a seamless experience from browsing to delivery, connecting you with the best local food.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-primary">Wide Selection</h3>
                <p className="text-muted-foreground">Access hundreds of restaurants and diverse cuisines.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-primary">Fast Delivery</h3>
                <p className="text-muted-foreground">Get your meals delivered quickly to your doorstep.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2 text-primary">Easy Ordering</h3>
                <p className="text-muted-foreground">Simple, intuitive interface for a hassle-free experience.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Homepage;