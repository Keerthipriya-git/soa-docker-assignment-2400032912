
package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.SolarDTO;
import com.klef.soa.docker.entity.Solar;

public interface SolarService {

    Solar addSolar(SolarDTO dto);

    Solar displaySolarById(Long id);

    List<Solar> displayAllSolars();

    Solar updateSolar(Long id, SolarDTO dto);

    String deleteSolar(Long id);
}
