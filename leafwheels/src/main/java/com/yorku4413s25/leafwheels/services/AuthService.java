package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.web.models.*;

public interface AuthService {
    AuthResponseDto signup(SignupRequestDto request);
    AuthResponseDto signin(SigninRequestDto request);
    AuthResponseDto refreshToken(RefreshTokenRequestDto request);
    void signout(String refreshToken);
    void initiatePasswordReset(PasswordResetRequestDto request);
    void resetPassword(PasswordResetDto request);
}