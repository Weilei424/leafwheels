package com.yorku4413s25.leafwheels.web.mappers;

import com.yorku4413s25.leafwheels.constants.PaymentStatus;
import com.yorku4413s25.leafwheels.domain.Payment;
import com.yorku4413s25.leafwheels.web.models.PaymentResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "message", source = "status", qualifiedByName = "statusToMessage")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "instantToLocalDateTime")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "instantToLocalDateTime")
    PaymentResponseDto toDto(Payment payment);

    @Named("statusToMessage")
    default String statusToMessage(PaymentStatus status) {
        return switch (status) {
            case APPROVED -> "Order Successfully Completed.";
            case DENIED -> "Credit Card Authorization Failed.";
            case PENDING -> "Payment is being processed.";
            case FAILED -> "Payment failed due to technical error.";
            case REFUNDED -> "Payment has been refunded.";
        };
    }

    @Named("instantToLocalDateTime")
    default LocalDateTime instantToLocalDateTime(Instant instant) {
        return instant != null ? LocalDateTime.ofInstant(instant, ZoneId.systemDefault()) : null;
    }
}
