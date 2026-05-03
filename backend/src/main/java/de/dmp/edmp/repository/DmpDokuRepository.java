package de.dmp.edmp.repository;

import de.dmp.edmp.entity.DmpDoku;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface DmpDokuRepository extends JpaRepository<DmpDoku, UUID>, JpaSpecificationExecutor<DmpDoku> {
}
