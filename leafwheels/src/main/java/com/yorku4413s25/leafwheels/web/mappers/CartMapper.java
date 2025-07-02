package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.Cart;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {
    CartDto cartToCartDto(Cart cart);
    Cart cartDtoToCart(CartDto cartDto);
    void cartDtoToCartUpdate(CartDto cartDto, @MappingTarget Cart existing);
}
