package de.dmp.edmp.service;

import de.dmp.edmp.dto.DmpDokuDetailDto;
import de.dmp.edmp.dto.DmpDokuListItemDto;
import de.dmp.edmp.dto.DmpDokuRequest;
import de.dmp.edmp.entity.DmpDoku;
import de.dmp.edmp.repository.DmpDokuRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DmpService {

    private final DmpDokuRepository repository;

    public DmpService(DmpDokuRepository repository) {
        this.repository = repository;
    }

    public UUID create(DmpDokuRequest request) {
        DmpDoku entity = new DmpDoku();
        mapRequestToEntity(request, entity);
        return repository.save(entity).getId();
    }

    public Optional<DmpDokuDetailDto> findById(UUID id) {
        return repository.findById(id).map(this::toDetailDto);
    }

    public Optional<UUID> update(UUID id, DmpDokuRequest request) {
        return repository.findById(id).map(entity -> {
            mapRequestToEntity(request, entity);
            return repository.save(entity).getId();
        });
    }

    public boolean delete(UUID id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }

    public List<DmpDokuListItemDto> findAll() {
        return repository.findAll().stream().map(this::toListItemDto).toList();
    }

    private void mapRequestToEntity(DmpDokuRequest request, DmpDoku entity) {
        entity.setPnr(request.pnr());
        entity.setType(request.type());
        entity.setFall(request.fall());
        entity.setLanr(request.lanr());
        entity.setBsnr(request.bsnr());
        entity.setIk(request.ik());
        entity.setQuartal(request.quartal());

        if (request.serviceTmr() != null && !request.serviceTmr().isBlank()) {
            entity.setServiceTmr(LocalDate.parse(request.serviceTmr()));
        }
        if (request.originationDttm() != null && !request.originationDttm().isBlank()) {
            String dt = request.originationDttm();
            entity.setOriginationDttm(
                    dt.length() == 10 ? LocalDate.parse(dt).atStartOfDay() : LocalDateTime.parse(dt)
            );
        }

        if (request.xml() != null && !request.xml().isBlank()) {
            entity.setXml(new String(Base64.getDecoder().decode(request.xml())));
        }
    }

    private DmpDokuDetailDto toDetailDto(DmpDoku e) {
        String xmlB64 = e.getXml() != null ? Base64.getEncoder().encodeToString(e.getXml().getBytes()) : null;
        return new DmpDokuDetailDto(
                e.getId(), e.getPnr(), e.getType(), e.getFall(),
                e.getServiceTmr(), e.getOriginationDttm(), e.getQuartal(),
                e.getLanr(), e.getBsnr(), e.getIk(), xmlB64
        );
    }

    private DmpDokuListItemDto toListItemDto(DmpDoku e) {
        return new DmpDokuListItemDto(
                e.getId(), e.getPnr(), e.getType(), e.getFall(),
                e.getServiceTmr(), e.getOriginationDttm(), e.getQuartal(),
                e.getLanr(), e.getBsnr(), e.getIk()
        );
    }
}
