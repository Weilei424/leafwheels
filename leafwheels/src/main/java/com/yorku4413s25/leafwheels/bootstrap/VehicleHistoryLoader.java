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

        if (vehicles.size() >= 20) {
            // Vehicle 2: Nissan Leaf (USED - 15000km) - 1 accident
            Vehicle nissanLeaf = vehicles.get(1);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(nissanLeaf)
                            .accidentDate(Instant.now().minus(240, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("4750.00"))
                            .accidentDescription("Fender bender at intersection. Front bumper replacement and headlight alignment. No structural damage.")
                            .build()
            );

            // Vehicle 4: Chevrolet Bolt EV (USED - 22000km) - 1 accident
            Vehicle chevyBolt = vehicles.get(3);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(chevyBolt)
                            .accidentDate(Instant.now().minus(180, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3200.00"))
                            .accidentDescription("Minor door ding and scratch on passenger side. Paint touch-up and door panel repair.")
                            .build()
            );

            // Vehicle 6: Hyundai Kona Electric (USED - 28000km) - 2 accidents
            Vehicle hyundaiKona = vehicles.get(5);
            vehicleHistoryRepository.saveAll(List.of(
                    VehicleHistory.builder()
                            .vehicle(hyundaiKona)
                            .accidentDate(Instant.now().minus(365, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("6200.00"))
                            .accidentDescription("Hail damage to hood, roof, and trunk. Multiple dents repaired using paintless dent removal technique.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(hyundaiKona)
                            .accidentDate(Instant.now().minus(120, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2800.00"))
                            .accidentDescription("Parking lot incident. Rear bumper and taillight replacement.")
                            .build()
            ));

            // Vehicle 9: KIA EV6 (USED - 18000km) - 1 accident
            Vehicle kiaEV6 = vehicles.get(8);
            vehicleHistoryRepository.save(
                    VehicleHistory.builder()
                            .vehicle(kiaEV6)
                            .accidentDate(Instant.now().minus(150, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2100.00"))
                            .accidentDescription("Rock chip on windshield expanded to crack. Full windshield replacement including recalibration of driver assist systems.")
                            .build()
            );

        }
    }
}
