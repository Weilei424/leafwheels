package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.*;
import com.yorku4413s25.leafwheels.repositories.*;
import com.yorku4413s25.leafwheels.services.CartService;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(6)
public class CartLoader implements CommandLineRunner {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AccessoryRepository accessoryRepository;

    @Override
    public void run(String... args) {
        try {
            List<User> users = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.USER)
                    .limit(1)
                    .toList();
            
            if (users.isEmpty() || cartService.getCartByUserId(users.get(0).getId()).getItems().isEmpty()) {
                loadCartData();
                System.out.println("SUCCESS: Seeded cart records for 4 USER role users.");
            } else {
                System.out.println("Carts already present — skipping seeding.");
            }
        } catch (Exception e) {
            System.out.println("FAILED: Error seeding cart data: " + e.getMessage());
        }
    }

    private void loadCartData() {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.USER)
                .limit(4)
                .toList();
        
        List<Vehicle> vehicles = vehicleRepository.findAll().stream()
                .filter(v -> v.getStatus() == null || v.getStatus() == VehicleStatus.AVAILABLE)
                .toList();
        List<Accessory> accessories = accessoryRepository.findAll();

        if (users.size() >= 4 && vehicles.size() >= 10 && accessories.size() >= 6) {
            // Alice's Cart - 3 vehicles + 2 accessories
            User alice = users.get(0);
            cartService.addItemToCart(alice.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(0).getId())
                    .quantity(1).build());
            cartService.addItemToCart(alice.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(1).getId())
                    .quantity(1).build());
            cartService.addItemToCart(alice.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(2).getId())
                    .quantity(1).build());
            cartService.addItemToCart(alice.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(0).getId())
                    .quantity(2).build());
            cartService.addItemToCart(alice.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(1).getId())
                    .quantity(1).build());

            // Bob's Cart - 2 vehicles + 3 accessories  
            User bob = users.get(1);
            cartService.addItemToCart(bob.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(3).getId())
                    .quantity(1).build());
            cartService.addItemToCart(bob.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(4).getId())
                    .quantity(1).build());
            cartService.addItemToCart(bob.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(2).getId())
                    .quantity(1).build());
            cartService.addItemToCart(bob.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(3).getId())
                    .quantity(3).build());
            cartService.addItemToCart(bob.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(4).getId())
                    .quantity(2).build());

            // Carol's Cart - 3 vehicles + 1 accessory
            User carol = users.get(2);
            cartService.addItemToCart(carol.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(5).getId())
                    .quantity(1).build());
            cartService.addItemToCart(carol.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(6).getId())
                    .quantity(1).build());
            cartService.addItemToCart(carol.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(7).getId())
                    .quantity(1).build());
            cartService.addItemToCart(carol.getId(), CreateCartItemDto.builder()
                    .type(ItemType.ACCESSORY).accessoryId(accessories.get(5).getId())
                    .quantity(1).build());

            // David's Cart - 2 vehicles + 0 accessories
            User david = users.get(3);
            cartService.addItemToCart(david.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(8).getId())
                    .quantity(1).build());
            cartService.addItemToCart(david.getId(), CreateCartItemDto.builder()
                    .type(ItemType.VEHICLE).vehicleId(vehicles.get(9).getId())
                    .quantity(1).build());
        }
    }
}
