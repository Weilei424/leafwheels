package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import com.yorku4413s25.leafwheels.web.models.VehicleDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatIntentHandlerService {
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;
    
    public String handleIntent(String intent, Map<String, String> slots, String username) {
        if (intent == null) {
            return "I'm not sure how I can help you. Could you please be more specific?";
        }
        
        switch (intent.toLowerCase()) {
            case "searchvehicles":
            case "findvehicle":
                return handleVehicleSearch(slots);
                
            case "addtocart":
                return handleAddToCart(slots, username);
                
            case "viewcart":
                return handleViewCart(username);
                
            case "getvehicledetails":
                return handleGetVehicleDetails(slots);
                
            case "getprice":
            case "pricing":
                return handlePricing(slots);
                
            case "availability":
                return handleAvailability(slots);
                
            case "greeting":
                return handleGreeting();
                
            case "help":
                return handleHelp();
                
            case "goodbye":
                return handleGoodbye();
                
            default:
                return handleUnknownIntent(intent);
        }
    }
    
    private String handleVehicleSearch(Map<String, String> slots) {
        try {
            // Extract search parameters from slots
            Make make = parseMake(slots.get("make"));
            String model = slots.get("model");
            BodyType bodyType = parseBodyType(slots.get("bodyType"));
            BigDecimal minPrice = parsePrice(slots.get("minPrice"));
            BigDecimal maxPrice = parsePrice(slots.get("maxPrice"));
            Integer year = parseYear(slots.get("year"));
            
            Pageable pageable = PageRequest.of(0, 10); // Limit to first 10 results
            
            Page<VehicleDto> vehicles = vehicleService.filterVehicles(
                year, make, model, bodyType, null, null, null, null, null, null, null,
                minPrice, maxPrice, null, null, List.of(VehicleStatus.AVAILABLE), null, pageable
            );
            
            if (vehicles.isEmpty()) {
                return "I couldn't find any vehicles matching your criteria. Would you like to try different search parameters?";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("I found ").append(vehicles.getTotalElements()).append(" vehicle(s) for you:\n\n");
            
            for (VehicleDto vehicle : vehicles.getContent()) {
                response.append("• ").append(vehicle.getYear()).append(" ")
                        .append(vehicle.getMake()).append(" ").append(vehicle.getModel())
                        .append(" - $").append(vehicle.getPrice())
                        .append(" (").append(vehicle.getMileage()).append(" miles)\n");
            }
            
            if (vehicles.getTotalElements() > 10) {
                response.append("\nShowing first 10 results. Would you like to see more or refine your search?");
            }
            
            return response.toString();
            
        } catch (Exception e) {
            return "I encountered an error while searching for vehicles. Please try again with different criteria.";
        }
    }
    
    private String handleAddToCart(Map<String, String> slots, String username) {
        if (username == null) {
            return "Please log in to add items to your cart.";
        }
        
        try {
            String vehicleIdStr = slots.get("vehicleId");
            if (vehicleIdStr == null || vehicleIdStr.isEmpty()) {
                return "I need a vehicle ID to add it to your cart. Which specific vehicle would you like to add?";
            }
            
            UUID vehicleId = UUID.fromString(vehicleIdStr);
            Optional<User> userOpt = userRepository.findByEmail(username);
            
            if (userOpt.isEmpty()) {
                return "I couldn't find your user account. Please make sure you're logged in.";
            }
            
            CreateCartItemDto cartItem = new CreateCartItemDto();
            cartItem.setVehicleId(vehicleId);
            cartItem.setQuantity(1);
            
            CartDto cart = cartService.addItemToCart(userOpt.get().getId(), cartItem);
            
            return "Great! I've added the vehicle to your cart. You now have " + 
                   cart.getItems().size() + " item(s) in your cart.";
            
        } catch (IllegalArgumentException e) {
            return "Invalid vehicle ID format. Please provide a valid vehicle ID.";
        } catch (Exception e) {
            return "I couldn't add the vehicle to your cart. Please try again.";
        }
    }
    
    private String handleViewCart(String username) {
        if (username == null) {
            return "Please log in to view your cart.";
        }
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isEmpty()) {
                return "I couldn't find your user account. Please make sure you're logged in.";
            }
            
            CartDto cart = cartService.getCartByUserId(userOpt.get().getId());
            
            if (cart.getItems().isEmpty()) {
                return "Your cart is empty. Would you like me to help you find some vehicles?";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("Here's what's in your cart:\n\n");
            
            BigDecimal total = BigDecimal.ZERO;
            for (var item : cart.getItems()) {
                if (item.getVehicle() != null) {
                    VehicleDto vehicle = item.getVehicle();
                    response.append("• ").append(vehicle.getYear()).append(" ")
                            .append(vehicle.getMake()).append(" ").append(vehicle.getModel())
                            .append(" - $").append(vehicle.getPrice()).append("\n");
                    total = total.add(vehicle.getPrice());
                }
            }
            
            response.append("\nTotal: $").append(total);
            response.append("\n\nWould you like to proceed to checkout or continue shopping?");
            
            return response.toString();
            
        } catch (Exception e) {
            return "I couldn't retrieve your cart. Please try again.";
        }
    }
    
    private String handleGetVehicleDetails(Map<String, String> slots) {
        try {
            String vehicleIdStr = slots.get("vehicleId");
            if (vehicleIdStr == null || vehicleIdStr.isEmpty()) {
                return "I need a vehicle ID to get the details. Which vehicle would you like to know more about?";
            }
            
            UUID vehicleId = UUID.fromString(vehicleIdStr);
            VehicleDto vehicle = vehicleService.getById(vehicleId);
            
            if (vehicle == null) {
                return "I couldn't find a vehicle with that ID. Please check the ID and try again.";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("Here are the details for the ").append(vehicle.getYear())
                    .append(" ").append(vehicle.getMake()).append(" ").append(vehicle.getModel()).append(":\n\n");
            
            response.append("Price: $").append(vehicle.getPrice()).append("\n");
            response.append("Mileage: ").append(vehicle.getMileage()).append(" miles\n");
            response.append("Body Type: ").append(vehicle.getBodyType()).append("\n");
            response.append("Color: ").append(vehicle.getExteriorColor()).append("\n");
            response.append("Condition: ").append(vehicle.getCondition()).append("\n");
            
            if (vehicle.getBatteryRange() != 0) {
                response.append("Battery Range: ").append(vehicle.getBatteryRange()).append(" miles\n");
            }
            
            if (vehicle.getOnDeal() != null && vehicle.getOnDeal()) {
                response.append("This vehicle is currently on sale!\n");
            }
            
            response.append("\nWould you like to add this vehicle to your cart?");
            
            return response.toString();
            
        } catch (IllegalArgumentException e) {
            return "Invalid vehicle ID format. Please provide a valid vehicle ID.";
        } catch (Exception e) {
            return "I couldn't retrieve the vehicle details. Please try again.";
        }
    }
    
    private String handlePricing(Map<String, String> slots) {
        String vehicleType = slots.get("vehicleType");
        if (vehicleType == null) {
            return "Our vehicles range from $15,000 for used cars to $80,000+ for premium electric vehicles. " +
                   "What type of vehicle are you interested in?";
        }
        
        return "Pricing varies based on the specific model, year, and condition. " +
               "Would you like me to search for " + vehicleType + " vehicles in a specific price range?";
    }
    
    private String handleAvailability(Map<String, String> slots) {
        List<VehicleDto> availableVehicles = vehicleService.getAvailableVehicles();
        
        if (availableVehicles.isEmpty()) {
            return "We don't have any vehicles available right now. Please check back later or contact our sales team.";
        }
        
        return "We currently have " + availableVehicles.size() + 
               " vehicles available. Would you like me to help you find something specific?";
    }
    
    private String handleGreeting() {
        return "Hello! Welcome to LeafWheels. I'm here to help you find the perfect electric vehicle. " +
               "I can help you search for vehicles, check pricing, add items to your cart, and answer questions about our inventory. " +
               "What can I help you with today?";
    }
    
    private String handleHelp() {
        return "I can help you with:\n\n" +
               "• Search for vehicles by make, model, year, price, etc.\n" +
               "• Get detailed information about specific vehicles\n" +
               "• Add vehicles to your cart\n" +
               "• View your cart contents\n" +
               "• Check vehicle availability and pricing\n\n" +
               "Just tell me what you're looking for! For example, you can say:\n" +
               "'Show me Tesla Model 3 vehicles under $40,000' or 'Add vehicle ID xyz to my cart'";
    }
    
    private String handleGoodbye() {
        return "Thank you for visiting LeafWheels! If you need any more help finding the perfect electric vehicle, " +
               "I'll be here. Have a great day!";
    }
    
    private String handleUnknownIntent(String intent) {
        return "I'm not sure I understand what you're asking about '" + intent + "'. " +
               "I can help you search for vehicles, get vehicle details, manage your cart, or answer questions about pricing and availability. " +
               "What would you like to do?";
    }

    private Make parseMake(String makeStr) {
        if (makeStr == null) return null;
        try {
            return Make.valueOf(makeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    private BodyType parseBodyType(String bodyTypeStr) {
        if (bodyTypeStr == null) return null;
        try {
            return BodyType.valueOf(bodyTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
    
    private BigDecimal parsePrice(String priceStr) {
        if (priceStr == null) return null;
        try {
            String cleanPrice = priceStr.replaceAll("[^0-9.]", "");
            return new BigDecimal(cleanPrice);
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    private Integer parseYear(String yearStr) {
        if (yearStr == null) return null;
        try {
            return Integer.parseInt(yearStr);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
