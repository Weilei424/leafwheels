package com.yorku4413s25.leafwheels.bootstrap;

import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.domain.VehicleHistory;
import com.yorku4413s25.leafwheels.repositories.VehicleHistoryRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(4)
public class VehicleHistoryLoader implements CommandLineRunner {

    private final VehicleHistoryRepository vehicleHistoryRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) {
        if (vehicleHistoryRepository.count() == 0) {
            loadVehicleHistoryData();
            System.out.println("Seeded vehicle history records.");
        } else {
            System.out.println("Vehicle history already present — skipping seeding.");
        }
    }

    private void loadVehicleHistoryData() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        if (vehicles.size() >= 10) {
            // Vehicle 1: Tesla Model Y - 2 accidents
            Vehicle teslaModelY = vehicles.get(0);
            vehicleHistoryRepository.saveAll(List.of(
                    VehicleHistory.builder()
                            .vehicle(teslaModelY)
                            .accidentDate(Instant.now().minus(180, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("8500.00"))
                            .accidentDescription("Rear-end collision in parking lot. Damage to rear bumper, tailgate, and backup sensors. All repairs completed at Tesla service center.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(teslaModelY)
                            .accidentDate(Instant.now().minus(90, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3200.00"))
                            .accidentDescription("Minor door ding and scratch on passenger side. Paint touch-up and door panel repair.")
                            .build()
            ));

            // Vehicle 2: Nissan Leaf - 1 accident
            Vehicle nissanLeaf = vehicles.get(1);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(nissanLeaf)
                            .accidentDate(Instant.now().minus(240, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("4750.00"))
                            .accidentDescription("Fender bender at intersection. Front bumper replacement and headlight alignment. No structural damage.")
                            .build()
            );

            // Vehicle 3: Ford Mustang Mach-E - 1 accident
            Vehicle fordMachE = vehicles.get(2);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(fordMachE)
                            .accidentDate(Instant.now().minus(60, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("12750.00"))
                            .accidentDescription("Side impact collision. Driver side door, mirror, and window replaced. Extensive bodywork and paint correction.")
                            .build()
            );

            // Vehicle 6: Hyundai Kona Electric - 1 accident
            Vehicle hyundaiKona = vehicles.get(5);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(hyundaiKona)
                            .accidentDate(Instant.now().minus(365, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("6200.00"))
                            .accidentDescription("Hail damage to hood, roof, and trunk. Multiple dents repaired using paintless dent removal technique.")
                            .build()
            );

            // Vehicle 9: KIA EV6 - 2 accidents
            Vehicle kiaEV6 = vehicles.get(8);
            vehicleHistoryRepository.saveAll(List.of(
                    VehicleHistory.builder()
                            .vehicle(kiaEV6)
                            .accidentDate(Instant.now().minus(300, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("5500.00"))
                            .accidentDescription("Shopping cart collision in parking lot. Small dent and scratch on rear quarter panel repaired.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(kiaEV6)
                            .accidentDate(Instant.now().minus(150, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2100.00"))
                            .accidentDescription("Rock chip on windshield expanded to crack. Full windshield replacement including recalibration of driver assist systems.")
                            .build()
            ));

            // Vehicles 4, 5, 7, 8, 10 will have no accident history
            // This ensures we have a mix for testing the hasAccidentHistory filter
        }
    }
}
