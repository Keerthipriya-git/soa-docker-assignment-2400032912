
package com.klef.soa.docker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "solar_installation")
public class Solar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String siteName;

    @Column(nullable = false)
    private Double capacityKw;

    @Column(nullable = false)
    private String installationDate;

    @Column(nullable = false)
    private Boolean operational;

    public Solar() {
    }

    public Long getId() {
        return id;
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
