package com.yorku4413s25.leafwheels.services;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Service
@Slf4j
public class DatabaseMetricsService {
    
    private final MeterRegistry meterRegistry;
    private final DataSource dataSource;
    
    private final Counter databaseQueriesCounter;
    private final Counter databaseErrorsCounter;
    private final Timer databaseQueryTimer;
    private final Gauge databaseConnectionsGauge;
    
    public DatabaseMetricsService(MeterRegistry meterRegistry, DataSource dataSource) {
        this.meterRegistry = meterRegistry;
        this.dataSource = dataSource;
        
        this.databaseQueriesCounter = Counter.builder("leafwheels.database.queries")
                .description("Total database queries executed")
                .register(meterRegistry);
        
        this.databaseErrorsCounter = Counter.builder("leafwheels.database.errors")
                .description("Database query errors")
                .register(meterRegistry);
        
        this.databaseQueryTimer = Timer.builder("leafwheels.database.query.duration")
                .description("Database query execution time")
                .register(meterRegistry);
        
        this.databaseConnectionsGauge = Gauge.builder("leafwheels.database.tables.count", this, DatabaseMetricsService::getTableCount)
                .description("Number of tables in database")
                .register(meterRegistry);
    }
    
    public void recordQuery(String operation) {
        Counter.builder("leafwheels.database.queries")
                .tag("operation", operation)
                .register(meterRegistry)
                .increment();
    }
    
    public void recordError(String operation, Exception error) {
        Counter.builder("leafwheels.database.errors")
                .tag("operation", operation)
                .tag("error_type", error.getClass().getSimpleName())
                .register(meterRegistry)
                .increment();
    }
    
    public Timer.Sample startQueryTimer() {
        return Timer.start(meterRegistry);
    }
    
    public void recordQueryTime(Timer.Sample sample, String operation) {
        sample.stop(Timer.builder("leafwheels.database.query.duration")
                .tag("operation", operation)
                .register(meterRegistry));
    }
    
    private double getTableCount() {
        try (Connection connection = dataSource.getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")) {
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        return resultSet.getDouble(1);
                    }
                }
            }
        } catch (SQLException e) {
            log.warn("Failed to get table count: {}", e.getMessage());
        }
        return 0;
    }
    
    public double getDatabaseSize() {
        try (Connection connection = dataSource.getConnection()) {
            try (PreparedStatement statement = connection.prepareStatement(
                    "SELECT pg_database_size(current_database())")) {
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        return resultSet.getDouble(1);
                    }
                }
            }
        } catch (SQLException e) {
            log.warn("Failed to get database size: {}", e.getMessage());
        }
        return 0;
    }
}