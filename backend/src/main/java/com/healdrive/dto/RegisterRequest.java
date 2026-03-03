package com.healdrive.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;

    @JsonProperty("mot_de_passe")
    private String motDePasse;

    private String role;
    private String telephone;
}
