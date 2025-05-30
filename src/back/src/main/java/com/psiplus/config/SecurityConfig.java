package com.psiplus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // desabilita CSRF, importante para APIs
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // libera todas as rotas sem autenticação
                );
        return http.build();
    }
}
