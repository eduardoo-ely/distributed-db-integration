package com.academia.bancos.model.node;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import com.fasterxml.jackson.annotation.JsonIgnore; // <--- 1. Importe isto
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Node("User")
@Data
public class UserNode {
    @Id
    private String userId;

    @JsonIgnore
    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.OUTGOING)
    private Set<UserNode> following = new HashSet<>();

    public void follows(UserNode user) {
        if (following == null) following = new HashSet<>();
        following.add(user);
    }
}