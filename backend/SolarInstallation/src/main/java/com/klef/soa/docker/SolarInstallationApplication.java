package com.klef.soa.docker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SolarInstallationApplication {

	public static void main(String[] args) {
		SpringApplication.run(SolarInstallationApplication.class, args);
		System.out.println("Solar Installation Project is running...");
	}

}
