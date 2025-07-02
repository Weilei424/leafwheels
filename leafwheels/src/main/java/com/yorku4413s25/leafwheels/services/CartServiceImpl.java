package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.domain.Accessory;
import com.yorku4413s25.leafwheels.domain.Cart;
import com.yorku4413s25.leafwheels.domain.CartItem;
import com.yorku4413s25.leafwheels.domain.Vehicle;
import com.yorku4413s25.leafwheels.exception.EntityNotFoundException;
import com.yorku4413s25.leafwheels.repositories.AccessoryRepository;
import com.yorku4413s25.leafwheels.repositories.CartRepository;
import com.yorku4413s25.leafwheels.repositories.VehicleRepository;
import com.yorku4413s25.leafwheels.web.mappers.CartItemMapper;
import com.yorku4413s25.leafwheels.web.mappers.CartMapper;
import com.yorku4413s25.leafwheels.web.models.CartDto;
import com.yorku4413s25.leafwheels.web.models.CreateCartItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final VehicleRepository vehicleRepository;
    private final AccessoryRepository accessoryRepository;
    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;

    @Override
    @Transactional
    public CartDto getCartByUserId(UUID userId) {
        return cartMapper.cartToCartDto(
                cartRepository.findByUserId(userId)
                        .orElseGet(() -> createEmptyCart(userId))
        );
    }

    @Override
    @Transactional
    public CartDto addItemToCart(UUID userId, CreateCartItemDto dto) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createEmptyCart(userId));

        CartItem item = buildCartItem(dto, cart);

        // If the same item (by vehicleId or accessoryId) already exists, update quantity instead
        boolean updated = false;
        for (CartItem ci : cart.getItems()) {
            if (isSameCartItem(ci, item)) {
                ci.setQuantity(ci.getQuantity() + item.getQuantity());
                updated = true;
                break;
            }
        }
        if (!updated) {
            cart.getItems().add(item);
        }

        cartRepository.save(cart);

        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeItemFromCart(UUID userId, UUID cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));

        cartRepository.save(cart);

        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));
        cart.getItems().clear();

        cartRepository.save(cart);
    }

    private Cart createEmptyCart(UUID userId) {
        Cart cart = Cart.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    private CartItem buildCartItem(CreateCartItemDto dto, Cart cart) {
        CartItem.CartItemBuilder itemBuilder = CartItem.builder()
                .cart(cart)
                .type(dto.getType())
                .unitPrice(dto.getUnitPrice())
                .quantity(dto.getQuantity());

        if (dto.getType() == ItemType.VEHICLE) {
            if (dto.getVehicleId() == null) throw new IllegalArgumentException("vehicleId required");
            Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                    .orElseThrow(() -> new EntityNotFoundException(dto.getVehicleId(), Vehicle.class));
            itemBuilder.vehicle(vehicle).accessory(null);
            itemBuilder.unitPrice(vehicle.getPrice()); // Always use up-to-date price!
            itemBuilder.quantity(1); // Vehicles: always 1
        } else if (dto.getType() == ItemType.ACCESSORY) {
            if (dto.getAccessoryId() == null) throw new IllegalArgumentException("accessoryId required");
            Accessory accessory = accessoryRepository.findById(dto.getAccessoryId())
                    .orElseThrow(() -> new EntityNotFoundException(dto.getAccessoryId(), Accessory.class));
            itemBuilder.accessory(accessory).vehicle(null);
            itemBuilder.unitPrice(accessory.getPrice());
        } else {
            throw new IllegalArgumentException("Unsupported cart item type: " + dto.getType());
        }
        return itemBuilder.build();
    }

    private boolean isSameCartItem(CartItem a, CartItem b) {
        if (a.getType() != b.getType()) return false;
        if (a.getType() == ItemType.VEHICLE)
            return a.getVehicle() != null && b.getVehicle() != null &&
                    Objects.equals(a.getVehicle().getId(), b.getVehicle().getId());
        if (a.getType() == ItemType.ACCESSORY)
            return a.getAccessory() != null && b.getAccessory() != null &&
                    Objects.equals(a.getAccessory().getId(), b.getAccessory().getId());
        return false;
    }
}
