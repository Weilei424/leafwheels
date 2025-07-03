package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(3)
public class VehicleLoader implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) {
        if (vehicleRepository.count() == 0) {
            vehicleRepository.saveAll(List.of(
                    Vehicle.builder().year(2022).make(Make.TESLA).model("Model Y").bodyType(BodyType.SUV)
                            .exteriorColor("White").doors(4).seats(5).mileage(8000).batteryRange(450)
                            .trim("Performance").price(new BigDecimal("74990.00")).onDeal(true)
                            .vin("5YJYGDEF9MF123456").discountPercent(new BigDecimal("5.00"))
                            .condition(Condition.NEW).description("AWD electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2021).make(Make.NISSAN).model("Leaf").bodyType(BodyType.HATCHBACK)
                            .exteriorColor("Blue").doors(4).seats(5).mileage(15000).batteryRange(240)
                            .trim("SV Plus").price(new BigDecimal("28900.00")).onDeal(false)
                            .vin("1N4AZ1CP5MC303210").discountPercent(BigDecimal.ZERO)
                            .condition(Condition.USED).description("City EV hatchback").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.FORD).model("Mustang Mach-E").bodyType(BodyType.SUV)
                            .exteriorColor("Red").doors(4).seats(5).mileage(3000).batteryRange(500)
                            .trim("GT").price(new BigDecimal("67900.00")).onDeal(true)
                            .vin("3FMTK4SX6MMA12345").discountPercent(new BigDecimal("7.5"))
                            .condition(Condition.NEW).description("Electric muscle SUV").status(VehicleStatus.DEMO).build(),

                    Vehicle.builder().year(2020).make(Make.CHEVROLET).model("Bolt EV").bodyType(BodyType.HATCHBACK)
                            .exteriorColor("Orange").doors(4).seats(5).mileage(22000).batteryRange(259)
                            .trim("LT").price(new BigDecimal("20900.00")).onDeal(false)
                            .vin("1G1FY6S04L4100001").discountPercent(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Affordable EV").status(VehicleStatus.SOLD).build(),

                    Vehicle.builder().year(2024).make(Make.TESLA).model("Model 3").bodyType(BodyType.SEDAN)
                            .exteriorColor("Black").doors(4).seats(5).mileage(0).batteryRange(576)
                            .trim("Long Range").price(new BigDecimal("51990.00")).onDeal(true)
                            .vin("5YJ3E1EA7RF000001").discountPercent(new BigDecimal("3.50"))
                            .condition(Condition.NEW).description("Top-selling electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2019).make(Make.HYUNDAI).model("Kona Electric").bodyType(BodyType.SUV)
                            .exteriorColor("Teal").doors(4).seats(5).mileage(28000).batteryRange(415)
                            .trim("Ultimate").price(new BigDecimal("23900.00")).onDeal(false)
                            .vin("KM8K53AG6KU000123").discountPercent(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Compact electric SUV").status(VehicleStatus.SOLD).build(),

                    Vehicle.builder().year(2022).make(Make.VOLKSWAGEN).model("ID.4").bodyType(BodyType.SUV)
                            .exteriorColor("Silver").doors(4).seats(5).mileage(12000).batteryRange(400)
                            .trim("Pro S").price(new BigDecimal("41900.00")).onDeal(true)
                            .vin("WVGDMPE2XNP000456").discountPercent(new BigDecimal("4.00"))
                            .condition(Condition.NEW).description("Modern family EV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.BMW).model("i4").bodyType(BodyType.SEDAN)
                            .exteriorColor("Blue").doors(4).seats(5).mileage(5000).batteryRange(475)
                            .trim("eDrive40").price(new BigDecimal("55900.00")).onDeal(true)
                            .vin("WBY73AW0XP7F00003").discountPercent(new BigDecimal("2.5"))
                            .condition(Condition.NEW).description("Luxury electric sedan").status(VehicleStatus.INCOMING).build(),

                    Vehicle.builder().year(2021).make(Make.KIA).model("EV6").bodyType(BodyType.CROSSOVER)
                            .exteriorColor("Gray").doors(4).seats(5).mileage(18000).batteryRange(490)
                            .trim("GT-Line").price(new BigDecimal("47900.00")).onDeal(false)
                            .vin("KNDC3DLC4M5078901").discountPercent(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Stylish Korean EV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2022).make(Make.AUDI).model("Q4 e-tron").bodyType(BodyType.SUV)
                            .exteriorColor("White").doors(4).seats(5).mileage(10000).batteryRange(388)
                            .trim("Premium Plus").price(new BigDecimal("58900.00")).onDeal(true)
                            .vin("WA1L2AFY4N3004567").discountPercent(new BigDecimal("6.00"))
                            .condition(Condition.NEW).description("Premium compact electric SUV").status(VehicleStatus.AVAILABLE).build()
            ));
            System.out.println("Seeded 10 vehicle records.");
        } else {
            System.out.println("Vehicles already present — skipping seeding.");
        }
    }
}
