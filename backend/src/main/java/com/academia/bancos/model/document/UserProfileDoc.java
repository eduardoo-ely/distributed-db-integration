package com.academia.bancos.model.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Document(collection = "user_profiles")
@Data
public class UserProfileDoc {
    @Id
    private String userId;
    private Integer age;
    private String country;
    private String subscriptionType;
    private List<String> genres;

    @Transient
    private String originDatabase = "MongoDB";
}