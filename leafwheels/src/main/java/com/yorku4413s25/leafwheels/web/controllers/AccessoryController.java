package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AccessoryService;
import com.yorku4413s25.leafwheels.web.models.AccessoryDto;
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
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accessories")
@Tag(name = "Accessory API", description = "Endpoints for managing accessories")
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
            description = "Create an accessory and return the created object"
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
    public ResponseEntity<AccessoryDto> createAccessory(@RequestBody AccessoryDto dto) {
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
    public ResponseEntity<Void> deleteAccessory(@PathVariable UUID id) {
        accessoryService.deleteAccessory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(
            summary = "Update an accessory",
            description = "Update an accessory by its ID"
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
    public ResponseEntity<AccessoryDto> updateAccessory(@PathVariable UUID id, @RequestBody AccessoryDto dto) {
        return new ResponseEntity<>(accessoryService.createAccessory(dto), HttpStatus.OK);
    }
}
