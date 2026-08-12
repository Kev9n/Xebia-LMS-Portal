package com.xebia.lms.course.config;

import com.xebia.lms.common.security.PermissionGuard;
import com.xebia.lms.common.security.TenantHeaderFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class ServiceConfig {
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(AbstractHttpConfigurer::disable)  // CORS is handled by API Gateway — disable here to avoid duplicate headers
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .addFilterBefore(new TenantHeaderFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean PermissionGuard permissionGuard() { return new PermissionGuard(); }
}
