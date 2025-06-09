-- Script SQL corrigido para banco de dados de conflitos

-- Tabela principal de conflitos
CREATE TABLE conflito( 
    id VARCHAR(2) NOT NULL,
    total_mortos INT NOT NULL,
    total_feridos INT NOT NULL,
    causa VARCHAR(30) NOT NULL,  
    lugar VARCHAR(30) NOT NULL,
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

-- Tabela de grupos armados
CREATE TABLE grupo_armado( 
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(15) NOT NULL,   
    numero_baixas INT NOT NULL,
    PRIMARY KEY(id)
);

-- Tabela de divisões militares
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

-- Tabela de organizações mediadoras
CREATE TABLE org_mediadora( 
    id VARCHAR(2) NOT NULL,
    nome VARCHAR(15) NOT NULL,   
    tipo_org VARCHAR(10) NOT NULL,  
    org_superior VARCHAR(10),
    numero_pessoas_sustentadas INT NOT NULL,
    tipo_ajuda VARCHAR(10) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(org_superior) REFERENCES org_mediadora(id)
);

-- Tabela de líderes políticos (CORRIGIDA)
CREATE TABLE lider_politico( 
    nome VARCHAR(15) NOT NULL,
    id_grupo_armado VARCHAR(2) NOT NULL,
    apoio VARCHAR(30) NOT NULL,
    PRIMARY KEY(nome), -- Mudança: apenas o nome como chave primária
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

-- Tabela de traficantes
CREATE TABLE traficantes( 
    nome VARCHAR(15) NOT NULL,
    PRIMARY KEY(nome)
);

-- Tabela de armas
CREATE TABLE armas( 
    nome VARCHAR(15) NOT NULL,
    capacidade_destrutiva INT NOT NULL,
    PRIMARY KEY(nome)
);

-- Tabela de chefes militares (CORRIGIDA)
CREATE TABLE chefe_militar( 
    id VARCHAR(2) NOT NULL,
    faixa_hierarquica VARCHAR(15) NOT NULL,
    nome_lider_politico VARCHAR(15) NOT NULL,
    numero_divisao VARCHAR(2) NOT NULL, -- Corrigido: VARCHAR(2) em vez de VARCHAR(15)
    PRIMARY KEY(id),
    FOREIGN KEY(nome_lider_politico) REFERENCES lider_politico(nome),
    FOREIGN KEY(numero_divisao) REFERENCES divisao(numero_divisao)
);

-- Tabelas de especializações de conflitos
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

-- Tabela de países em conflito
CREATE TABLE paises_em_conflito( 
    id_conflito VARCHAR(2) NOT NULL,
    pais_envolvido VARCHAR(30) NOT NULL,
    PRIMARY KEY(id_conflito, pais_envolvido), -- Permitir múltiplos países por conflito
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

-- Tabelas de participação
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

-- Tabela de diálogos (CORRIGIDA)
CREATE TABLE dialogo( 
    id_org_mediadora VARCHAR(2) NOT NULL,
    nome_lider_politico VARCHAR(15) NOT NULL,
    PRIMARY KEY(id_org_mediadora, nome_lider_politico),
    FOREIGN KEY(id_org_mediadora) REFERENCES org_mediadora(id),
    FOREIGN KEY(nome_lider_politico) REFERENCES lider_politico(nome)
);

-- Tabela de liderança (REMOVIDA - redundante com grupo_armado)
-- A relação já está definida em lider_politico

-- Tabelas de armamentos
CREATE TABLE fornecimento(
    id_grupo_armado VARCHAR(2) NOT NULL,
    nome_traficante VARCHAR(15) NOT NULL,
    nome_arma VARCHAR(15) NOT NULL,
    quantidade_fornecida INT NOT NULL,
    PRIMARY KEY(id_grupo_armado, nome_traficante, nome_arma),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome),
    FOREIGN KEY(nome_arma) REFERENCES armas(nome)
);

CREATE TABLE contrabandeia(
    nome_traficante VARCHAR(15) NOT NULL,
    nome_arma VARCHAR(15) NOT NULL,
    quantidade_possuida INT NOT NULL,
    PRIMARY KEY(nome_arma, nome_traficante),
    FOREIGN KEY(nome_arma) REFERENCES armas(nome),
    FOREIGN KEY(nome_traficante) REFERENCES traficantes(nome)
);