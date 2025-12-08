package com.academia.bancos.repository;

import com.academia.bancos.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepositoryPG extends JpaRepository<UserEntity, String> {

    Optional<UserEntity> findByEmail(String email);

}