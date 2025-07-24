package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
import com.yorku4413s25.leafwheels.web.models.AccessoryRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accessories")
@Tag(name = "Accessory API", description = "Endpoints for managing accessories with automatic discount calculation")
@RequiredArgsConstructor
public class AccessoryController {

    private final AccessoryService accessoryService;

    @Operation(
            summary = "Get all accessories",
            description = "Return a list of all accessories in the system"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful retrieval of all accessories",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AccessoryDto.class)))
            )
    })
    @GetMapping("/all")
    public ResponseEntity<List<AccessoryDto>> getAllAccessories() {
        return new ResponseEntity<>(accessoryService.getAllAccessories(), HttpStatus.OK);
    }

    @Operation(
            summary = "Get accessory by ID",
            description = "Return an accessory by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successful retrieval of the accessory by ID",
                    content = @Content(schema = @Schema(implementation = AccessoryDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Accessory does not exist",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<AccessoryDto> getAccessory(@PathVariable UUID id) {
        return new ResponseEntity<>(accessoryService.getAccessoryById(id), HttpStatus.OK);
    }

    @Operation(
            summary = "Create a new accessory",
            description = "Create an accessory and return the created object. The discount system automatically calculates the final price and deal status based on either discount percentage or discount amount. Discount percentage represents the percentage off (e.g., 0.15 = 15% off) with discountPrice = originalPrice * (1 - discountPercentage). Discount amount represents a fixed dollar amount off (e.g., 25.00 = $25 off) with discountPrice = originalPrice - discountAmount. The onDeal flag is automatically set to true when either discountPercentage > 0 or discountAmount > 0. Note: discountAmount and discountPercentage cannot both be set simultaneously."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Accessory created",
                    content = @Content(schema = @Schema(implementation = AccessoryDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccessoryDto> createAccessory(@RequestBody AccessoryRequestDto requestDto) {
        AccessoryDto dto = convertToAccessoryDto(requestDto);
        validateDiscountMutualExclusivity(dto);
        return new ResponseEntity<>(accessoryService.createAccessory(dto), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Delete an accessory",
            description = "Delete an accessory by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Accessory deleted",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Accessory does not exist",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAccessory(@PathVariable UUID id) {
        accessoryService.deleteAccessory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(
            summary = "Update an accessory",
            description = "Update an accessory by its ID. The discount system automatically recalculates the final price and deal status based on any changes to the original price, discount percentage, or discount amount. Users cannot directly modify the discounted price or deal status as these are computed automatically. Note: discountAmount and discountPercentage cannot both be set simultaneously."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Accessory updated",
                    content = @Content(schema = @Schema(implementation = AccessoryDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Accessory does not exist",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccessoryDto> updateAccessory(@PathVariable UUID id, @RequestBody AccessoryRequestDto requestDto) {
        AccessoryDto dto = convertToAccessoryDto(requestDto);
        validateDiscountMutualExclusivity(dto);
        return new ResponseEntity<>(accessoryService.updateById(id, dto), HttpStatus.OK);
    }

    @Operation(
            summary = "Add image URLs to an accessory",
            description = "Add one or more image URLs to an existing accessory"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Image URLs added successfully",
                    content = @Content(schema = @Schema(implementation = AccessoryDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Accessory not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccessoryDto> addImageUrls(
            @PathVariable UUID id,
            @RequestBody List<String> imageUrls) {
        return ResponseEntity.ok(accessoryService.addImageUrls(id, imageUrls));
    }

    private AccessoryDto convertToAccessoryDto(AccessoryRequestDto requestDto) {
        return AccessoryDto.builder()
                .id(requestDto.getId())
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .price(requestDto.getPrice())
                .discountPercentage(requestDto.getDiscountPercentage() != null ? requestDto.getDiscountPercentage() : BigDecimal.ZERO)
                .discountAmount(requestDto.getDiscountAmount() != null ? requestDto.getDiscountAmount() : BigDecimal.ZERO)
                .quantity(requestDto.getQuantity())
                .imageUrls(requestDto.getImageUrls())
                .build();
    }

    private void validateDiscountMutualExclusivity(AccessoryDto dto) {
        if (dto.getDiscountAmount() != null && dto.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0 &&
            dto.getDiscountPercentage() != null && dto.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalStateException("Accessory cannot have both discountAmount and discountPercentage set");
        }
    }
}
