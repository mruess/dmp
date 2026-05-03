package de.dmp.edmp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record DmpDokuDetailDto(
        UUID id,
        String pnr,
        String type,
        String fall,
        LocalDate serviceTmr,
        LocalDateTime originationDttm,
        String quartal,
        String lanr,
        String bsnr,
        String ik,
        String xml
) {}
