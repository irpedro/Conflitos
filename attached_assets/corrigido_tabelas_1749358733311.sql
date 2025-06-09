CREATE TABLE conflito( 
    id VARCHAR(2) NOT NULL,
    total_mortos INT NOT NULL,
    total_feridos INT NOT NULL,
    causa VARCHAR(50) NOT NULL,  
    lugar VARCHAR(50) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE grupo_armado( 
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(30) NOT NULL,   
    numero_baixas INT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE divisao( 
    numero_divisao VARCHAR(2) NOT NULL,   
    id_grupo_armado VARCHAR(2) NOT NULL,
    numero_barcos INT NOT NULL,
    numero_tanques INT NOT NULL,
    numero_avioes INT NOT NULL,
    numero_homens INT NOT NULL,
    numero_baixas INT NOT NULL,

    PRIMARY KEY(numero_divisao),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE org_mediadora(
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(30) NOT NULL,
    tipo_org VARCHAR(20) NOT NULL,
    org_superior VARCHAR(10),
    numero_pessoas_sustentadas INT NOT NULL,
    tipo_ajuda VARCHAR(20) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(org_superior) REFERENCES org_mediadora(id)
);

CREATE TABLE lider_politico( 
    nome VARCHAR(30) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
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
    id VARCHAR(2) NOT NULL,
    faixa_hierarquica VARCHAR(30) NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
    numero_divisao VARCHAR(15) NOT NULL,

    PRIMARY KEY(id),

    FOREIGN KEY(nome_lider_politico, id_grupo_armado) REFERENCES lider_politico(nome, id_grupo_armado),
    FOREIGN KEY(numero_divisao) REFERENCES divisao(numero_divisao)
);

CREATE TABLE religiao( 
    id_conflito VARCHAR(2) NOT NULL,
    religiao_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE territorio( 
    id_conflito VARCHAR(2) NOT NULL,
    area_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE economia( 
    id_conflito VARCHAR(2) NOT NULL,
    materia_prima_disputada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE raca( 
    id_conflito VARCHAR(2) NOT NULL,
    etnia_afetada VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito),
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE paises_em_conflito( 
    id_conflito VARCHAR(2) NOT NULL,
    pais_envolvido VARCHAR(30) NOT NULL,
    
    PRIMARY KEY(id_conflito, pais_envolvido),  -- Chave composta permite múltiplos países por conflito
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE participacao_grupo_armado( 
    id_conflito VARCHAR(2) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
    data_entrada VARCHAR(10) NOT NULL,
    data_saida VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito, id_grupo_armado),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE participacao_org_mediadora( 
    id_conflito VARCHAR(2) NOT NULL,
    id_org_mediadora VARCHAR(2) NOT NULL,
    data_entrada VARCHAR(10) NOT NULL,
    data_saida VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito, id_org_mediadora),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_org_mediadora) REFERENCES org_mediadora(id)
);

CREATE TABLE dialogo( 
    id_org_mediadora VARCHAR(2) NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,

    PRIMARY KEY(id_org_mediadora, nome_lider_politico, id_grupo_armado),

    FOREIGN KEY(id_org_mediadora) REFERENCES org_mediadora(id),
    FOREIGN KEY (nome_lider_politico, id_grupo_armado) 
        REFERENCES lider_politico(nome, id_grupo_armado)
);

CREATE TABLE lideranca( 
    id_grupo_armado VARCHAR(2) NOT NULL,
    nome_lider_politico VARCHAR(30) NOT NULL,

    PRIMARY KEY(id_grupo_armado, nome_lider_politico),

    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id),
    FOREIGN KEY(nome_lider_politico, id_grupo_armado) REFERENCES lider_politico(nome, id_grupo_armado)
);

CREATE TABLE fornecimento(
    id_grupo_armado VARCHAR(2) NOT NULL,
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