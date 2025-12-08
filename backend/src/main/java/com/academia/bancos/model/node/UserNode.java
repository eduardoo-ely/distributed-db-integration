package com.academia.bancos.model.node;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.Set;

@Node("User")
@Data
public class UserNode {
    @Id
    private String userId;

    @JsonIgnore
    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.OUTGOING)
    @ToString.Exclude           // <--- ADICIONE ISSO
    @EqualsAndHashCode.Exclude
    private Set<UserNode> following = new HashSet<>();

    public void follows(UserNode user) {
        if (following == null) following = new HashSet<>();
        following.add(user);
    }
}