package com.academia.bancos.repository;

import com.academia.bancos.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositoryPG extends JpaRepository<UserEntity, String> {}