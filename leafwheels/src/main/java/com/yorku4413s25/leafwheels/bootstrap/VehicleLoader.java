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
                            .vin("5YJ3E1EA7RF000001").discountPercentage(new BigDecimal("0.04")).discountAmount(BigDecimal.ZERO)
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
                            .vin("WBY73AW0XP7F00003").discountPercentage(new BigDecimal("0.08")).discountAmount(BigDecimal.ZERO)
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
                            .vin("1GNPVBEK0P6000123").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
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
                            .condition(Condition.NEW).description("Flagship performance sedan").status(VehicleStatus.AVAILABLE).build(),

                    // Additional 50 vehicles
                    Vehicle.builder().year(2024).make(Make.TESLA).model("Model 3").bodyType(BodyType.SEDAN)
                            .exteriorColor("Red").doors(4).seats(5).mileage(120).batteryRange(358)
                            .trim("Performance").price(new BigDecimal("54990.00"))
                            .vin("5YJ3E1EA1RF001001").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Performance electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.BMW).model("iX").bodyType(BodyType.SUV)
                            .exteriorColor("Alpine White").doors(4).seats(5).mileage(8500).batteryRange(610)
                            .trim("xDrive50").price(new BigDecimal("83200.00"))
                            .vin("WBY73AW02P7F01002").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("4500.00"))
                            .condition(Condition.USED).description("Luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.AUDI).model("e-tron GT").bodyType(BodyType.COUPE)
                            .exteriorColor("Daytona Gray").doors(4).seats(4).mileage(45).batteryRange(522)
                            .trim("quattro").price(new BigDecimal("102400.00"))
                            .vin("WAUZZZGE1PA001003").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("High-performance luxury coupe").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.FORD).model("Mustang Mach-E").bodyType(BodyType.SUV)
                            .exteriorColor("Grabber Blue").doors(4).seats(5).mileage(180).batteryRange(483)
                            .trim("GT").price(new BigDecimal("59995.00"))
                            .vin("3FMTK3SU5PMA01004").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Electric performance SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.HYUNDAI).model("IONIQ 6").bodyType(BodyType.SEDAN)
                            .exteriorColor("Teal").doors(4).seats(5).mileage(12000).batteryRange(610)
                            .trim("SEL").price(new BigDecimal("41600.00"))
                            .vin("KMHL14JA5PA001005").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("2800.00"))
                            .condition(Condition.USED).description("Aerodynamic electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.KIA).model("EV9").bodyType(BodyType.SUV)
                            .exteriorColor("Snow White").doors(4).seats(7).mileage(75).batteryRange(563)
                            .trim("GT-Line").price(new BigDecimal("73900.00"))
                            .vin("KNDPN3AC7P7001006").discountPercentage(new BigDecimal("0.01")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Large electric family SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.MERCEDES_BENZ).model("EQS").bodyType(BodyType.SEDAN)
                            .exteriorColor("Obsidian Black").doors(4).seats(5).mileage(95).batteryRange(830)
                            .trim("580").price(new BigDecimal("147500.00"))
                            .vin("W1K6G4HB7PA001007").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("7500.00"))
                            .condition(Condition.NEW).description("Ultra-luxury electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.VOLKSWAGEN).model("ID.Buzz").bodyType(BodyType.WAGON)
                            .exteriorColor("Energetic Orange").doors(4).seats(7).mileage(15600).batteryRange(451)
                            .trim("Pro S").price(new BigDecimal("61545.00"))
                            .vin("WV2ZZZEJ1PH001008").discountPercentage(new BigDecimal("0.04")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Retro electric van").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.RIVIAN).model("R1T").bodyType(BodyType.TRUCK)
                            .exteriorColor("Forest Green").doors(4).seats(5).mileage(150).batteryRange(516)
                            .trim("Max Pack").price(new BigDecimal("87000.00"))
                            .vin("7FC3RABL5PE001009").discountPercentage(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Adventure electric truck").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.LUCID).model("Air").bodyType(BodyType.SEDAN)
                            .exteriorColor("Stellar White").doors(4).seats(5).mileage(65).batteryRange(906)
                            .trim("Dream Edition").price(new BigDecimal("179000.00"))
                            .vin("5NPE54AF5PE001010").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Ultra-range luxury sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.TESLA).model("Model Y").bodyType(BodyType.SUV)
                            .exteriorColor("Midnight Silver").doors(4).seats(7).mileage(22000).batteryRange(430)
                            .trim("Long Range").price(new BigDecimal("52630.00"))
                            .vin("5YJYGDEF8NF001011").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("3200.00"))
                            .condition(Condition.USED).description("Compact electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.CADILLAC).model("LYRIQ").bodyType(BodyType.SUV)
                            .exteriorColor("Crystal White").doors(4).seats(5).mileage(88).batteryRange(516)
                            .trim("RWD").price(new BigDecimal("57195.00"))
                            .vin("1GYKPFRS5PF001012").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.GENESIS).model("Electrified GV70").bodyType(BodyType.SUV)
                            .exteriorColor("Adriatic Blue").doors(4).seats(5).mileage(125).batteryRange(429)
                            .trim("Advanced").price(new BigDecimal("63450.00"))
                            .vin("KMUC65GAXA001013").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("2500.00"))
                            .condition(Condition.NEW).description("Premium electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.POLESTAR).model("3").bodyType(BodyType.SUV)
                            .exteriorColor("Thunder Grey").doors(4).seats(5).mileage(18500).batteryRange(671)
                            .trim("Long Range").price(new BigDecimal("73400.00"))
                            .vin("LPSEDD4A1PE001014").discountPercentage(new BigDecimal("0.05")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Scandinavian electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.BMW).model("i4").bodyType(BodyType.SEDAN)
                            .exteriorColor("Storm Bay").doors(4).seats(5).mileage(165).batteryRange(516)
                            .trim("M50").price(new BigDecimal("67300.00"))
                            .vin("WBA5J1C04PC001016").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Performance electric sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.AUDI).model("Q4 e-tron").bodyType(BodyType.SUV)
                            .exteriorColor("Glacier White").doors(4).seats(5).mileage(25000).batteryRange(436)
                            .trim("Prestige").price(new BigDecimal("56800.00"))
                            .vin("WA1AAAFY4N2001017").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("4200.00"))
                            .condition(Condition.USED).description("Compact luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.VOLVO).model("XC40 Recharge").bodyType(BodyType.SUV)
                            .exteriorColor("Sage Green").doors(4).seats(5).mileage(195).batteryRange(423)
                            .trim("Plus").price(new BigDecimal("53550.00"))
                            .vin("YV4AC2PL5P1001018").discountPercentage(new BigDecimal("0.04")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Compact Swedish electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.LEXUS).model("RZ").bodyType(BodyType.SUV)
                            .exteriorColor("Heat Blue").doors(4).seats(5).mileage(85).batteryRange(440)
                            .trim("Premium").price(new BigDecimal("59400.00"))
                            .vin("JTMZFREV1P5001019").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("1800.00"))
                            .condition(Condition.NEW).description("Luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.TESLA).model("Model X").bodyType(BodyType.SUV)
                            .exteriorColor("Pearl White").doors(4).seats(6).mileage(16800).batteryRange(640)
                            .trim("Plaid").price(new BigDecimal("109990.00"))
                            .vin("5YJXCDE22NF001020").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Flagship electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.CHEVROLET).model("Equinox EV").bodyType(BodyType.SUV)
                            .exteriorColor("Radiant Red").doors(4).seats(5).mileage(110).batteryRange(459)
                            .trim("2LT").price(new BigDecimal("41000.00"))
                            .vin("1GNPVHEK5PK001021").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Affordable electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.INFINITI).model("QX60 e-POWER").bodyType(BodyType.SUV)
                            .exteriorColor("Moonstone White").doors(4).seats(8).mileage(75).batteryRange(600)
                            .trim("Sensory").price(new BigDecimal("58200.00"))
                            .vin("5N1DL0MM1PC001022").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("2100.00"))
                            .condition(Condition.NEW).description("Hybrid electric family SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.FORD).model("F-150 Lightning").bodyType(BodyType.TRUCK)
                            .exteriorColor("Antimatter Blue").doors(4).seats(5).mileage(28000).batteryRange(452)
                            .trim("Lariat").price(new BigDecimal("68474.00"))
                            .vin("1FTFW1E82NF001023").discountPercentage(new BigDecimal("0.06")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Electric pickup truck").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.ACURA).model("ZDX").bodyType(BodyType.SUV)
                            .exteriorColor("Performance Red Pearl").doors(4).seats(5).mileage(55).batteryRange(500)
                            .trim("A-Spec").price(new BigDecimal("64300.00"))
                            .vin("7FRDM4H34PE001024").discountPercentage(new BigDecimal("0.01")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Performance luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.SUBARU).model("Solterra").bodyType(BodyType.SUV)
                            .exteriorColor("Plasma Yellow").doors(4).seats(5).mileage(140).batteryRange(457)
                            .trim("Premium").price(new BigDecimal("47995.00"))
                            .vin("JF1ZMARJ8P8001025").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("1500.00"))
                            .condition(Condition.NEW).description("All-wheel drive electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.MINI).model("Cooper SE").bodyType(BodyType.HATCHBACK)
                            .exteriorColor("Electric Blue").doors(4).seats(4).mileage(31000).batteryRange(183)
                            .trim("Iconic").price(new BigDecimal("31900.00"))
                            .vin("WMW5C7204N5001026").discountPercentage(new BigDecimal("0.08")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Compact electric city car").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.TOYOTA).model("bZ4X").bodyType(BodyType.SUV)
                            .exteriorColor("Blueprint").doors(4).seats(5).mileage(180).batteryRange(516)
                            .trim("XLE").price(new BigDecimal("44080.00"))
                            .vin("JTMAB3FV4PD001028").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("2200.00"))
                            .condition(Condition.NEW).description("All-wheel drive electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.JAGUAR).model("I-PACE").bodyType(BodyType.SUV)
                            .exteriorColor("Borrego Silver").doors(4).seats(5).mileage(19500).batteryRange(470)
                            .trim("HSE").price(new BigDecimal("71300.00"))
                            .vin("SADHD2S18PA001029").discountPercentage(new BigDecimal("0.07")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("British luxury electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.ALFA_ROMEO).model("Tonale").bodyType(BodyType.SUV)
                            .exteriorColor("Alfa Red").doors(4).seats(5).mileage(65).batteryRange(350)
                            .trim("Veloce").price(new BigDecimal("48900.00"))
                            .vin("ZARAN2JN1P6001030").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Italian hybrid electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.GMC).model("Hummer EV").bodyType(BodyType.TRUCK)
                            .exteriorColor("White Frost").doors(4).seats(5).mileage(25).batteryRange(625)
                            .trim("3X").price(new BigDecimal("98845.00"))
                            .vin("1GT43VEL2PF001031").discountPercentage(BigDecimal.ZERO).discountAmount(new BigDecimal("5000.00"))
                            .condition(Condition.NEW).description("Super truck electric pickup").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.PORSCHE).model("Taycan").bodyType(BodyType.SEDAN)
                            .exteriorColor("Guards Red").doors(4).seats(4).mileage(12500).batteryRange(670)
                            .trim("Turbo S").price(new BigDecimal("185000.00"))
                            .vin("WP0ZZZE19NS001032").discountPercentage(new BigDecimal("0.04")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("High-performance electric sports sedan").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.LAND_ROVER).model("Range Rover Evoque").bodyType(BodyType.SUV)
                            .exteriorColor("Byron Blue").doors(4).seats(5).mileage(115).batteryRange(420)
                            .trim("P400e").price(new BigDecimal("55400.00"))
                            .vin("SALYK2RX8PA001033").discountPercentage(new BigDecimal("0.03")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Luxury hybrid electric SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.RAM).model("1500 REV").bodyType(BodyType.TRUCK)
                            .exteriorColor("Flame Red").doors(4).seats(5).mileage(35).batteryRange(690)
                            .trim("Laramie").price(new BigDecimal("74910.00"))
                            .vin("1C6RREHJ9PS001039").discountPercentage(new BigDecimal("0.02")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Electric pickup truck").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2024).make(Make.DODGE).model("Hornet").bodyType(BodyType.SUV)
                            .exteriorColor("Destroyer Grey").doors(4).seats(5).mileage(165).batteryRange(48)
                            .trim("R/T").price(new BigDecimal("40915.00"))
                            .vin("ZFBCFABH6PZ001040").discountPercentage(new BigDecimal("0.04")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.NEW).description("Performance hybrid SUV").status(VehicleStatus.AVAILABLE).build(),

                    Vehicle.builder().year(2023).make(Make.MITSUBISHI).model("Outlander PHEV").bodyType(BodyType.SUV)
                            .exteriorColor("Diamond White Pearl").doors(4).seats(7).mileage(38500).batteryRange(61)
                            .trim("GT").price(new BigDecimal("42395.00"))
                            .vin("JA4J4TA81PZ001041").discountPercentage(new BigDecimal("0.07")).discountAmount(BigDecimal.ZERO)
                            .condition(Condition.USED).description("Plug-in hybrid family SUV").status(VehicleStatus.AVAILABLE).build()

            );
            
            // Apply discount calculations for all vehicles
            vehicles.forEach(Vehicle::updateDiscountCalculations);
            
            vehicleRepository.saveAll(vehicles);
            System.out.println("SUCCESS: Seeded 70 vehicle records.");
        } else {
            System.out.println("Vehicles already present — skipping seeding.");
        }
    }
}
