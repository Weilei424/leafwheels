package com.yorku4413s25.leafwheels.web.models;

import lombok.Data;
import java.util.List;

@Data
public class AnalyticsEventBatchDto {
    private List<AnalyticsEventDto> events;
}