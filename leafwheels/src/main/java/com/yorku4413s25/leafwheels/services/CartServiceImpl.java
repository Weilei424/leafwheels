package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.ItemType;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
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
import java.util.Optional;
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
        validateCartItemDto(dto);
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().userId(userId).items(new ArrayList<>()).build();
                    return cartRepository.save(newCart);
                });

        if (dto.getType() == ItemType.VEHICLE) {
            Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                    .orElseThrow(() -> new EntityNotFoundException(dto.getVehicleId(), Vehicle.class));

            if (vehicle.getStatus() != null && vehicle.getStatus() != VehicleStatus.AVAILABLE) {
                throw new RuntimeException("Vehicle is not available.");
            }

            boolean alreadyInCart = cart.getItems().stream()
                    .anyMatch(i -> i.getType() == ItemType.VEHICLE &&
                            i.getVehicle() != null &&
                            i.getVehicle().getId().equals(dto.getVehicleId()));
            if (alreadyInCart) {
                throw new RuntimeException("This vehicle is already in your cart.");
            }

            vehicle.setStatus(VehicleStatus.PENDING);
            vehicleRepository.save(vehicle);

            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .type(ItemType.VEHICLE)
                    .vehicle(vehicle)
                    .unitPrice(vehicle.getDiscountPrice() != null ? vehicle.getDiscountPrice() : vehicle.getPrice())
                    .quantity(1) // always 1 for vehicles
                    .build();

            cart.getItems().add(cartItem);
        } else if (dto.getType() == ItemType.ACCESSORY) {
            Accessory accessory = accessoryRepository.findById(dto.getAccessoryId())
                    .orElseThrow(() -> new RuntimeException("Accessory not found"));

            if (dto.getQuantity() <= 0) {
                throw new RuntimeException("Quantity must be greater than zero.");
            }
            if (dto.getQuantity() > accessory.getQuantity()) {
                throw new RuntimeException("Not enough accessory stock available.");
            }

            Optional<CartItem> existing = cart.getItems().stream()
                    .filter(i -> i.getType() == ItemType.ACCESSORY &&
                            i.getAccessory() != null &&
                            i.getAccessory().getId().equals(dto.getAccessoryId()))
                    .findFirst();

            if (existing.isPresent()) {
                CartItem item = existing.get();
                int newQuantity = item.getQuantity() + dto.getQuantity();
                if (newQuantity > accessory.getQuantity()) {
                    throw new RuntimeException("Not enough accessory stock available for the new quantity.");
                }
                item.setQuantity(newQuantity);
            } else {
                CartItem cartItem = CartItem.builder()
                        .cart(cart)
                        .type(ItemType.ACCESSORY)
                        .accessory(accessory)
                        .unitPrice(accessory.getDiscountPrice() != null ? accessory.getDiscountPrice() : accessory.getPrice())
                        .quantity(dto.getQuantity())
                        .build();
                cart.getItems().add(cartItem);
            }
        } else {
            throw new RuntimeException("Invalid cart item type.");
        }

        cartRepository.save(cart);

        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto incrementAccessoryInCart(UUID userId, UUID accessoryId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));
        CartItem cartItem = cart.getItems().stream()
                .filter(i -> i.getType() == ItemType.ACCESSORY && i.getAccessory().getId().equals(accessoryId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(accessoryId, CartItem.class));
        Accessory accessory = cartItem.getAccessory();

        if (cartItem.getQuantity() + 1 > accessory.getQuantity()) {
            throw new RuntimeException("Not enough accessory stock available.");
        }
        cartItem.setQuantity(cartItem.getQuantity() + 1);
        cartRepository.save(cart);
        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto decrementAccessoryInCart(UUID userId, UUID accessoryId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));
        CartItem cartItem = cart.getItems().stream()
                .filter(i -> i.getType() == ItemType.ACCESSORY && i.getAccessory().getId().equals(accessoryId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(accessoryId, CartItem.class));

        if (cartItem.getQuantity() == 1) {
            cart.getItems().remove(cartItem);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
        }
        cartRepository.save(cart);
        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto removeItemFromCart(UUID userId, UUID itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));
        CartItem toRemove = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(itemId, CartItem.class));

        if (toRemove.getType() == ItemType.VEHICLE && toRemove.getVehicle() != null) {
            Vehicle vehicle = toRemove.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        cart.getItems().remove(toRemove);
        cartRepository.save(cart);
        return cartMapper.cartToCartDto(cart);
    }

    @Override
    @Transactional
    public CartDto clearCart(UUID userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException(userId, Cart.class));

        for (CartItem item : cart.getItems()) {
            if (item.getType() == ItemType.VEHICLE && item.getVehicle() != null) {
                Vehicle vehicle = item.getVehicle();
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle);
            }
        }
        
        cart.getItems().clear();

        cartRepository.save(cart);
        return cartMapper.cartToCartDto(cart);
    }

    private Cart createEmptyCart(UUID userId) {
        Cart cart = Cart.builder()
                .userId(userId)
                .items(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    private void validateCartItemDto(CreateCartItemDto dto) {
        if (dto.getType() == ItemType.VEHICLE) {
            if (dto.getVehicleId() == null) {
                throw new IllegalArgumentException("vehicleId is required for VEHICLE type cart item");
            }
            if (dto.getAccessoryId() != null) {
                throw new IllegalArgumentException("accessoryId must be null for VEHICLE type cart item");
            }
        } else if (dto.getType() == ItemType.ACCESSORY) {
            if (dto.getAccessoryId() == null) {
                throw new IllegalArgumentException("accessoryId is required for ACCESSORY type cart item");
            }
            if (dto.getVehicleId() != null) {
                throw new IllegalArgumentException("vehicleId must be null for ACCESSORY type cart item");
            }
        } else {
            throw new IllegalArgumentException("Invalid cart item type: " + dto.getType());
        }
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
