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
    
    @Autowired
    private AccessoryService accessoryService;
    
    @org.springframework.beans.factory.annotation.Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;
    
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
                
            case "searchaccessories":
                return handleAccessorySearch(slots);
                
            case "vieworders":
                return handleViewOrders(username);
                
            case "loancalculation":
                return handleLoanCalculation(slots);
                
            case "getprice":
            case "pricing":
                return handlePricing(slots);
                
            case "availability":
                return handleAvailability(slots);
                
            case "fallbackintent":
            case "greeting":
                return handleGreeting();
                
            case "help":
                return handleHelp();
                
            case "goodbye":
                return handleGoodbye();
                
            case "lex_unavailable":
                return handleLexUnavailable();
                
            case "general_conversation":
                return handleGeneralConversation();
                
            default:
                return handleUnknownIntent(intent);
        }
    }
    
    private String handleVehicleSearch(Map<String, String> slots) {
        try {
            Make make = parseMake(slots.get("make"));
            String model = slots.get("model");
            BodyType bodyType = parseBodyType(slots.get("bodyType"));
            BigDecimal minPrice = parsePrice(slots.get("minPrice"));
            BigDecimal maxPrice = parsePrice(slots.get("maxPrice"));
            Integer year = parseYear(slots.get("year"));
            if (make == null && slots.containsKey("originalMessage")) {
                String originalMessage = slots.get("originalMessage").toLowerCase();
                for (Make possibleMake : Make.values()) {
                    if (originalMessage.contains(possibleMake.toString().toLowerCase())) {
                        make = possibleMake;
                        break;
                    }
                }
            }
            String storeUrl = buildStoreUrl(make, model, bodyType, year, minPrice, maxPrice);
            Pageable pageable = PageRequest.of(0, 3); // Just get a few for preview
            Page<VehicleDto> vehicles = vehicleService.filterVehicles(
                year, make, model, bodyType, null, null, null, null, null, null, null,
                minPrice, maxPrice, null, null, List.of(VehicleStatus.AVAILABLE), null, pageable
            );
            
            StringBuilder response = new StringBuilder();
            
            if (vehicles.isEmpty()) {
                response.append("I couldn't find any vehicles matching your criteria. ");
                response.append("You can [browse all available vehicles](").append(baseUrl).append("/store?category=Vehicles) or try different search terms.");
                return response.toString();
            }
            
            String searchTerms = buildSearchDescription(make, model, year);
            response.append("Great! I found ").append(vehicles.getTotalElements())
                    .append(" ").append(searchTerms).append(" vehicle").append(vehicles.getTotalElements() == 1 ? "" : "s")
                    .append(" available.\n\n");
            response.append("Here are some highlights:\n");
            for (VehicleDto vehicle : vehicles.getContent()) {
                response.append("• ").append(vehicle.getYear()).append(" ")
                        .append(vehicle.getMake()).append(" ").append(vehicle.getModel())
                        .append(" - $").append(vehicle.getPrice());
                if (vehicle.getOnDeal() != null && vehicle.getOnDeal()) {
                    response.append(" (ON SALE!)");
                }
                response.append("\n");
            }
            
            response.append("\n\n[View all ").append(searchTerms).append(" vehicles](").append(baseUrl).append(storeUrl).append(")");
            
            return response.toString();
            
        } catch (Exception e) {
            return "I encountered an error while searching for vehicles. You can [browse our full inventory](" + baseUrl + "/store?category=Vehicles) instead.";
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
            return "Please log in to view your cart. [Go to login](/login)";
        }
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(username);
            if (userOpt.isEmpty()) {
                return "I couldn't find your user account. Please make sure you're logged in. [Go to login](/login)";
            }
            
            CartDto cart = cartService.getCartByUserId(userOpt.get().getId());
            
            if (cart.getItems().isEmpty()) {
                return "Your cart is empty. You can browse vehicles or accessories in our store to get started!";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("You have ").append(cart.getItems().size()).append(" item(s) in your cart:\n\n");
            
            BigDecimal total = BigDecimal.ZERO;
            int itemCount = 0;
            for (var item : cart.getItems()) {
                if (itemCount >= 3) break; // Show max 3 items in summary
                
                if (item.getVehicle() != null) {
                    VehicleDto vehicle = item.getVehicle();
                    response.append("• ").append(vehicle.getYear()).append(" ")
                            .append(vehicle.getMake()).append(" ").append(vehicle.getModel())
                            .append(" - $").append(vehicle.getPrice()).append("\n");
                    total = total.add(vehicle.getPrice());
                } else if (item.getAccessory() != null) {
                    var accessory = item.getAccessory();
                    response.append("• ").append(accessory.getName())
                            .append(" (x").append(item.getQuantity()).append(") - $")
                            .append(accessory.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))).append("\n");
                    total = total.add(accessory.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
                itemCount++;
            }
            
            if (cart.getItems().size() > 3) {
                response.append("... and ").append(cart.getItems().size() - 3).append(" more item(s)\n");
            }
            
            response.append("\nEstimated Total: $").append(total);
            response.append("\n\nYou can [view your full cart](" + baseUrl + "/cart) or proceed to checkout from the cart page.");
            
            return response.toString();
            
        } catch (Exception e) {
            return "I couldn't retrieve your cart. You can [go to the cart page](" + baseUrl + "/cart) to view it directly.";
        }
    }
    
    private String handleGetVehicleDetails(Map<String, String> slots) {
        try {
            String vehicleIdStr = slots.get("vehicleId");
            if (vehicleIdStr == null || vehicleIdStr.isEmpty()) {
                return "I need a vehicle ID to get the details. You can find vehicle IDs on our [vehicle listings](" + baseUrl + "/store?category=Vehicles).";
            }
            
            UUID vehicleId = UUID.fromString(vehicleIdStr);
            VehicleDto vehicle = vehicleService.getById(vehicleId);
            
            if (vehicle == null) {
                return "I couldn't find a vehicle with that ID. Please check the ID or [browse our vehicles](" + baseUrl + "/store?category=Vehicles).";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("Here are the key details for the ").append(vehicle.getYear())
                    .append(" ").append(vehicle.getMake()).append(" ").append(vehicle.getModel()).append(":\n\n");
            
            response.append("• Price: $").append(vehicle.getPrice());
            if (vehicle.getOnDeal() != null && vehicle.getOnDeal()) {
                response.append(" (ON SALE!)");
            }
            response.append("\n");
            response.append("• Mileage: ").append(vehicle.getMileage()).append(" miles\n");
            response.append("• Body Type: ").append(vehicle.getBodyType()).append("\n");
            response.append("• Color: ").append(vehicle.getExteriorColor()).append("\n");
            response.append("• Condition: ").append(vehicle.getCondition()).append("\n");
            
            if (vehicle.getBatteryRange() != 0) {
                response.append("• Battery Range: ").append(vehicle.getBatteryRange()).append(" miles\n");
            }
            
            response.append("\n[View Full Details & Photos](/vehicle/").append(vehicleId).append(")");
            response.append(" | [Add to Cart](/vehicle/").append(vehicleId).append(")");
            
            return response.toString();
            
        } catch (IllegalArgumentException e) {
            return "Invalid vehicle ID format. Please [browse our vehicles](/store?category=Vehicles) to find the correct ID.";
        } catch (Exception e) {
            return "I couldn't retrieve the vehicle details. Please [browse our vehicles](/store?category=Vehicles) instead.";
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
        return "Hello! Welcome to LeafWheels. I'm your AI assistant here to help you find the perfect electric vehicle!\n\n" +
               "I can help you:\n" +
               "• Search for vehicles and accessories\n" +
               "• View your cart and order history\n" +
               "• Get vehicle details and pricing\n" +
               "• Calculate loan payments\n\n" +
               "Try saying something like 'Show me Tesla vehicles' or 'What's in my cart?' to get started!";
    }
    
    private String handleHelp() {
        return "Here's what I can help you with:\n\n" +
               "Vehicle Search:\n" +
               "• 'Show me Tesla Model 3 vehicles'\n" +
               "• 'Find 2023 electric vehicles under $50,000'\n" +
               "• 'Search for BMW vehicles'\n\n" +
               "Cart & Orders:\n" +
               "• 'What's in my cart?'\n" +
               "• 'Show my order history'\n" +
               "• 'Add vehicle [ID] to cart'\n\n" +
               "Information:\n" +
               "• 'Tell me about vehicle [ID]'\n" +
               "• 'Show me accessories'\n" +
               "• 'Calculate loan payments'";
    }
    
    private String handleGoodbye() {
        return "Thank you for visiting LeafWheels! If you need any more help finding the perfect electric vehicle, " +
               "I'll be here. Have a great day!";
    }
    
    private String handleLexUnavailable() {
        return "I'm experiencing some technical difficulties with my AI processing, but I can still help you!\n\n" +
               "You can:\n" +
               "• Browse all vehicles in our store\n" +
               "• Browse accessories\n" +
               "• View your cart\n" +
               "• Check your order history\n\n" +
               "Or try asking me again in a moment - my systems should be back online shortly.";
    }
    
    private String handleGeneralConversation() {
        return "I can help you with finding electric vehicles, checking your cart, viewing orders, and calculating loans.\n\n" +
               "Try asking me something like:\n" +
               "• 'Show me Tesla vehicles'\n" +
               "• 'What's in my cart?'\n" +
               "• 'Do you have BMW models?'\n" +
               "• 'Calculate loan payment'\n\n" +
               "What would you like to know about?";
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
    private String handleAccessorySearch(Map<String, String> slots) {
        try {
            List<com.yorku4413s25.leafwheels.web.models.AccessoryDto> accessories = accessoryService.getAllAccessories();
            
            if (accessories.isEmpty()) {
                return "We don't have any accessories available right now. Please check back later.";
            }
            
            StringBuilder response = new StringBuilder();
            response.append("We have ").append(accessories.size()).append(" accessories available!\n\n");
            int limit = Math.min(3, accessories.size());
            response.append("Here are some popular items:\n");
            for (int i = 0; i < limit; i++) {
                var accessory = accessories.get(i);
                response.append("• ").append(accessory.getName())
                        .append(" - $").append(accessory.getPrice());
                if (accessory.getOnDeal() != null && accessory.getOnDeal()) {
                    response.append(" (ON SALE!)");
                }
                response.append("\n");
            }
            
            response.append("\n\n[Browse all accessories](" + baseUrl + "/store?category=Accessories)");
            
            return response.toString();
            
        } catch (Exception e) {
            return "I encountered an error while searching for accessories. You can [browse our accessories](" + baseUrl + "/store?category=Accessories) directly.";
        }
    }
    
    private String handleViewOrders(String username) {
        if (username == null) {
            return "Please log in to view your order history. [Go to login](" + baseUrl + "/login)";
        }
        
        return "You can view your complete order history here: [View Orders](" + baseUrl + "/order-history)";
    }
    
    private String handleLoanCalculation(Map<String, String> slots) {
        return "I can help you calculate loan payments for your vehicle purchase! " +
               "Our loan calculator can estimate monthly payments based on the vehicle price, down payment, interest rate, and loan term.\n\n" +
               "[Use Loan Calculator](" + baseUrl + "/store) (available on vehicle detail pages)";
    }
    private String buildStoreUrl(Make make, String model, BodyType bodyType, Integer year, BigDecimal minPrice, BigDecimal maxPrice) {
        StringBuilder url = new StringBuilder("/store?category=Vehicles");
        
        if (make != null) {
            url.append("&brand=").append(make.toString());
        }
        if (model != null && !model.trim().isEmpty()) {
            url.append("&search=").append(java.net.URLEncoder.encode(model, java.nio.charset.StandardCharsets.UTF_8));
        }
        if (bodyType != null) {
            url.append("&bodyType=").append(bodyType.toString());
        }
        if (year != null) {
            url.append("&year=").append(year);
        }
        if (minPrice != null) {
            url.append("&minPrice=").append(minPrice);
        }
        if (maxPrice != null) {
            url.append("&maxPrice=").append(maxPrice);
        }
        
        return url.toString();
    }
    
    private String buildSearchDescription(Make make, String model, Integer year) {
        StringBuilder description = new StringBuilder();
        
        if (year != null) {
            description.append(year).append(" ");
        }
        if (make != null) {
            description.append(make.toString().toLowerCase()).append(" ");
        }
        if (model != null && !model.trim().isEmpty()) {
            description.append(model.toLowerCase()).append(" ");
        }
        
        return description.toString().trim().isEmpty() ? "available" : description.toString().trim();
    }
}
