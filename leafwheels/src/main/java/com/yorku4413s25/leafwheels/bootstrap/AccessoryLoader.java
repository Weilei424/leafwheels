package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.domain.Accessory;
import com.yorku4413s25.leafwheels.repositories.AccessoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(1)
public class AccessoryLoader implements CommandLineRunner {
    private final AccessoryRepository accessoryRepository;

    @Override
    public void run(String... args) {
        if (accessoryRepository.count() == 0) {
            accessoryRepository.saveAll(List.of(
                    Accessory.builder().name("Charging Cable").description("Type 2 charging cable").price(new BigDecimal("199.99")).quantity(30).build(),
                    Accessory.builder().name("Floor Mats").description("All-weather floor mats set").price(new BigDecimal("89.99")).quantity(100).build(),
                    Accessory.builder().name("Car Cover").description("Waterproof car cover").price(new BigDecimal("149.99")).quantity(40).build(),
                    Accessory.builder().name("Trunk Organizer").description("Collapsible trunk organizer").price(new BigDecimal("39.99")).quantity(70).build(),
                    Accessory.builder().name("Wireless Phone Charger").description("Qi wireless phone charger for car").price(new BigDecimal("49.99")).quantity(80).build(),
                    Accessory.builder().name("Dash Cam").description("HD dashboard camera").price(new BigDecimal("119.99")).quantity(50).build(),
                    Accessory.builder().name("Roof Rack").description("Universal roof rack for SUVs").price(new BigDecimal("229.99")).quantity(25).build(),
                    Accessory.builder().name("Seat Covers").description("Leather seat cover set").price(new BigDecimal("129.99")).quantity(60).build(),
                    Accessory.builder().name("Cargo Net").description("Elastic cargo storage net").price(new BigDecimal("19.99")).quantity(120).build(),
                    Accessory.builder().name("Tire Repair Kit").description("Portable tire repair kit").price(new BigDecimal("34.99")).quantity(90).build()
            ));
            System.out.println("Seeded 10 accessory records.");
        } else {
            System.out.println("Accessories already present — skipping seeding.");
        }
    }
}
