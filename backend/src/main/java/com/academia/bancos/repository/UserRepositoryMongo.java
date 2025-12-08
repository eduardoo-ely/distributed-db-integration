package com.academia.bancos.repository;

import com.academia.bancos.model.document.UserProfileDoc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepositoryMongo extends MongoRepository<UserProfileDoc, String> {}