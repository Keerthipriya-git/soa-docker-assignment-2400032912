
package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.SolarDTO;
import com.klef.soa.docker.entity.Solar;
import com.klef.soa.docker.repository.SolarRepository;
import com.klef.soa.docker.service.SolarService;

@Service
public class SolarServiceImpl implements SolarService {

    @Autowired
    private SolarRepository repository;

    @Override
    public Solar addSolar(SolarDTO dto) {
        Solar solar = new Solar();

        solar.setSiteName(dto.getSiteName());
        solar.setCapacityKw(dto.getCapacityKw());
        solar.setInstallationDate(dto.getInstallationDate());
        solar.setOperational(dto.getOperational());

        return repository.save(solar);
    }

    @Override
    public Solar displaySolarById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Solar> displayAllSolars() {
        return repository.findAll();
    }

    @Override
    public Solar updateSolar(Long id, SolarDTO dto) {
        if (repository.existsById(id)) {
            Solar solar = repository.findById(id).get();

            solar.setSiteName(dto.getSiteName());
            solar.setCapacityKw(dto.getCapacityKw());
            solar.setInstallationDate(dto.getInstallationDate());
            solar.setOperational(dto.getOperational());

            return repository.save(solar);
        }

        return null;
    }

    @Override
    public String deleteSolar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Solar installation deleted successfully";
        }

        return "Solar installation not found with ID: " + id;
    }
}
