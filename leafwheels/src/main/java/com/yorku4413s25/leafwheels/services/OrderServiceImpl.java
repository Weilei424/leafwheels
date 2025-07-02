package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.constants.OrderStatus;
import com.yorku4413s25.leafwheels.domain.Accessory;
import com.yorku4413s25.leafwheels.domain.Order;
import com.yorku4413s25.leafwheels.domain.OrderItem;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.AccessoryRepository;
import com.yorku4413s25.leafwheels.repositories.OrderRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.OrderItemMapper;
import com.yorku4413s25.leafwheels.web.mappers.OrderMapper;
import com.yorku4413s25.leafwheels.web.models.CreateOrderItemDto;
import com.yorku4413s25.leafwheels.web.models.CreateOrderRequestDto;
import com.yorku4413s25.leafwheels.web.models.OrderDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final AccessoryRepository accessoryRepository;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;

    @Override
    @Transactional
    public OrderDto createOrder(UUID userId, CreateOrderRequestDto dto) {
        if (dto.getItems() == null || dto.getItems().isEmpty())
            throw new IllegalArgumentException("Order must have at least one item");

        // Build OrderItems and calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderItemDto itemDto : dto.getItems()) {
            OrderItem.OrderItemBuilder itemBuilder = OrderItem.builder()
                    .type(itemDto.getType())
                    .quantity(itemDto.getQuantity());

            if (itemDto.getType() == ItemType.VEHICLE) {
                if (itemDto.getVehicleId() == null)
                    throw new IllegalArgumentException("vehicleId required");
                Vehicle vehicle = vehicleRepository.findById(itemDto.getVehicleId())
                        .orElseThrow(() -> new EntityNotFoundException(itemDto.getVehicleId(), Vehicle.class));
                itemBuilder.vehicle(vehicle).accessory(null);
                itemBuilder.unitPrice(vehicle.getPrice());
                itemBuilder.quantity(1); // Only 1 vehicle per orderItem
                // Optionally mark vehicle as sold here or after payment
                // vehicle.setStatus(VehicleStatus.SOLD);
                total = total.add(vehicle.getPrice());
            } else if (itemDto.getType() == ItemType.ACCESSORY) {
                if (itemDto.getAccessoryId() == null)
                    throw new IllegalArgumentException("accessoryId required");
                Accessory accessory = accessoryRepository.findById(itemDto.getAccessoryId())
                        .orElseThrow(() -> new EntityNotFoundException(itemDto.getAccessoryId(), Accessory.class));
                itemBuilder.accessory(accessory).vehicle(null);
                BigDecimal price = accessory.getPrice();
                itemBuilder.unitPrice(price);
                total = total.add(price.multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            } else {
                throw new IllegalArgumentException("Unsupported order item type: " + itemDto.getType());
            }

            OrderItem item = itemBuilder.build();
            orderItems.add(item);
        }

        Order order = Order.builder()
                .userId(userId)
                .status(OrderStatus.PLACED)
                .totalPrice(total)
                .items(new ArrayList<>())
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        Order savedOrder = orderRepository.save(order);

        return orderMapper.orderToOrderDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto getOrderById(UUID orderId) {
        return orderMapper.orderToOrderDto(
                orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException(orderId, Order.class)));
    }

    @Override
    @Transactional
    public List<OrderDto> getOrdersByUserId(UUID userId) {
        return orderRepository.findAllByUserId(userId)
                .stream()
                .map(orderMapper::orderToOrderDto).toList();
    }
}
