package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.domain.Cart;
import com.yorku4413s25.leafwheels.domain.CartItem;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class CartChecksumService {

    public String calculateChecksum(Cart cart) {
        try {
            String cartData = cart.getItems().stream()
                .sorted(Comparator.comparing(item -> item.getId().toString()))
                .map(this::itemToString)
                .collect(Collectors.joining("|"));
            
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(cartData.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            
            String hashText = no.toString(16);
            while (hashText.length() < 32) {
                hashText = "0" + hashText;
            }
            return hashText;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error calculating cart checksum", e);
        }
    }

    private String itemToString(CartItem item) {
        return String.format("%s:%s:%s:%s:%d", 
            item.getId().toString(),
            item.getType().name(),
            item.getVehicle() != null ? item.getVehicle().getId().toString() : "null",
            item.getAccessory() != null ? item.getAccessory().getId().toString() : "null",
            item.getQuantity());
    }
}