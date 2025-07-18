package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Order(5)
public class ReviewLoader implements CommandLineRunner {

    private final ReviewRepository reviewRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleService vehicleService;
    
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        if (reviewRepository.count() == 0) {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Review> reviews = new ArrayList<>();
            
            // Generate fake user IDs for reviews
            List<UUID> userIds = generateFakeUserIds(50);
            
            for (Vehicle vehicle : vehicles) {
                // 70% chance vehicle has reviews
                if (random.nextDouble() < 0.7) {
                    int numReviews = generateNumReviews();
                    
                    for (int i = 0; i < numReviews; i++) {
                        Review review = createRealisticReview(vehicle, userIds);
                        reviews.add(review);
                    }
                }
            }
            
            reviewRepository.saveAll(reviews);
            
            // Update vehicle ratings for all vehicles that have reviews
            Set<UUID> vehiclesWithReviews = reviews.stream()
                    .map(Review::getVehicleId)
                    .collect(Collectors.toSet());
            
            for (UUID vehicleId : vehiclesWithReviews) {
                vehicleService.updateVehicleRatings(vehicleId);
            }
            
            System.out.println("Seeded " + reviews.size() + " review records for " + 
                             vehiclesWithReviews.size() + " vehicles.");
        } else {
            System.out.println("Reviews already present — skipping seeding.");
        }
    }
    
    private List<UUID> generateFakeUserIds(int count) {
        List<UUID> userIds = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            userIds.add(UUID.randomUUID());
        }
        return userIds;
    }
    
    private int generateNumReviews() {
        // Weighted distribution: more vehicles have fewer reviews
        double rand = random.nextDouble();
        if (rand < 0.4) return 1;
        if (rand < 0.7) return 2;
        if (rand < 0.85) return 3;
        if (rand < 0.95) return 4;
        return 5;
    }
    
    private Review createRealisticReview(Vehicle vehicle, List<UUID> userIds) {
        int rating = generateRealisticRating();
        String comment = generateRealisticComment(vehicle, rating);
        
        return Review.builder()
                .userId(userIds.get(random.nextInt(userIds.size())))
                .vehicleId(vehicle.getId())
                .rating(rating)
                .comment(comment)
                .build();
    }
    
    private int generateRealisticRating() {
        // Weighted distribution favoring positive reviews
        // 15% - 5 stars, 35% - 4 stars, 30% - 3 stars, 15% - 2 stars, 5% - 1 star
        double rand = random.nextDouble();
        if (rand < 0.15) return 5;
        if (rand < 0.50) return 4;
        if (rand < 0.80) return 3;
        if (rand < 0.95) return 2;
        return 1;
    }
    
    private String generateRealisticComment(Vehicle vehicle, int rating) {
        // 30% chance of no comment
        if (random.nextDouble() < 0.3) {
            return null;
        }
        
        List<String> positiveComments = Arrays.asList(
                "Great electric vehicle! Very smooth and quiet ride.",
                "Love the acceleration and efficiency. Perfect for daily commuting.",
                "Excellent build quality and modern features. Highly recommend!",
                "Amazing range and fast charging. No more range anxiety!",
                "Best EV purchase I've made. The technology is impressive.",
                "Comfortable interior and intuitive infotainment system.",
                "Outstanding performance and environmental friendliness.",
                "Perfect family car with plenty of space and safety features.",
                "Incredible value for money. No regrets with this purchase!",
                "The driving experience is so much better than gas cars."
        );
        
        List<String> neutralComments = Arrays.asList(
                "Decent electric vehicle overall. Does what it's supposed to do.",
                "Good car but charging infrastructure could be better in my area.",
                "Solid performance, though I expected a bit more range.",
                "Nice features but the learning curve for the tech was steep.",
                "Good build quality but some minor issues with software updates.",
                "Comfortable ride but wish it had more storage space.",
                "Does the job well but nothing particularly exceptional.",
                "Good value but there are better options in this price range.",
                "Reliable transportation with some room for improvement.",
                "Average experience overall. Some pros and cons to consider."
        );
        
        List<String> negativeComments = Arrays.asList(
                "Range is not as advertised. Disappointed with real-world performance.",
                "Too many software glitches and charging issues.",
                "Build quality concerns and expensive maintenance costs.",
                "Not impressed with the customer service experience.",
                "Charging takes too long and infrastructure is lacking.",
                "Interior materials feel cheap for the price point.",
                "Several reliability issues within the first year.",
                "Range anxiety is real with this vehicle in winter.",
                "Expected more for this price. Better alternatives available.",
                "Quality control issues and frequent service appointments needed."
        );
        
        String modelYear = vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel();
        
        if (rating >= 4) {
            return addVehicleSpecificTouch(positiveComments.get(random.nextInt(positiveComments.size())), modelYear);
        } else if (rating == 3) {
            return addVehicleSpecificTouch(neutralComments.get(random.nextInt(neutralComments.size())), modelYear);
        } else {
            return addVehicleSpecificTouch(negativeComments.get(random.nextInt(negativeComments.size())), modelYear);
        }
    }
    
    private String addVehicleSpecificTouch(String baseComment, String modelYear) {
        // Occasionally add vehicle-specific context
        if (random.nextDouble() < 0.3) {
            List<String> vehicleContexts = Arrays.asList(
                    " This " + modelYear + " exceeded my expectations.",
                    " Perfect choice for a " + modelYear + ".",
                    " Would buy another " + modelYear + " in the future.",
                    " The " + modelYear + " handles really well.",
                    " This particular " + modelYear + " model is solid."
            );
            return baseComment + vehicleContexts.get(random.nextInt(vehicleContexts.size()));
        }
        return baseComment;
    }
}