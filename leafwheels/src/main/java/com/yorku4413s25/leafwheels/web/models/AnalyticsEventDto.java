package com.yorku4413s25.leafwheels.web.models;

import lombok.Data;
import java.util.Map;

@Data
public class AnalyticsEventDto {
    private String event;
    private Map<String, Object> properties;
}