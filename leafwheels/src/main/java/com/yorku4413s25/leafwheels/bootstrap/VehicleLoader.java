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
            List<Vehicle> vehicles = List.of(
                    // EXISTING VEHICLES (10) - Mix of new and used
                    Vehicle.builder().year(2022).make(Make.TESLA).model("Model Y").bodyType(BodyType.SUV)
                            .exteriorColor("White").doors(4).seats(5).mileage(8000).batteryRange(450)
                            .trim("Performance").price(new BigDecimal("74990.00"))
                            .vin("5YJYGDEF9MF123456").discountPercentage(new BigDecimal("0.05")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("AWD electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2021).make(Make.NISSAN).model("Leaf").bodyType(BodyType.HATCHBACK)
                            .exteriorColor("Blue").doors(4).seats(5).mileage(15000).batteryRange(240)
                            .trim("SV Plus").price(new BigDecimal("28900.00"))
                            .vin("1N4AZ1CP5MC303210").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("City EV hatchback").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.FORD).model("Mustang Mach-E").bodyType(BodyType.SUV)
                            .exteriorColor("Red").doors(4).seats(5).mileage(3000).batteryRange(500)
                            .trim("GT").price(new BigDecimal("67900.00"))
                            .vin("3FMTK4SX6MMA12345").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("5000.00"))
                            .condition(Condition.NEW).description("Electric muscle SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2020).make(Make.CHEVROLET).model("Bolt EV").bodyType(BodyType.HATCHBACK)
                            .exteriorColor("Orange").doors(4).seats(5).mileage(22000).batteryRange(259)
                            .trim("LT").price(new BigDecimal("20900.00"))
                            .vin("1G1FY6S04L4100001").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Affordable EV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.TESLA).model("Model 3").bodyType(BodyType.SEDAN)
                            .exteriorColor("Black").doors(4).seats(5).mileage(150).batteryRange(576)
                            .trim("Long Range").price(new BigDecimal("51990.00"))
                            .vin("5YJ3E1EA7RF000001").discountPercentage(new BigDecimal("0.035")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Top-selling electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2019).make(Make.HYUNDAI).model("Kona Electric").bodyType(BodyType.SUV)
                            .exteriorColor("Teal").doors(4).seats(5).mileage(28000).batteryRange(415)
                            .trim("Ultimate").price(new BigDecimal("23900.00"))
                            .vin("KM8K53AG6KU000123").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Compact electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2022).make(Make.VOLKSWAGEN).model("ID.4").bodyType(BodyType.SUV)
                            .exteriorColor("Silver").doors(4).seats(5).mileage(250).batteryRange(400)
                            .trim("Pro S").price(new BigDecimal("41900.00"))
                            .vin("WVGDMPE2XNP000456").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("1700.00"))
                            .condition(Condition.NEW).description("Modern family EV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.BMW).model("i4").bodyType(BodyType.SEDAN)
                            .exteriorColor("Blue").doors(4).seats(5).mileage(200).batteryRange(475)
                            .trim("eDrive40").price(new BigDecimal("55900.00"))
                            .vin("WBY73AW0XP7F00003").discountPercentage(new BigDecimal("0.025")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Luxury electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2021).make(Make.KIA).model("EV6").bodyType(BodyType.CROSSOVER)
                            .exteriorColor("Gray").doors(4).seats(5).mileage(18000).batteryRange(490)
                            .trim("GT-Line").price(new BigDecimal("47900.00"))
                            .vin("KNDC3DLC4M5078901").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Stylish Korean EV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2022).make(Make.AUDI).model("Q4 e-tron").bodyType(BodyType.SUV)
                            .exteriorColor("White").doors(4).seats(5).mileage(180).batteryRange(388)
                            .trim("Premium Plus").price(new BigDecimal("58900.00"))
                            .vin("WA1L2AFY4N3004567").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("3500.00"))
                            .condition(Condition.NEW).description("Premium compact electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    // NEW VEHICLES (10) - All under 300km mileage, no accident history
                    Vehicle.builder().year(2024).make(Make.TESLA).model("Cybertruck").bodyType(BodyType.TRUCK)
                            .exteriorColor("Silver").doors(4).seats(6).mileage(50).batteryRange(547)
                            .trim("Foundation Series").price(new BigDecimal("99990.00"))
                            .vin("7G2YX2EA1PF100001").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Revolutionary electric truck").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.FORD).model("F-150 Lightning").bodyType(BodyType.TRUCK)
                            .exteriorColor("Blue").doors(4).seats(5).mileage(120).batteryRange(515)
                            .trim("Lariat").price(new BigDecimal("73900.00"))
                            .vin("1FTFW1E81PFC00789").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("3700.00"))
                            .condition(Condition.NEW).description("Electric workhorse truck").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.BMW).model("iX").bodyType(BodyType.SUV)
                            .exteriorColor("Black").doors(4).seats(7).mileage(75).batteryRange(610)
                            .trim("xDrive50").price(new BigDecimal("87100.00"))
                            .vin("5UX4P3C05P9W00456").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Luxury flagship SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.VOLKSWAGEN).model("ID.Buzz").bodyType(BodyType.WAGON)
                            .exteriorColor("Yellow").doors(4).seats(7).mileage(290).batteryRange(425)
                            .trim("Pro S").price(new BigDecimal("61545.00"))
                            .vin("WV2ZZZE1XPH001234").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Retro electric microbus").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.HYUNDAI).model("IONIQ 6").bodyType(BodyType.SEDAN)
                            .exteriorColor("White").doors(4).seats(5).mileage(95).batteryRange(610)
                            .trim("Limited").price(new BigDecimal("59545.00"))
                            .vin("KMHL14TA5PA012345").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Aerodynamic electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.NISSAN).model("Ariya").bodyType(BodyType.SUV)
                            .exteriorColor("Copper").doors(4).seats(5).mileage(210).batteryRange(516)
                            .trim("Platinum+").price(new BigDecimal("60126.00"))
                            .vin("JN1EZ2C24P0012345").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("2700.00"))
                            .condition(Condition.NEW).description("Premium electric crossover").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.KIA).model("EV9").bodyType(BodyType.SUV)
                            .exteriorColor("Green").doors(4).seats(7).mileage(160).batteryRange(563)
                            .trim("GT-Line").price(new BigDecimal("73900.00"))
                            .vin("KNDPNCAC6P7123456").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Three-row electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.CHEVROLET).model("Blazer EV").bodyType(BodyType.SUV)
                            .exteriorColor("Red").doors(4).seats(5).mileage(45).batteryRange(557)
                            .trim("SS").price(new BigDecimal("65995.00"))
                            .vin("1GNPVBEK0P6000123").discountPercentage(new BigDecimal("0.025")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Performance electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.AUDI).model("Q8 e-tron").bodyType(BodyType.SUV)
                            .exteriorColor("Gray").doors(4).seats(5).mileage(85).batteryRange(582)
                            .trim("Prestige").price(new BigDecimal("81395.00"))
                            .vin("WA1L4AFY0P2000789").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.TESLA).model("Model S").bodyType(BodyType.SEDAN)
                            .exteriorColor("Pearl White").doors(4).seats(5).mileage(35).batteryRange(647)
                            .trim("Plaid").price(new BigDecimal("109990.00"))
                            .vin("5YJS3E1E4PF000999").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("8800.00"))
                            .condition(Condition.NEW).description("Flagship performance sedan").status(VehicleStatus.AVAILABLE).build()
            );
            
            // Apply discount calculations for all vehicles
            vehicles.forEach(Vehicle::updateDiscountCalculations);
            
            vehicleRepository.saveAll(vehicles);
            System.out.println("Seeded 20 vehicle records.");
        } else {
            System.out.println("Vehicles already present — skipping seeding.");
        }
    }
}
