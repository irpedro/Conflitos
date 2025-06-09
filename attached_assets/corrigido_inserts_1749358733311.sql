-- Inserção de Conflitos
INSERT INTO conflito (id, total_mortos, total_feridos, causa, lugar, nome) VALUES
('1', 65000, 90000, 'religioso', 'Iraque', 'Guerra sectária em Bagdá'),
('2', 78000, 105000, 'territoria', 'Sudão', 'Conflito de fronteiras em Darfur'),
('3', 41000, 72000, 'econômico', 'Nigéria', 'Disputa por petróleo no Delta Níger'),
('4', 88000, 130000, 'racial', 'Ruanda', 'Genocídio entre hutus e tutsis'),
('5', 50000, 65000, 'territoria', 'Israel', 'Conflito na Faixa de Gaza'),
('6', 47000, 60000, 'religioso', 'Síria', 'Guerra em Homs entre seitas rivais'),
('7', 54000, 67000, 'econômico', 'Venezuela', 'Crise humanitária por recursos'),
('8', 60000, 80000, 'racial', 'Myanmar', 'Expulsão dos rohingyas'),
('9', 70000, 90000, 'territoria', 'Ucrânia', 'Conflito armado na região de Donbas'),
('10', 55000, 75000, 'religioso', 'Índia', 'Conflito entre hindus e muçulmanos');

-- Inserção de Grupos Armados
INSERT INTO grupo_armado (id, nome, numero_baixas) VALUES
('1', 'Taliban', 32000),
('2', 'FARC', 18000),
('3', 'Hamas', 12000),
('4', 'Hezbollah', 15000),
('5', 'Boko Haram', 29000),
('6', 'ETA', 1100),
('7', 'Al Qaeda', 25000),
('8', 'ISIS', 34000),
('9', 'ELN', 9000),
('10', 'PKK', 27000);

-- Inserção de Divisões
INSERT INTO divisao (numero_divisao, id_grupo_armado, numero_barcos, numero_tanques, numero_avioes, numero_homens, numero_baixas) VALUES
('1', '1', 5, 12, 3, 2500, 850),
('2', '1', 2, 8, 1, 1800, 600),
('3', '2', 8, 15, 4, 3200, 1200),
('4', '3', 3, 6, 2, 1500, 400),
('5', '4', 6, 10, 5, 2800, 950),
('6', '5', 4, 18, 6, 4500, 1800),
('7', '6', 1, 2, 0, 800, 150),
('8', '7', 7, 20, 8, 5000, 2200),
('9', '8', 9, 25, 12, 6000, 2800),
('10', '9', 3, 7, 2, 1200, 350);

-- Inserção de Organizações Mediadoras
INSERT INTO org_mediadora (id, nome, tipo_org, org_superior, numero_pessoas_sustentadas, tipo_ajuda) VALUES
('1', 'ONU', 'internacio', NULL, 3000, 'diplomátic'),
('2', 'Cruz Verme', 'internacio', NULL, 2500, 'médica'),
('3', 'OTAN', 'internacio', '1', 1500, 'presencial'),
('4', 'Médicos SF', 'não gov.', NULL, 1200, 'médica'),
('5', 'OEA', 'internacio', '1', 1100, 'diplomátic'),
('6', 'UNICEF', 'internacio', '1', 800, 'médica'),
('7', 'Comitê Nor', 'não gov.', NULL, 500, 'diplomátic'),
('8', 'UE', 'governamen', NULL, 1000, 'presencial'),
('9', 'Amnistia I', 'não gov.', NULL, 650, 'diplomátic'),
('10', 'OMS', 'internacio', '1', 2000, 'médica');

