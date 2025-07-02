package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.ItemType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;

    // only if OrderItemType is VEHICLE
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // only if OrderItemType is ACCESSORY
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accessory_id")
    private Accessory accessory;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int quantity;
}
