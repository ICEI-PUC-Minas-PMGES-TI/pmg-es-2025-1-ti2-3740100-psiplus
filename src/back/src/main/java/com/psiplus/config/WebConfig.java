//Faz a comunicacao do back com o front controlando as permissoes de acesso
package com.psiplus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5181")  // Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  
                .allowedHeaders("*")  
                .allowCredentials(true);  
    }
}

