package de.dmp.edmp.controller;

import de.dmp.edmp.dto.DmpDokuDetailDto;
import de.dmp.edmp.dto.DmpDokuListItemDto;
import de.dmp.edmp.dto.DmpDokuRequest;
import de.dmp.edmp.dto.DmpDokuResponse;
import de.dmp.edmp.service.DmpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dmp")
@CrossOrigin(origins = "*")
public class DmpController {

    private final DmpService service;

    public DmpController(DmpService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DmpDokuResponse> create(@RequestBody DmpDokuRequest request) {
        UUID id = service.create(request);
        return ResponseEntity.ok(new DmpDokuResponse(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DmpDokuDetailDto> getById(@PathVariable UUID id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DmpDokuResponse> update(@PathVariable UUID id, @RequestBody DmpDokuRequest request) {
        return service.update(id, request)
                .map(updatedId -> ResponseEntity.ok(new DmpDokuResponse(updatedId)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        return service.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<DmpDokuListItemDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
