package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import com.yorku4413s25.leafwheels.validation.OneDiscountType;
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
@OneDiscountType
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

    @Column(precision = 12, scale = 2, nullable = true)
    private BigDecimal discountPrice;

    @Column(precision = 5, scale = 2, nullable = true)
    @DecimalMax(value = "1.00", message = "Discount percentage cannot exceed 100%")
    @DecimalMin(value = "0.00", message = "Discount percentage cannot be negative")
    @Digits(integer = 3, fraction = 2, message = "Discount percentage must have at most 2 decimal places")
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = true)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = true)
    private Boolean onDeal = false;

    @Column(length = 17, unique = true)
    private String vin;

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


    public void updateDiscountCalculations() {
        if (this.price != null) {
            if (this.discountAmount != null && this.discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                this.discountPrice = this.price.subtract(this.discountAmount);
                this.onDeal = true;
            }
            else if (this.discountPercentage != null && this.discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                this.discountPrice = this.price.multiply(BigDecimal.ONE.subtract(this.discountPercentage));
                this.onDeal = true;
            }
            else {
                this.discountPrice = this.price;
                this.onDeal = false;
            }
        }
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
        if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            this.discountAmount = BigDecimal.ZERO;
        }
        updateDiscountCalculations();
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
        if (discountAmount != null && discountAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.discountPercentage = BigDecimal.ZERO;
        }
        updateDiscountCalculations();
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        updateDiscountCalculations();
    }

}
