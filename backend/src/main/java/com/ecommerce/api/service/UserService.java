package com.ecommerce.api.service;

import com.ecommerce.api.dto.UserDTO;

public interface UserService {
    UserDTO getProfileByEmail(String email);
    UserDTO updateProfile(String email, UserDTO userDTO);
}