-- Inserção de Líderes Políticos
INSERT INTO lider_politico (nome, id_grupo_armado, apoio) VALUES
('Hibatullah A.', '1', 'Apoio tribal e religioso'),
('Rodrigo Londo', '2', 'Acordos regionais e populares'),
('Ismail Haniy.', '3', 'Apoio do Hamas e de aliados'),
('Hassan Nasral', '4', 'Apoio iraniano e político'),
('Abubakar Shek', '5', 'Grupos extremistas locais'),
('Arnaldo Oteg', '6', 'Base nacionalista basca'),
('Ayman al-Zaw.', '7', 'Apoio jihadista internacional'),
('Abu Bakr al-B', '8', 'Redes extremistas no Iraque'),
('Antonio Garc', '9', 'Campesinato colombiano'),
('Abdullah Öcal', '10', 'Curdos na Turquia e Síria');

-- Inserção de Traficantes
INSERT INTO traficantes (nome) VALUES
('Carlos Fuentes'),
('Yuri Ivanov'),
('Abdul Rashid'),
('Diego Ramirez'),
('Viktor Bolkov'),
('Chen Wei'),
('Ahmed Hassan'),
('Marco Silva'),
('Ivan Petrov'),
('Tony Martinez');

-- Inserção de Armas
INSERT INTO armas (nome, capacidade_destrutiva) VALUES
('Barret M82', 95),
('M200 Inter.', 93),
('AK-47', 75),
('M16', 70),
('G36', 68),
('SCAR-H', 80),
('FN FAL', 72),
('Galil ACE', 74),
('Dragunov SVD', 85),
('M4A1', 69),
('RPG-7', 90),
('Stinger', 91),
('Uzi', 60),
('MP5', 63),
('HK416', 67);

-- Inserção de Conflitos Especializados
INSERT INTO religiao (id_conflito, religiao_afetada) VALUES
('1', 'islâmica'),
('6', 'cristã'),
('10', 'hindu');

INSERT INTO territorio (id_conflito, area_afetada) VALUES
('2', 'fronteira'),
('5', 'gaza'),
('9', 'donbas');

INSERT INTO economia (id_conflito, materia_prima_disputada) VALUES
('3', 'petróleo'),
('7', 'ouro');

INSERT INTO raca (id_conflito, etnia_afetada) VALUES
('4', 'tutsi'),
('8', 'rohingya');

-- Inserção de Países em Conflito
INSERT INTO paises_em_conflito (id_conflito, pais_envolvido) VALUES
('1', 'Iraque'),
('2', 'Sudão'),
('3', 'Nigéria'),
('4', 'Ruanda'),
('5', 'Israel'),
('5', 'Palestina'),    -- Mesmo conflito que Israel
('6', 'Síria'),
('7', 'Venezuela'),
('8', 'Myanmar'),
('9', 'Ucrânia'),
('9', 'Rússia'),       -- Mesmo conflito que Ucrânia
('10', 'Índia');

-- Inserção de Participação de Grupos Armados
INSERT INTO participacao_grupo_armado (id_conflito, id_grupo_armado, data_entrada, data_saida) VALUES
('1', '1', '2020-01-15', '2021-12-30'),
('2', '5', '2019-03-20', '2020-11-25'),
('3', '2', '2018-07-12', '2019-09-18'),
('4', '8', '2017-04-08', '2018-12-20'),
('5', '3', '2021-01-10', '2022-08-25'),
('6', '4', '2020-09-12', '2021-11-30'),
('7', '9', '2019-11-05', '2021-03-20'),
('8', '7', '2018-12-15', '2020-02-28'),
('9', '10', '2022-01-20', '2023-06-15'),
('10', '6', '2021-05-10', '2022-07-10');

-- Inserção de Participação de Organizações Mediadoras
INSERT INTO participacao_org_mediadora (id_conflito, id_org_mediadora, data_entrada, data_saida) VALUES
('1', '1', '2020-01-15', '2021-06-30'),
('1', '2', '2020-02-10', '2021-08-15'),
('2', '1', '2019-03-20', '2020-12-10'),
('2', '3', '2019-05-15', '2020-11-25'),
('3', '2', '2018-07-12', '2019-09-18'),
('4', '1', '2017-04-08', '2018-12-20'),
('4', '2', '2017-06-15', '2018-10-30'),
('4', '6', '2017-08-20', '2018-11-15'),
('5', '1', '2021-01-10', '2022-05-25'),
('5', '3', '2021-03-15', '2022-07-10'),
('6', '2', '2020-09-12', '2021-11-30'),
('7', '1', '2019-11-05', '2021-03-20'),
('8', '6', '2018-12-15', '2020-02-28'),
('9', '3', '2022-01-20', '2023-06-15'),
('10', '1', '2021-05-10', '2022-08-25');

