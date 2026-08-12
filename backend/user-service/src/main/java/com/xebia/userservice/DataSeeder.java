package com.xebia.userservice;

import com.xebia.userservice.model.User;
import com.xebia.userservice.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserService userService;

    public DataSeeder(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        List<User> existing = userService.getAllUsers();
        if (existing.isEmpty()) {
            System.out.println("Seeding demo users...");
            List<User> demoUsers = List.of(
                createUser("Kevin", "kevin@xebia.com", "teacher", "Engineering", "https://i.pravatar.cc/150?u=kevin-xebia"),
                createUser("Nikhil", "nikhil@xebia.com", "teacher", "Engineering", "https://i.pravatar.cc/150?u=nikhil-xebia"),
                createUser("Abhinay", "abhinay@xebia.com", "student", "Computer Science", "https://i.pravatar.cc/150?u=abhinay-xebia"),
                createUser("Khanoj", "khanoj@xebia.com", "student", "Computer Science", "https://i.pravatar.cc/150?u=khanoj-xebia"),
                createUser("Revanth", "revanth@xebia.com", "student", "Computer Science", "https://i.pravatar.cc/150?u=revanth-xebia")
            );
            UserService.BulkResult result = userService.createUsersBulk(demoUsers);
            System.out.println("Seeded " + result.getSuccessCount() + " users, " + result.getFailCount() + " failed");
        } else {
            System.out.println("Users already exist (" + existing.size() + "). Skipping seed.");
        }
    }

    private User createUser(String name, String email, String role, String department, String avatar) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setDepartment(department);
        user.setAvatar(avatar);
        return user;
    }
}
