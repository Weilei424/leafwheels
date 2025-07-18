package com.yorku4413s25.leafwheels.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "accessories")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Accessory extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2, nullable = true)
    private BigDecimal discountPrice;

    @Column(precision = 5, scale = 2, nullable = true)
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = true)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = true)
    private Boolean onDeal = false;

    @Column(nullable = false)
    private int quantity;

    @ElementCollection
    @CollectionTable(name = "accessory_image_urls", joinColumns = @JoinColumn(name = "accessory_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls;

    public void updateDiscountCalculations() {
        if (this.price != null) {
            // Calculate based on discountAmount first
            if (this.discountAmount != null && this.discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                this.discountPrice = this.price.subtract(this.discountAmount);
                this.onDeal = true;
            }
            // Calculate based on discountPercentage if no discountAmount
            else if (this.discountPercentage != null && this.discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                this.discountPrice = this.price.multiply(BigDecimal.ONE.subtract(this.discountPercentage));
                this.onDeal = true;
            }
            // No discount
            else {
                this.discountPrice = this.price;
                this.onDeal = false;
            }
        }
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
        updateDiscountCalculations();
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
        updateDiscountCalculations();
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        updateDiscountCalculations();
    }
}
