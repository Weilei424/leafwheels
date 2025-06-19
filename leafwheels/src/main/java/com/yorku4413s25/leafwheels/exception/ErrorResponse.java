package com.yorku4413s25.leafwheels.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
public class ErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private OffsetDateTime timestamp;
    private List<String> messages;

    public ErrorResponse(List<String> messages) {
        this.timestamp = OffsetDateTime.now();
        this.messages = messages;
    }
}
