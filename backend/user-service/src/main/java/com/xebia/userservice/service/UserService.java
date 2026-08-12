package com.xebia.userservice.service;

import com.xebia.userservice.model.User;
import com.xebia.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    public BulkResult createUsersBulk(List<User> users) {
        BulkResult result = new BulkResult();
        result.total = users.size();
        result.created = new ArrayList<>();
        result.failed = new ArrayList<>();

        for (User user : users) {
            try {
                User saved = userRepository.save(user);
                result.created.add(saved);
            } catch (Exception e) {
                result.failed.add(user.getName() != null ? user.getName() : "Unknown: " + e.getMessage());
            }
        }
        return result;
    }

    public static class BulkResult {
        public int total;
        public List<User> created;
        public List<String> failed;

        public int getTotal() { return total; }
        public int getSuccessCount() { return created.size(); }
        public int getFailCount() { return failed.size(); }
        public List<User> getCreated() { return created; }
        public List<String> getFailed() { return failed; }
    }
}
