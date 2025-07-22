package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.constants.OrderStatus;
import com.yorku4413s25.leafwheels.domain.*;
import com.yorku4413s25.leafwheels.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
@org.springframework.core.annotation.Order(7)
public class OrderLoader implements CommandLineRunner {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AccessoryRepository accessoryRepository;

    @Override
    public void run(String... args) {
        try {
            if (orderRepository.count() == 0) {
                List<User> users = userRepository.findAll();
                List<Vehicle> vehicles = vehicleRepository.findAll();
                List<Accessory> accessories = accessoryRepository.findAll();
                if (users.size() < 2 || vehicles.size() < 2 || accessories.size() < 3) {
                    System.out.println("FAILED: Not enough seed data for users/vehicles/accessories. Orders not seeded.");
                    return;
                }

            // Order 1: Accessories only
            Order order1 = Order.builder()
                    .userId(users.get(0).getId())
                    .status(OrderStatus.PLACED)
                    .totalPrice(accessories.get(0).getPrice().multiply(BigDecimal.valueOf(2))
                            .add(accessories.get(1).getPrice()))
                    .items(new ArrayList<>())
                    .build();
            OrderItem oi1a = OrderItem.builder()
                    .order(order1)
                    .type(ItemType.ACCESSORY)
                    .accessory(accessories.get(0))
                    .unitPrice(accessories.get(0).getPrice())
                    .quantity(2)
                    .build();
            OrderItem oi1b = OrderItem.builder()
                    .order(order1)
                    .type(ItemType.ACCESSORY)
                    .accessory(accessories.get(1))
                    .unitPrice(accessories.get(1).getPrice())
                    .quantity(1)
                    .build();
            order1.getItems().addAll(List.of(oi1a, oi1b));

            // Order 2: Vehicles only
            Order order2 = Order.builder()
                    .userId(users.get(1).getId())
                    .status(OrderStatus.PLACED)
                    .totalPrice(vehicles.get(0).getPrice())
                    .items(new ArrayList<>())
                    .build();
            OrderItem oi2a = OrderItem.builder()
                    .order(order2)
                    .type(ItemType.VEHICLE)
                    .vehicle(vehicles.get(0))
                    .unitPrice(vehicles.get(0).getPrice())
                    .quantity(1)
                    .build();
            order2.getItems().add(oi2a);

            // Order 3: Mixed order
            Order order3 = Order.builder()
                    .userId(users.get(2).getId())
                    .status(OrderStatus.PLACED)
                    .totalPrice(vehicles.get(1).getPrice()
                            .add(accessories.get(2).getPrice()))
                    .items(new ArrayList<>())
                    .build();
            OrderItem oi3a = OrderItem.builder()
                    .order(order3)
                    .type(ItemType.VEHICLE)
                    .vehicle(vehicles.get(1))
                    .unitPrice(vehicles.get(1).getPrice())
                    .quantity(1)
                    .build();
            OrderItem oi3b = OrderItem.builder()
                    .order(order3)
                    .type(ItemType.ACCESSORY)
                    .accessory(accessories.get(2))
                    .unitPrice(accessories.get(2).getPrice())
                    .quantity(1)
                    .build();
            order3.getItems().addAll(List.of(oi3a, oi3b));

            // Order 4: Accessories only, more items
            Order order4 = Order.builder()
                    .userId(users.get(3).getId())
                    .status(OrderStatus.PLACED)
                    .totalPrice(accessories.get(3).getPrice().multiply(BigDecimal.valueOf(3)))
                    .items(new ArrayList<>())
                    .build();
            OrderItem oi4a = OrderItem.builder()
                    .order(order4)
                    .type(ItemType.ACCESSORY)
                    .accessory(accessories.get(3))
                    .unitPrice(accessories.get(3).getPrice())
                    .quantity(3)
                    .build();
            order4.getItems().add(oi4a);

            // Order 5: Vehicle only, another user/vehicle
            Order order5 = Order.builder()
                    .userId(users.get(0).getId())
                    .status(OrderStatus.PLACED)
                    .totalPrice(vehicles.get(2).getPrice())
                    .items(new ArrayList<>())
                    .build();
            OrderItem oi5a = OrderItem.builder()
                    .order(order5)
                    .type(ItemType.VEHICLE)
                    .vehicle(vehicles.get(2))
                    .unitPrice(vehicles.get(2).getPrice())
                    .quantity(1)
                    .build();
            order5.getItems().add(oi5a);

                orderRepository.saveAll(List.of(order1, order2, order3, order4, order5));

                System.out.println("SUCCESS: Seeded 5 orders with items (accessory-only, vehicle-only, mixed).");
            } else {
                System.out.println("Orders already present — skipping seeding.");
            }
        } catch (Exception e) {
            System.out.println("FAILED: Error seeding order data: " + e.getMessage());
        }
    }
}
