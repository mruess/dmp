CREATE TABLE dmpdoku (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr              VARCHAR(20),
    type             VARCHAR(10),
    fall             VARCHAR(50),
    service_tmr      DATE,
    origination_dttm TIMESTAMP,
    quartal          VARCHAR(10),
    lanr             VARCHAR(9),
    bsnr             VARCHAR(9),
    ik               VARCHAR(9),
    xml              TEXT        NOT NULL
);
