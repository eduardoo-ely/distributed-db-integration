package com.academia.bancos.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class UserEntity {
    @Id
    private String userId; // UUID vindo do JSON ou gerado
    private String email;
    private String passwordHash;

    @Transient // Campo apenas para controle, não salva no banco
    private String originDatabase = "PostgreSQL";
}