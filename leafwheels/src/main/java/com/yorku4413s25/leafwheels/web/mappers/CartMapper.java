package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.domain.Cart;
import com.yorku4413s25.leafwheels.domain.CartItem;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {
    @Mapping(target = "totalPrice", source = "cart", qualifiedByName = "calculateTotalPrice")
    CartDto cartToCartDto(Cart cart);
    
    Cart cartDtoToCart(CartDto cartDto);
    void cartDtoToCartUpdate(CartDto cartDto, @MappingTarget Cart existing);

    @Named("calculateTotalPrice")
    default BigDecimal calculateTotalPrice(Cart cart) {
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return BigDecimal.ZERO;
        }

        return cart.getItems().stream()
                .map(this::getItemPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default BigDecimal getItemPrice(CartItem item) {
        if (item == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal unitPrice = BigDecimal.ZERO;
        int quantity = item.getQuantity();

        if (item.getType() == ItemType.VEHICLE && item.getVehicle() != null) {
            unitPrice = item.getVehicle().getDiscountPrice() != null 
                ? item.getVehicle().getDiscountPrice() 
                : item.getVehicle().getPrice();
        } else if (item.getType() == ItemType.ACCESSORY && item.getAccessory() != null) {
            unitPrice = item.getAccessory().getDiscountPrice() != null 
                ? item.getAccessory().getDiscountPrice() 
                : item.getAccessory().getPrice();
        }

        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
