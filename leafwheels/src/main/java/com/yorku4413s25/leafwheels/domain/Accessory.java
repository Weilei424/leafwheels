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

    @Column(nullable = false)
    private int quantity;

    @ElementCollection
    @CollectionTable(name = "accessory_image_urls", joinColumns = @JoinColumn(name = "accessory_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls;
}
