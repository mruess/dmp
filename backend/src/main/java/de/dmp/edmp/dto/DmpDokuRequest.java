package de.dmp.edmp.dto;

public record DmpDokuRequest(
        String pnr,
        String type,
        String fall,
        String serviceTmr,
        String originationDttm,
        String quartal,
        String lanr,
        String bsnr,
        String ik,
        String xml
) {}
