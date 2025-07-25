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
        try {
            if (vehicleHistoryRepository.count() == 0) {
                int recordsSeeded = loadVehicleHistoryData();
                System.out.println("SUCCESS: Seeded " + recordsSeeded + " vehicle history records.");
            } else {
                System.out.println("Vehicle history already present — skipping seeding.");
            }
        } catch (Exception e) {
            System.out.println("FAILED: Error seeding vehicle history data: " + e.getMessage());
        }
    }

    private int loadVehicleHistoryData() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        int recordsSeeded = 0;

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
            recordsSeeded++;

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
            recordsSeeded++;

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
            recordsSeeded += 2;

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
            recordsSeeded++;
        }
        
        // Add history for the 16 new used vehicles (starting from index 70 onwards)
        if (vehicles.size() >= 86) {
            // Get the last 16 used vehicles
            List<VehicleHistory> newHistories = List.of(
                    // Tesla Model 3 2022 (VIN ending 001051)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(70))
                            .accidentDate(Instant.now().minus(320, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3500.00"))
                            .accidentDescription("Minor collision at parking garage. Front bumper and grille replacement.")
                            .build(),
                    
                    // BMW iX3 2021 (VIN ending 001052)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(71))
                            .accidentDate(Instant.now().minus(280, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2800.00"))
                            .accidentDescription("Door handle replacement due to mechanical failure. Paint matching required.")
                            .build(),
                    
                    // Audi e-tron 2022 (VIN ending 001053) - 2 accidents
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(72))
                            .accidentDate(Instant.now().minus(450, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("5200.00"))
                            .accidentDescription("Side mirror collision with garage wall. Mirror assembly and door panel repair.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(72))
                            .accidentDate(Instant.now().minus(200, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("1800.00"))
                            .accidentDescription("Tire sidewall damage from road debris. Full tire replacement.")
                            .build(),
                    
                    // Ford Mustang Mach-E 2021 (VIN ending 001054)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(73))
                            .accidentDate(Instant.now().minus(380, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("4100.00"))
                            .accidentDescription("Rear-end collision at stop light. Trunk and rear bumper replacement.")
                            .build(),
                    
                    // Hyundai IONIQ 5 2022 (VIN ending 001055)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(74))
                            .accidentDate(Instant.now().minus(250, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2200.00"))
                            .accidentDescription("Shopping cart damage to side panel. Paint and bodywork repair.")
                            .build(),
                    
                    // Volkswagen ID.4 2021 (VIN ending 001056) - 2 accidents
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(75))
                            .accidentDate(Instant.now().minus(500, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3800.00"))
                            .accidentDescription("Hail damage to hood and roof. Multiple dent repairs and paint touch-up.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(75))
                            .accidentDate(Instant.now().minus(180, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("1500.00"))
                            .accidentDescription("Windshield crack from temperature change. Full windshield replacement.")
                            .build(),
                    
                    // Cadillac LYRIQ 2022 (VIN ending 001057)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(76))
                            .accidentDate(Instant.now().minus(220, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2900.00"))
                            .accidentDescription("Curb rash on front wheel and suspension alignment. Wheel replacement and alignment.")
                            .build(),
                    
                    // Polestar 2 2021 (VIN ending 001058)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(77))
                            .accidentDate(Instant.now().minus(340, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2400.00"))
                            .accidentDescription("Key scratch along passenger side. Paint repair and protective coating application.")
                            .build(),
                    
                    // Genesis GV60 2022 (VIN ending 001059)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(78))
                            .accidentDate(Instant.now().minus(290, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3200.00"))
                            .accidentDescription("Parking sensor malfunction after minor bump. Sensor replacement and calibration.")
                            .build(),
                    
                    // Jaguar I-PACE 2021 (VIN ending 001060) - 2 accidents
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(79))
                            .accidentDate(Instant.now().minus(420, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("4800.00"))
                            .accidentDescription("Door ding in parking lot expanded to paint damage. Door panel replacement.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(79))
                            .accidentDate(Instant.now().minus(160, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("1900.00"))
                            .accidentDescription("Headlight condensation issue. Headlight assembly replacement.")
                            .build(),
                    
                    // Volvo XC40 Recharge 2022 (VIN ending 001061)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(80))
                            .accidentDate(Instant.now().minus(270, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2600.00"))
                            .accidentDescription("Bird strike on windshield. Windshield and wiper replacement.")
                            .build(),
                    
                    // Mercedes-Benz EQC 2021 (VIN ending 001062)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(81))
                            .accidentDate(Instant.now().minus(360, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3700.00"))
                            .accidentDescription("Rear view mirror housing damage from automated car wash. Mirror and housing replacement.")
                            .build(),
                    
                    // KIA EV6 2022 (VIN ending 001063)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(82))
                            .accidentDate(Instant.now().minus(210, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2100.00"))
                            .accidentDescription("Wheel rim damage from pothole. Rim replacement and tire balancing.")
                            .build(),
                    
                    // Nissan Ariya 2021 (VIN ending 001064) - 2 accidents
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(83))
                            .accidentDate(Instant.now().minus(400, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("3400.00"))
                            .accidentDescription("Tree branch fell on roof during storm. Roof panel and sunroof repair.")
                            .build(),
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(83))
                            .accidentDate(Instant.now().minus(140, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("1600.00"))
                            .accidentDescription("Tailgate handle malfunction. Electronic latch replacement.")
                            .build(),
                    
                    // Lexus UX 300e 2022 (VIN ending 001065)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(84))
                            .accidentDate(Instant.now().minus(190, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("2800.00"))
                            .accidentDescription("Side panel dent from grocery cart. Panel repair and paint matching.")
                            .build(),
                    
                    // Porsche Taycan 4S 2021 (VIN ending 001066)
                    VehicleHistory.builder()
                            .vehicle(vehicles.get(85))
                            .accidentDate(Instant.now().minus(310, ChronoUnit.DAYS))
                            .repairCost(new BigDecimal("5500.00"))
                            .accidentDescription("Front splitter damage from speed bump. Carbon fiber splitter replacement.")
                            .build()
            );
            
            vehicleHistoryRepository.saveAll(newHistories);
            recordsSeeded += newHistories.size();
        }
        
        return recordsSeeded;
    }
}
