package de.dmp.edmp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dmpdoku")
@Getter
@Setter
public class DmpDoku {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "pnr")
    private String pnr;

    @Column(name = "type")
    private String type;

    @Column(name = "fall")
    private String fall;

    @Column(name = "service_tmr")
    private LocalDate serviceTmr;

    @Column(name = "origination_dttm")
    private LocalDateTime originationDttm;

    @Column(name = "quartal")
    private String quartal;

    @Column(name = "lanr")
    private String lanr;

    @Column(name = "bsnr")
    private String bsnr;

    @Column(name = "ik")
    private String ik;

    @Column(name = "xml", columnDefinition = "TEXT")
    private String xml;
}
