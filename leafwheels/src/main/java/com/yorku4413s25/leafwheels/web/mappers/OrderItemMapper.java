package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.domain.OrderItem;
import com.yorku4413s25.leafwheels.web.models.OrderItemDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class, AccessoryMapper.class})
public interface OrderItemMapper {
    OrderItemDto orderItemToOrderItemDto(OrderItem orderItem);
    OrderItem orderItemDtoToOrderItem(OrderItemDto orderItemDto);
    void orderItemDtoToOrderItemUpdate(OrderItemDto orderItemDto, @MappingTarget OrderItem existing);
}
