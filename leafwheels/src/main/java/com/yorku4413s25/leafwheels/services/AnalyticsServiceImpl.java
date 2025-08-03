package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.AnalyticsEventDto;
import com.yorku4413s25.leafwheels.web.models.AnalyticsEventBatchDto;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {
    
    private final MeterRegistry meterRegistry;
    private final Map<String, Counter> eventCounters = new ConcurrentHashMap<>();
    
    public AnalyticsServiceImpl(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }
    
    @Override
    public void processEvent(AnalyticsEventDto event) {
        log.info("Processing analytics event: {} with properties: {}", event.getEvent(), event.getProperties());
        
        Counter counter = eventCounters.computeIfAbsent(event.getEvent(), eventName -> 
            Counter.builder("leafwheels.frontend.events")
                    .tag("event_type", eventName)
                    .description("Frontend analytics events")
                    .register(meterRegistry)
        );
        
        counter.increment();
        
        processSpecificEventType(event);
    }
    
    @Override
    public void processEventBatch(AnalyticsEventBatchDto batch) {
        if (batch.getEvents() != null) {
            batch.getEvents().forEach(this::processEvent);
        }
    }
    
    private void processSpecificEventType(AnalyticsEventDto event) {
        switch (event.getEvent()) {
            case "page_view":
                processPageViewEvent(event);
                break;
            case "vehicle_view":
                processVehicleViewEvent(event);
                break;
            case "cart_action":
                processCartActionEvent(event);
                break;
            case "search":
                processSearchEvent(event);
                break;
            case "checkout_step":
                processCheckoutStepEvent(event);
                break;
            case "purchase":
                processPurchaseEvent(event);
                break;
            default:
                log.debug("Unknown event type: {}", event.getEvent());
        }
    }
    
    private void processPageViewEvent(AnalyticsEventDto event) {
        Map<String, Object> props = event.getProperties();
        String page = (String) props.get("page");
        
        if (page != null) {
            Counter.builder("leafwheels.frontend.page_views")
                    .tag("page", page)
                    .description("Page view events by page")
                    .register(meterRegistry)
                    .increment();
        }
    }
    
    private void processVehicleViewEvent(AnalyticsEventDto event) {
        Counter.builder("leafwheels.frontend.vehicle_views")
                .description("Vehicle detail page views from frontend")
                .register(meterRegistry)
                .increment();
    }
    
    private void processCartActionEvent(AnalyticsEventDto event) {
        Map<String, Object> props = event.getProperties();
        String action = (String) props.get("action");
        
        if (action != null) {
            Counter.builder("leafwheels.frontend.cart_actions")
                    .tag("action", action)
                    .description("Cart actions from frontend")
                    .register(meterRegistry)
                    .increment();
        }
    }
    
    private void processSearchEvent(AnalyticsEventDto event) {
        Counter.builder("leafwheels.frontend.searches")
                .description("Search events from frontend")
                .register(meterRegistry)
                .increment();
    }
    
    private void processCheckoutStepEvent(AnalyticsEventDto event) {
        Map<String, Object> props = event.getProperties();
        String step = (String) props.get("step");
        
        if (step != null) {
            Counter.builder("leafwheels.frontend.checkout_steps")
                    .tag("step", step)
                    .description("Checkout funnel steps")
                    .register(meterRegistry)
                    .increment();
        }
    }
    
    private void processPurchaseEvent(AnalyticsEventDto event) {
        Counter.builder("leafwheels.frontend.purchases")
                .description("Purchase completions from frontend")
                .register(meterRegistry)
                .increment();
    }
}