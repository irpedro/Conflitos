CREATE TABLE conflito( 
    id INT NOT NULL,
    total_mortos INT NOT NULL,
    total_feridos INT NOT NULL,
    causa VARCHAR(50) NOT NULL,  
    lugar VARCHAR(50) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE grupo_armado( 
    id INT NOT NULL,
    nome VARCHAR(30) NOT NULL,   
    numero_baixas INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE divisao( 
    numero_divisao INT NOT NULL,   
    id_grupo_armado INT NOT NULL,
    numero_barcos INT NOT NULL,
    numero_tanques INT NOT NULL,
    numero_avioes INT NOT NULL,
    numero_homens INT NOT NULL,
    numero_baixas INT NOT NULL,

    PRIMARY KEY(numero_divisao),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE org_mediadora(
    id INT NOT NULL,
    nome VARCHAR(30) NOT NULL,
    tipo_org VARCHAR(20) NOT NULL,
    org_superior INT,
    numero_pessoas_sustentadas INT NOT NULL,
    tipo_ajuda VARCHAR(20) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(org_superior) REFERENCES org_mediadora(id)
);

CREATE TABLE lider_politico( 
    nome VARCHAR(30) NOT NULL,
    id_grupo_armado INT NOT NULL,
    apoio VARCHAR(50) NOT NULL,

    PRIMARY KEY(nome, id_grupo_armado),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE traficantes( 
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY(nome)
);

CREATE TABLE armas( 
    nome VARCHAR(30) NOT NULL,
    capacidade_destrutiva INT NOT NULL,
    PRIMARY KEY(nome)
);

CREATE TABLE chefe_militar( 
    id INT NOT NULL,
    faixa_hierarquica VARCHAR(30) NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,
    id_grupo_armado INT NOT NULL,
    numero_divisao INT NOT NULL,  -- Changed from VARCHAR(15) to INT

    PRIMARY KEY(id),

    FOREIGN KEY(nome_lider_politico, id_grupo_armado) REFERENCES lider_politico(nome, id_grupo_armado),
    FOREIGN KEY(numero_divisao) REFERENCES divisao(numero_divisao)
);

CREATE TABLE religiao( 
    id_conflito INT NOT NULL,
    religiao_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE territorio( 
    id_conflito INT NOT NULL,
    area_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE economia( 
    id_conflito INT NOT NULL,
    materia_prima_disputada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE raca( 
    id_conflito INT NOT NULL,
    etnia_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE paises_em_conflito( 
    id_conflito INT NOT NULL,
    pais_envolvido VARCHAR(30) NOT NULL,
    
    PRIMARY KEY(id_conflito, pais_envolvido),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE participacao_grupo_armado( 
    id_conflito INT NOT NULL,
    id_grupo_armado INT NOT NULL,
    data_entrada DATE NOT NULL,  -- Changed from VARCHAR(10) to DATE
    data_saida DATE NOT NULL,    -- Changed from VARCHAR(10) to DATE

    PRIMARY KEY(id_conflito, id_grupo_armado),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE participacao_org_mediadora( 
    id_conflito INT NOT NULL,
    id_org_mediadora INT NOT NULL,
    data_entrada DATE NOT NULL,  -- Changed from VARCHAR(10) to DATE
    data_saida DATE NOT NULL,    -- Changed from VARCHAR(10) to DATE

    PRIMARY KEY(id_conflito, id_org_mediadora),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_org_mediadora) REFERENCES org_mediadora(id)
);

CREATE TABLE dialogo( 
    id_org_mediadora INT NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,
    id_grupo_armado INT NOT NULL,

    PRIMARY KEY(id_org_mediadora, nome_lider_politico, id_grupo_armado),

    FOREIGN KEY(id_org_mediadora) REFERENCES org_mediadora(id),
    FOREIGN KEY (nome_lider_politico, id_grupo_armado) 
        REFERENCES lider_politico(nome, id_grupo_armado)
);

CREATE TABLE lideranca( 
    id_grupo_armado INT NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,

    PRIMARY KEY(id_grupo_armado, nome_lider_politico),

    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id),
    FOREIGN KEY(nome_lider_politico, id_grupo_armado) REFERENCES lider_politico(nome, id_grupo_armado)
);

CREATE TABLE fornecimento(
    id_grupo_armado INT NOT NULL,
    nome_traficante VARCHAR(30) NOT NULL,
    nome_arma VARCHAR(30) NOT NULL,
    quantidade_fornecida INT NOT NULL,

    PRIMARY KEY(id_grupo_armado, nome_traficante, nome_arma),

    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome),
    FOREIGN KEY(nome_arma) REFERENCES armas(nome)
);

CREATE TABLE contrabandeia(
    nome_traficante VARCHAR(30) NOT NULL,
    nome_arma VARCHAR(30) NOT NULL,
    quantidade_possuida INT NOT NULL,

    PRIMARY KEY(nome_arma, nome_traficante),

    FOREIGN KEY(nome_arma) REFERENCES armas(nome),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome)
);