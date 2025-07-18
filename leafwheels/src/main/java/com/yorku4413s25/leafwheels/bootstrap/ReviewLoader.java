package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.domain.Review;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.repositories.ReviewRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
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
    
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        if (reviewRepository.count() == 0) {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Review> reviews = new ArrayList<>();
            
            // Generate fake user IDs for reviews
            List<UUID> userIds = generateFakeUserIds(50);
            
            // Group vehicles by make/model to create reviews for make/model combinations
            Map<String, List<Vehicle>> vehiclesByMakeModel = vehicles.stream()
                    .collect(Collectors.groupingBy(v -> v.getMake() + ":" + v.getModel()));
            
            for (Map.Entry<String, List<Vehicle>> entry : vehiclesByMakeModel.entrySet()) {
                String[] parts = entry.getKey().split(":");
                Make make = Make.valueOf(parts[0]);
                String model = parts[1];
                
                // 70% chance this make/model has reviews
                if (random.nextDouble() < 0.7) {
                    int numReviews = Math.min(generateNumReviews(), userIds.size()); // Can't have more reviews than users
                    
                    // Shuffle user IDs to ensure unique users for this make/model
                    List<UUID> shuffledUserIds = new ArrayList<>(userIds);
                    Collections.shuffle(shuffledUserIds, random);
                    
                    for (int i = 0; i < numReviews; i++) {
                        Review review = createRealisticReview(make, model, shuffledUserIds.get(i));
                        reviews.add(review);
                    }
                }
            }
            
            reviewRepository.saveAll(reviews);
            
            System.out.println("Seeded " + reviews.size() + " review records for " + 
                             vehiclesByMakeModel.size() + " make/model combinations.");
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
    
    private Review createRealisticReview(Make make, String model, UUID userId) {
        int rating = generateRealisticRating();
        String comment = generateRealisticComment(make, model, rating);
        
        return Review.builder()
                .userId(userId)
                .make(make)
                .model(model)
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
    
    private String generateRealisticComment(Make make, String model, int rating) {
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
        
        String makeModel = make + " " + model;
        
        if (rating >= 4) {
            return addVehicleSpecificTouch(positiveComments.get(random.nextInt(positiveComments.size())), makeModel);
        } else if (rating == 3) {
            return addVehicleSpecificTouch(neutralComments.get(random.nextInt(neutralComments.size())), makeModel);
        } else {
            return addVehicleSpecificTouch(negativeComments.get(random.nextInt(negativeComments.size())), makeModel);
        }
    }
    
    private String addVehicleSpecificTouch(String baseComment, String makeModel) {
        // Occasionally add vehicle-specific context
        if (random.nextDouble() < 0.3) {
            List<String> vehicleContexts = Arrays.asList(
                    " This " + makeModel + " exceeded my expectations.",
                    " Perfect choice for a " + makeModel + ".",
                    " Would buy another " + makeModel + " in the future.",
                    " The " + makeModel + " handles really well.",
                    " This particular " + makeModel + " model is solid."
            );
            return baseComment + vehicleContexts.get(random.nextInt(vehicleContexts.size()));
        }
        return baseComment;
    }
}