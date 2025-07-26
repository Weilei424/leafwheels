package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.AnalyticsEventDto;
import com.yorku4413s25.leafwheels.web.models.AnalyticsEventBatchDto;

public interface AnalyticsService {
    void processEvent(AnalyticsEventDto event);
    void processEventBatch(AnalyticsEventBatchDto batch);
}