-- Inserção de Diálogos
INSERT INTO dialogo (id_org_mediadora, nome_lider_politico, id_grupo_armado) VALUES
('1', 'Hibatullah A.', '1'),
('1', 'Rodrigo Londo', '2'),
('2', 'Ismail Haniy.', '3'),
('3', 'Hassan Nasral', '4'),
('1', 'Abubakar Shek', '5');

-- Inserção de Liderança
INSERT INTO lideranca (id_grupo_armado, nome_lider_politico) VALUES
('1', 'Hibatullah A.'),
('2', 'Rodrigo Londo'),
('3', 'Ismail Haniy.'),
('4', 'Hassan Nasral'),
('5', 'Abubakar Shek'),
('6', 'Arnaldo Oteg'),
('7', 'Ayman al-Zaw.'),
('8', 'Abu Bakr al-B'),
('9', 'Antonio Garc'),
('10', 'Abdullah Öcal');

-- CORRIGIDO: Inserção de Chefes Militares (com id_grupo_armado necessário)
INSERT INTO chefe_militar (id, faixa_hierarquica, nome_lider_politico, id_grupo_armado, numero_divisao) VALUES
('1', 'Major', 'Hibatullah A.', '1', '1'),
('2', 'Coronel', 'Hibatullah A.', '1', '1'),
('3', 'Tenente', 'Hibatullah A.', '1', '2'),
('4', 'Major', 'Rodrigo Londo', '2', '3'),
('5', 'Coronel', 'Ismail Haniy.', '3', '4'),
('6', 'Tenente', 'Hassan Nasral', '4', '5'),
('7', 'Capitão', 'Abubakar Shek', '5', '6'),
('8', 'Major', 'Arnaldo Oteg', '6', '7'),
('9', 'Coronel', 'Ayman al-Zaw.', '7', '8'),
('10', 'Tenente', 'Abu Bakr al-B', '8', '9'),
('11', 'Major', 'Antonio Garc', '9', '10'),
('12', 'Capitão', 'Abdullah Öcal', '10', '10');

-- Inserção de Fornecimento de Armas
INSERT INTO fornecimento (id_grupo_armado, nome_traficante, nome_arma, quantidade_fornecida) VALUES
('1', 'Carlos Fuentes', 'AK-47', 150),
('1', 'Yuri Ivanov', 'RPG-7', 25),
('2', 'Abdul Rashid', 'M16', 80),
('3', 'Diego Ramirez', 'Barret M82', 10),
('4', 'Viktor Bolkov', 'SCAR-H', 60),
('5', 'Carlos Fuentes', 'M200 Inter.', 15),
('6', 'Chen Wei', 'Uzi', 45),
('7', 'Ahmed Hassan', 'Dragunov SVD', 30),
('8', 'Marco Silva', 'HK416', 95),
('9', 'Ivan Petrov', 'FN FAL', 70);

-- Inserção de Contrabando
INSERT INTO contrabandeia (nome_traficante, nome_arma, quantidade_possuida) VALUES
('Carlos Fuentes', 'AK-47', 500),
('Carlos Fuentes', 'M200 Inter.', 50),
('Yuri Ivanov', 'RPG-7', 120),
('Abdul Rashid', 'M16', 300),
('Diego Ramirez', 'Barret M82', 75),
('Viktor Bolkov', 'SCAR-H', 200),
('Chen Wei', 'Uzi', 180),
('Ahmed Hassan', 'Dragunov SVD', 90),
('Marco Silva', 'HK416', 250),
('Ivan Petrov', 'FN FAL', 160);