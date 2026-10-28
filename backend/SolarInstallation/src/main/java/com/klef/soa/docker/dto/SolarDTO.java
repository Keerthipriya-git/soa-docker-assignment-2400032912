
package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class SolarDTO {

    @NotBlank(message = "Site name is required")
    @Size(max = 120, message = "Site name cannot exceed 120 characters")
    private String siteName;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than zero")
    private Double capacityKw;

    @NotBlank(message = "Installation date is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$",
             message = "Date format must be YYYY-MM-DD")
    private String installationDate;

    @NotNull(message = "Operational status is required")
    private Boolean operational;

    public SolarDTO() {
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public Double getCapacityKw() {
        return capacityKw;
    }

    public void setCapacityKw(Double capacityKw) {
        this.capacityKw = capacityKw;
    }

    public String getInstallationDate() {
        return installationDate;
    }

    public void setInstallationDate(String installationDate) {
        this.installationDate = installationDate;
    }

    public Boolean getOperational() {
        return operational;
    }

    public void setOperational(Boolean operational) {
        this.operational = operational;
    }
}
