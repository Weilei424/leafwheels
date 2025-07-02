package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.CartItem;
import com.yorku4413s25.leafwheels.web.models.CartItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class, AccessoryMapper.class})
public interface CartItemMapper {
    CartItemDto cartItemToCartItemDto(CartItem item);
    CartItem cartItemDtoToCartItem(CartItemDto itemDto);
    void cartItemDtoToCartItemUpdate(CartItemDto itemDto, @MappingTarget CartItem existing);
}
