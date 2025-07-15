package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Table(name = "vehicles")
public class Vehicle extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, name = "`year`")
    private int year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Make make;

    @Column(length = 50, nullable = false)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private BodyType bodyType;

    @Column(length = 30)
    private String exteriorColor;

    @Column(nullable = false)
    private int doors;

    @Column(nullable = false)
    private int seats;

    @Column(nullable = false)
    private int mileage;

    @Column(nullable = false)
    private int batteryRange;

    @Column(length = 50)
    private String trim;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private boolean onDeal = false;

    @Column(length = 17, unique = true)
    private String vin;

    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Condition condition;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private VehicleStatus status;

    @ElementCollection
    @CollectionTable(name = "vehicle_image_urls", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls;

    @OneToMany(mappedBy = "vehicle", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<VehicleHistory> vehicleHistories;

}
