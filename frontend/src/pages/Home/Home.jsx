import React, { useEffect } from "react";

import { useVehicleStore } from "../../stores/useVehicleStore.js";
import { useReviewStore } from "../../stores/useReviewsStore.js";
import { useUserStore } from "../../stores/useUserStore.js";
import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import FeaturedVehiclesSection from "../../components/home/FeaturedVehiclesSection";
import CategoriesSection from "../../components/home/CategoriesSection";
import ReviewsSection from "../../components/home/ReviewsSection";
import CTASection from "../../components/home/CTASection";

const HomePage = () => {
  const { vehicles, getAvailableVehicles } = useVehicleStore();
  const { reviews, getAllReviews } = useReviewStore();
  const { user } = useUserStore();

  useEffect(() => {
    getAvailableVehicles();
    getAllReviews();
  }, [getAvailableVehicles, getAllReviews]);

  // Get featured vehicles (first 4)
  const featuredVehicles = vehicles.slice(0, 4);

  // Get recent reviews (first 3)
  const recentReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection user={user} />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Vehicles */}
      <FeaturedVehiclesSection vehicles={featuredVehicles} />

      {/* Categories */}
      <CategoriesSection />

      {/* Recent Reviews */}
      <ReviewsSection reviews={recentReviews}  />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;
