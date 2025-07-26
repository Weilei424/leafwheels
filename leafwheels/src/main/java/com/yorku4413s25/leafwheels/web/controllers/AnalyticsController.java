package com.yorku4413s25.leafwheels.web.controllers;

import com.yorku4413s25.leafwheels.services.AnalyticsService;
import com.yorku4413s25.leafwheels.web.models.AnalyticsEventDto;
import com.yorku4413s25.leafwheels.web.models.AnalyticsEventBatchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/events")
    public ResponseEntity<Void> trackEvents(@RequestBody AnalyticsEventBatchDto batch) {
        try {
            analyticsService.processEventBatch(batch);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process analytics events", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/event")
    public ResponseEntity<Void> trackEvent(@RequestBody AnalyticsEventDto event) {
        try {
            analyticsService.processEvent(event);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process analytics event", e);
            return ResponseEntity.badRequest().build();
        }
    }
}