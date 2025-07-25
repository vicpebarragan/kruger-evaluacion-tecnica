package com.kruger.backend.config;


import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

	@Value("${springdoc.swagger.prod.dev}")
	private String devUri;
	@Value("${springdoc.swagger.email}")
	private String email;
	@Value("${springdoc.swagger.name}")
	private String name;
	@Value("${springdoc.swagger.pageurl}")
	private String pageurl;
	@Value("${springdoc.swagger.tittle}")
	private String tittle;
	@Value("${springdoc.swagger.description}")
	private String description;
	@Value("${springdoc.swagger.version}")
	private String version;

	@Bean
	OpenAPI myOpenAPI() {
		Server devServer = new Server();
		devServer.setUrl(devUri);
		devServer.setDescription("Servidor de desarrollo.");

		Contact contact = new Contact();
		contact.setEmail(email);
		contact.setName(name);
		contact.setUrl(pageurl);

		Info info = new Info().title(tittle).version(version).contact(contact).description(description);

		return new OpenAPI().info(info).servers(List.of(devServer))
				.addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components().addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
	}
	
	private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme().type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }
}

