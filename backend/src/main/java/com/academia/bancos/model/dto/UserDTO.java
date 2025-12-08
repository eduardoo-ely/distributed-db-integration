package com.academia.bancos.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserDTO {
    private String userId;
    private String email;
    private String password;

    // Dados Mongo
    private Integer age;
    private String country;
    private List<String> genres;

    // Dados Redis
    private Integer loginCount;

    // Dados Neo4j
    private List<String> followingIds;

    // Metadados
    private List<String> savedIn; // Lista onde foi salvo: ["Postgres", "Mongo", etc]
}