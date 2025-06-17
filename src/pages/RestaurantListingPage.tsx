import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RestaurantCard from '@/components/RestaurantCard';

// Shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For structuring filter section
import { Search, Filter, X } from 'lucide-react';

// Placeholder data for RestaurantCardProps
interface RestaurantData {
  slug: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  specialOffer?: string;
  // Placeholder for actual filterable properties
  isOpen?: boolean; 
  hasFreeDeliveryOption?: boolean; 
}

const sampleRestaurants: RestaurantData[] = [
  { slug: "pasta-paradise", imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Pasta Paradise", cuisineTypes: ["Italian", "Pasta", "Pizza"], rating: 4.7, deliveryTime: "25-35 min", specialOffer: "15% OFF", isOpen: true, hasFreeDeliveryOption: false },
  { slug: "sushi-central", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Sushi Central", cuisineTypes: ["Japanese", "Sushi"], rating: 4.9, deliveryTime: "30-40 min", isOpen: true, hasFreeDeliveryOption: true },
  { slug: "burger-bliss", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Burger Bliss", cuisineTypes: ["American", "Burgers", "Fries"], rating: 4.5, deliveryTime: "20-30 min", specialOffer: "Free Fries", isOpen: false, hasFreeDeliveryOption: true },
  { slug: "taco-fiesta", imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Taco Fiesta", cuisineTypes: ["Mexican", "Tacos"], rating: 4.6, deliveryTime: "25-35 min", isOpen: true, hasFreeDeliveryOption: false },
  { slug: "veggie-delight", imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Veggie Delight", cuisineTypes: ["Vegetarian", "Salads", "Healthy"], rating: 4.8, deliveryTime: "30-40 min", specialOffer: "Organic", isOpen: true, hasFreeDeliveryOption: true },
  { slug: "pho-king-good", imageUrl: "https://images.unsplash.com/photo-1585154502093-954393647357?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Pho King Good", cuisineTypes: ["Vietnamese", "Noodles", "Pho"], rating: 4.7, deliveryTime: "35-45 min", isOpen: false, hasFreeDeliveryOption: false },
  { slug: "curry-house", imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "The Curry House", cuisineTypes: ["Indian", "Curry"], rating: 4.6, deliveryTime: "30-40 min", specialOffer: "Family Deal", isOpen: true, hasFreeDeliveryOption: false },
  { slug: "bbq-joint", imageUrl: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Smokin' BBQ Joint", cuisineTypes: ["American", "BBQ", "Ribs"], rating: 4.4, deliveryTime: "40-50 min", isOpen: true, hasFreeDeliveryOption: true },
  { slug: "pizza-haven", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Pizza Haven", cuisineTypes: ["Italian", "Pizza"], rating: 4.5, deliveryTime: "25-30 min", isOpen: true, hasFreeDeliveryOption: false },
  { slug: "healthy-eats", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba1a503?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=60", name: "Healthy Eats", cuisineTypes: ["Healthy", "Salads", "Smoothies"], rating: 4.9, deliveryTime: "15-25 min", specialOffer: "10% off Salads", isOpen: true, hasFreeDeliveryOption: true },
];

const cuisineOptions = ['All', 'Italian', 'Japanese', 'American', 'Mexican', 'Indian', 'Vegetarian', 'Vietnamese', 'Pizza', 'Burgers', 'Sushi', 'Healthy'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating_desc', label: 'Rating (High to Low)' },
  { value: 'delivery_time_asc', label: 'Delivery Time (Fastest)' },
  { value: 'name_asc', label: 'Name (A-Z)' },
];

const ITEMS_PER_PAGE = 8;

const RestaurantListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [filterOpenNow, setFilterOpenNow] = useState<boolean>(false);
  const [filterFreeDelivery, setFilterFreeDelivery] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Effect to initialize state from URL parameters
  useEffect(() => {
    console.log('RestaurantListingPage loaded and parsing URL params');
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCuisine(searchParams.get('cuisine') || 'all');
    setSortBy(searchParams.get('sort') || 'relevance');
    setFilterOpenNow(searchParams.get('open') === 'true');
    setFilterFreeDelivery(searchParams.get('delivery') === 'true');
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Memoized calculation for filtered and sorted restaurants
  const processedRestaurants = useMemo(() => {
    let filtered = [...sampleRestaurants];

    // Search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(lowerSearchTerm) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Cuisine
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(r => r.cuisineTypes.map(c => c.toLowerCase()).includes(selectedCuisine.toLowerCase()));
    }

    // Open Now
    if (filterOpenNow) {
      filtered = filtered.filter(r => r.isOpen);
    }

    // Free Delivery
    if (filterFreeDelivery) {
      filtered = filtered.filter(r => r.hasFreeDeliveryOption);
    }
    
    // Sorting
    switch (sortBy) {
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time_asc':
        filtered.sort((a, b) => parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance (current order or could be more complex)
        break;
    }
    return filtered;
  }, [searchTerm, selectedCuisine, sortBy, filterOpenNow, filterFreeDelivery]);

  const totalPages = Math.ceil(processedRestaurants.length / ITEMS_PER_PAGE);
  const currentRestaurants = processedRestaurants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Function to update URL search parameters
  const updateURLParams = (newParams: Record<string, string | null | boolean>) => {
    const oldParams = Object.fromEntries(searchParams.entries());
    const combinedParams: Record<string, string> = {};

    // Merge old and new, removing null/false/'all'/'relevance'/1 values
    const defaults = { cuisine: 'all', sort: 'relevance', page: '1', open: false, delivery: false, search: '' };
    
    Object.entries({ ...oldParams, ...newParams }).forEach(([key, value]) => {
      if (String(value) && value !== defaults[key as keyof typeof defaults]) {
         if (typeof value === 'boolean') {
           combinedParams[key] = value ? 'true' : ''; // only set if true, remove if false
         } else {
           combinedParams[key] = String(value);
         }
      }
    });
    // Clean up empty strings from boolean false values
    Object.keys(combinedParams).forEach(key => {
      if (combinedParams[key] === '') delete combinedParams[key];
    });

    setSearchParams(combinedParams, { replace: true });
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    updateURLParams({ search: newSearchTerm, page: '1' });
  };

  const handleCuisineChange = (value: string) => {
    setSelectedCuisine(value);
    setCurrentPage(1);
    updateURLParams({ cuisine: value, page: '1' });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // No page reset on sort typically, sorts current view
    updateURLParams({ sort: value });
  };
  
  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, paramName: string, checked: boolean) => {
    setter(checked);
    setCurrentPage(1);
    updateURLParams({ [paramName]: checked, page: '1' });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateURLParams({ page: page.toString() });
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('all');
    setSortBy('relevance');
    setFilterOpenNow(false);
    setFilterFreeDelivery(false);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Max number of page links to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
          className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          aria-disabled={currentPage === 1}
        />
      </PaginationItem>
    );

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
          className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          aria-disabled={currentPage === totalPages || totalPages === 0}
        />
      </PaginationItem>
    );
    return items;
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-6 md:py-10 px-4">
        <section aria-labelledby="page-title" className="mb-6 md:mb-8 text-center md:text-left">
          <h1 id="page-title" className="text-3xl md:text-4xl font-bold tracking-tight">
            Find Your Next Meal
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Explore restaurants, filter by cuisine, and sort by your preference.
          </p>
        </section>

        <Card className="mb-8 shadow-lg border">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <Filter className="mr-2 h-5 w-5" /> Filters & Sort
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-end">
              <div className="lg:col-span-1">
                <Label htmlFor="search-restaurants" className="text-sm font-medium">Search Restaurants</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-restaurants"
                    type="search"
                    placeholder="Name or cuisine..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cuisine-filter" className="text-sm font-medium">Cuisine</Label>
                <Select value={selectedCuisine} onValueChange={handleCuisineChange}>
                  <SelectTrigger id="cuisine-filter" className="mt-1">
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cuisines</SelectLabel>
                      {cuisineOptions.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-by" className="text-sm font-medium">Sort by</Label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger id="sort-by" className="mt-1">
                    <SelectValue placeholder="Sort options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort Options</SelectLabel>
                      {sortOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                        id="filter-open" 
                        checked={filterOpenNow} 
                        onCheckedChange={(checked) => handleCheckboxChange(setFilterOpenNow, 'open', !!checked)}
                    />
                    <Label htmlFor="filter-open" className="font-normal cursor-pointer">Open Now</Label>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox 
                        id="filter-delivery" 
                        checked={filterFreeDelivery}
                        onCheckedChange={(checked) => handleCheckboxChange(setFilterFreeDelivery, 'delivery', !!checked)}
                    />
                    <Label htmlFor="filter-delivery" className="font-normal cursor-pointer">Free Delivery</Label>
                </div>
                <div className="sm:col-start-3 sm:justify-self-end mt-2 sm:mt-0">
                     <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                        <X className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        <section aria-labelledby="restaurant-list-title">
          <h2 id="restaurant-list-title" className="sr-only">Restaurant List</h2>
          {currentRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.slug} {...restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-gray-700">No Restaurants Found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
               <Button variant="link" onClick={resetFilters} className="mt-4">Clear all filters</Button>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="mt-10 md:mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantListingPage;