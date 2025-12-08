package com.academia.bancos.repository;

import com.academia.bancos.config.MongoConfig;
import com.academia.bancos.model.UserProfile;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

/**
 * Repositório para perfis de usuário no MongoDB
 */

public class MongoUserRepository {

    private final MongoCollection<Document> collection;

    public MongoUserRepository() {
        MongoConfig config = MongoConfig.getInstance();
        MongoDatabase database = config.getDatabase();
        this.collection = database.getCollection("user_profiles");
        System.out.println("✅ Collection user_profiles inicializada");
    }

    public void save(UserProfile profile) {
        Document doc = toDocument(profile);
        collection.insertOne(doc);
    }

    public UserProfile findByUserId(String userId) {
        Document doc = collection.find(eq("userId", userId)).first();
        return doc != null ? fromDocument(doc) : null;
    }

    public List<UserProfile> findAll() {
        List<UserProfile> profiles = new ArrayList<>();
        collection.find().forEach(doc -> profiles.add(fromDocument(doc)));
        return profiles;
    }

    public List<UserProfile> findByCountry(String country) {
        List<UserProfile> profiles = new ArrayList<>();
        collection.find(eq("country", country)).forEach(doc -> profiles.add(fromDocument(doc)));
        return profiles;
    }

    public List<UserProfile> findBySubscriptionType(String subscriptionType) {
        List<UserProfile> profiles = new ArrayList<>();
        collection.find(eq("subscriptionType", subscriptionType))
                .forEach(doc -> profiles.add(fromDocument(doc)));
        return profiles;
    }

    public void update(UserProfile profile) {
        Document doc = toDocument(profile);
        collection.replaceOne(eq("userId", profile.getUserId()), doc);
    }

    public void delete(String userId) {
        collection.deleteOne(eq("userId", userId));
    }

    public boolean exists(String userId) {
        return collection.countDocuments(eq("userId", userId)) > 0;
    }

    public long count() {
        return collection.countDocuments();
    }

    private Document toDocument(UserProfile profile) {
        Document doc = new Document("userId", profile.getUserId())
                .append("age", profile.getAge())
                .append("country", profile.getCountry())
                .append("subscriptionType", profile.getSubscriptionType())
                .append("device", profile.getDevice())
                .append("genres", profile.getGenres())
                .append("gender", profile.getGender())
                .append("monthlyRevenue", profile.getMonthlyRevenue());
        return doc;
    }

    private UserProfile fromDocument(Document doc) {
        UserProfile profile = new UserProfile();
        profile.setUserId(doc.getString("userId"));
        profile.setAge(doc.getInteger("age"));
        profile.setCountry(doc.getString("country"));
        profile.setSubscriptionType(doc.getString("subscriptionType"));
        profile.setDevice(doc.getString("device"));

        @SuppressWarnings("unchecked")
        List<String> genres = (List<String>) doc.get("genres");
        profile.setGenres(genres);

        profile.setGender(doc.getString("gender"));
        profile.setMonthlyRevenue(doc.getDouble("monthlyRevenue"));

        return profile;
    }
}