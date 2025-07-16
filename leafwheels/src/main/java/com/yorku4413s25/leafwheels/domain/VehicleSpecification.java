package com.yorku4413s25.leafwheels.domain;

import com.yorku4413s25.leafwheels.constants.BodyType;
import com.yorku4413s25.leafwheels.constants.Condition;
import com.yorku4413s25.leafwheels.constants.Make;
import com.yorku4413s25.leafwheels.constants.VehicleStatus;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.JoinType;
import java.math.BigDecimal;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> hasYear(Integer year) {
        return (root, query, cb) -> year == null ? null : cb.equal(root.get("year"), year);
    }

    public static Specification<Vehicle> hasMake(Make make) {
        return (root, query, cb) -> make == null ? null : cb.equal(root.get("make"), make);
    }

    public static Specification<Vehicle> hasModel(String model) {
        return (root, query, cb) -> model == null ? null : cb.equal(root.get("model"), model);
    }

    public static Specification<Vehicle> hasBodyType(BodyType bodyType) {
        return (root, query, cb) -> bodyType == null ? null : cb.equal(root.get("bodyType"), bodyType);
    }

    public static Specification<Vehicle> hasExteriorColor(String color) {
        return (root, query, cb) -> color == null ? null : cb.equal(root.get("exteriorColor"), color);
    }

    public static Specification<Vehicle> hasDoors(Integer doors) {
        return (root, query, cb) -> doors == null ? null : cb.equal(root.get("doors"), doors);
    }

    public static Specification<Vehicle> hasSeats(Integer seats) {
        return (root, query, cb) -> seats == null ? null : cb.equal(root.get("seats"), seats);
    }

    public static Specification<Vehicle> hasMileageBetween(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("mileage"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("mileage"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("mileage"), max);
            return null;
        };
    }

    public static Specification<Vehicle> hasBatteryRangeBetween(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("batteryRange"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("batteryRange"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("batteryRange"), max);
            return null;
        };
    }

    public static Specification<Vehicle> hasPriceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("price"), max);
            return null;
        };
    }

    public static Specification<Vehicle> hasOnDeal(Boolean onDeal) {
        return (root, query, cb) -> onDeal == null ? null : cb.equal(root.get("onDeal"), onDeal);
    }

    public static Specification<Vehicle> hasCondition(Condition condition) {
        return (root, query, cb) -> condition == null ? null : cb.equal(root.get("condition"), condition);
    }

    public static Specification<Vehicle> hasStatus(VehicleStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Vehicle> hasStatusIn(List<VehicleStatus> statuses) {
        return (root, query, cb) -> 
            (statuses == null || statuses.isEmpty()) ? null : root.get("status").in(statuses);
    }

    public static Specification<Vehicle> hasStatusNotIn(List<VehicleStatus> statuses) {
        return (root, query, cb) -> 
            (statuses == null || statuses.isEmpty()) ? null : cb.not(root.get("status").in(statuses));
    }

    public static Specification<Vehicle> hasAccidentHistory(Boolean hasAccidentHistory) {
        return (root, query, cb) ->
                hasAccidentHistory == null ? null :
                        (hasAccidentHistory
                                ? cb.isNotNull(root.join("vehicleHistories", JoinType.LEFT).get("id"))
                                : cb.isNull(root.join("vehicleHistories", JoinType.LEFT).get("id"))
                        );
    }
}
