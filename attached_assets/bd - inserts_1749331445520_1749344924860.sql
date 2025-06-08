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

INSERT INTO org_mediadora (id, nome, tipo_org, org_superior, numero_pessoas_sustendas, tipo_ajuda) VALUES
('1', 'ONU', 'internacional', NULL, 3000, 'diplomática'),
('2', 'Cruz Vermelha', 'internacional', NULL, 2500, 'médica'),
('3', 'OTAN', 'internacional', '1', 1500, 'presencial'),
('4', 'Médicos Sem Fronteiras', 'não gov.', NULL, 1200, 'médica'),
('5', 'OEA', 'internacional', '1', 1100, 'diplomática'),
('6', 'UNICEF', 'internacional', '1', 800, 'médica'),
('7', 'Comitê Norueguês', 'não gov.', NULL, 500, 'diplomática'),
('8', 'UE', 'governamental', NULL, 1000, 'presencial'),
('9', 'Amnistia Int.', 'não gov.', NULL, 650, 'diplomática'),
('10', 'OMS', 'internacional', '1', 2000, 'médica');

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

INSERT INTO traficantes (nome) VALUES
('Carlos Fuentes'),
('Yuri Ivanov'),
('Abdul Rashid'),
('Diego Ramirez'),
('Viktor Bolkov');

INSERT INTO armas (nome, capacidade_destrutiva) VALUES
('Barret M82', 95),
('M200 Intervent.', 93),
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
('HK416', 67),
('M249 SAW', 78),
('MG3', 82),
('PKM', 79),
('RPK', 76),
('M60', 77),
('Glock 17', 40),
('Beretta 92', 42),
('Desert Eagle', 65),
('Tokarev TT', 38),
('Colt M1911', 41),
('Tavor X95', 70),
('Steyr AUG', 73),
('XM2010', 88),
('CheyTac M200', 94),
('QBU-88', 66);

INSERT INTO divisao (numero_divisao, id_grupo_armado, numero_barcos, numero_tanques, numero_avioes, numero_homens, numero_baixas) VALUES
('1', '1', 10, 25, 12, 3000, 8000),
('2', '1', 8, 20, 8, 2500, 6000),
('3', '1', 12, 30, 15, 3500, 9000),
('4', '1', 7, 18, 10, 2000, 5000),
('5', '1', 9, 22, 11, 2700, 4000),

('6', '2', 6, 15, 7, 2200, 5000),
('7', '2', 4, 10, 5, 1500, 3000),
('8', '2', 5, 12, 6, 1600, 4000),
('9', '2', 3, 8, 3, 1100, 3000),
('10', '2', 2, 6, 2, 800, 3000),

('11', '3', 4, 10, 5, 1400, 3000),
('12', '3', 5, 12, 6, 1600, 4000),
('13', '3', 4, 9, 5, 1300, 3000),
('14', '3', 3, 7, 4, 1000, 2000),

('15', '4', 6, 15, 7, 2000, 4000),
('16', '4', 5, 12, 6, 1800, 3000),
('17', '4', 6, 14, 6, 1900, 4000),
('18', '4', 4, 10, 5, 1600, 4000),

('19', '5', 10, 25, 10, 3000, 8000),
('20', '5', 9, 22, 9, 2800, 7000),
('21', '5', 8, 20, 8, 2600, 6000),
('22', '5', 7, 18, 7, 2500, 6000),
('23', '5', 6, 15, 6, 2100, 2000),

('24', '6', 1, 2, 1, 300, 400),
('25', '6', 1, 3, 1, 400, 700),

('26', '7', 8, 20, 9, 2500, 7000),
('27', '7', 7, 18, 8, 2300, 6000),
('28', '7', 6, 15, 7, 2000, 5000),
('29', '7', 5, 12, 6, 1800, 4000),
('30', '7', 4, 10, 5, 1700, 3000),

('31', '8', 10, 25, 12, 3000, 8000),
('32', '8', 9, 23, 10, 2800, 8000),
('33', '8', 8, 20, 9, 2600, 7000),
('34', '8', 7, 18, 8, 2400, 6000),
('35', '8', 6, 15, 7, 2200, 5000),

('36', '9', 3, 8, 3, 900, 3000),
('37', '9', 2, 6, 2, 800, 3000),
('38', '9', 2, 5, 2, 700, 3000),

('39', '10', 7, 18, 8, 2500, 7000),
('40', '10', 6, 16, 7, 2300, 6000),
('41', '10', 5, 14, 6, 2100, 5000),
('42', '10', 5, 12, 5, 2000, 5000),
('43', '10', 4, 10, 5, 1800, 4000);

INSERT INTO chefe_militar (id, faixa_hierarquica, nome_lider_politico, numero_divisao) VALUES
('1', 'Major', 'Hibatullah A.', '1'),
('2', 'Coronel', 'Hibatullah A.', '1'),
('3', 'Tenente', 'Hibatullah A.', '1'),

('4', 'Major', 'Hibatullah A.', '2'),
('5', 'Tenente', 'Hibatullah A.', '2'),

('6', 'Capitão', 'Hibatullah A.', '3'),

('7', 'Coronel', 'Hibatullah A.', '4'),
('8', 'Major', 'Hibatullah A.', '4'),

('9', 'Capitão', 'Hibatullah A.', '5'),
('10', 'Tenente', 'Rodrigo Londo', '6'),
('11', 'Major', 'Rodrigo Londo', '6'),
('12', 'Coronel', 'Rodrigo Londo', '6'),

('13', 'Tenente', 'Rodrigo Londo', '7'),
('14', 'Major', 'Rodrigo Londo', '7'),

('15', 'Capitão', 'Rodrigo Londo', '8'),

('16', 'Coronel', 'Rodrigo Londo', '9'),
('17', 'Capitão', 'Rodrigo Londo', '9'),

('18', 'Major', 'Rodrigo Londo', '10'),

('19', 'Tenente', 'Ismail Haniy.', '11'),
('20', 'Coronel', 'Ismail Haniy.', '11'),

('21', 'Major', 'Ismail Haniy.', '12'),

('22', 'Major', 'Ismail Haniy.', '13'),
('23', 'Tenente', 'Ismail Haniy.', '13'),
('24', 'Coronel', 'Ismail Haniy.', '14'),

('25', 'Capitão', 'Hassan Nasral', '15'),
('26', 'Major', 'Hassan Nasral', '15'),

('27', 'Major', 'Hassan Nasral', '16'),
('28', 'Tenente', 'Hassan Nasral', '16'),

('29', 'Coronel', 'Hassan Nasral', '17'),

('30', 'Major', 'Hassan Nasral', '18'),
('31', 'Capitão', 'Abubakar Shek', '19'),
('32', 'Tenente', 'Abubakar Shek', '19'),
('33', 'Coronel', 'Abubakar Shek', '19'),

('34', 'Major', 'Abubakar Shek', '20'),
('35', 'Major', 'Abubakar Shek', '21'),

('36', 'Coronel', 'Abubakar Shek', '22'),
('37', 'Tenente', 'Abubakar Shek', '22'),

('38', 'Capitão', 'Abubakar Shek', '23'),

('39', 'Major', 'Arnaldo Oteg', '24'),
('40', 'Tenente', 'Arnaldo Oteg', '24'),

('41', 'Coronel', 'Arnaldo Oteg', '25'),

('42', 'Major', 'Ayman al-Zaw.', '26'),
('43', 'Coronel', 'Ayman al-Zaw.', '26'),
('44', 'Capitão', 'Ayman al-Zaw.', '26'),

('45', 'Tenente', 'Ayman al-Zaw.', '27'),
('46', 'Major', 'Ayman al-Zaw.', '28'),

('47', 'Major', 'Ayman al-Zaw.', '29'),
('48', 'Capitão', 'Ayman al-Zaw.', '30'),

('49', 'Coronel', 'Abu Bakr al-B', '31'),
('50', 'Capitão', 'Abu Bakr al-B', '31'),

('51', 'Major', 'Abu Bakr al-B', '32'),
('52', 'Major', 'Abu Bakr al-B', '33'),

('53', 'Coronel', 'Abu Bakr al-B', '34'),
('54', 'Tenente', 'Abu Bakr al-B', '35'),

('55', 'Capitão', 'Antonio Garc', '36'),
('56', 'Major', 'Antonio Garc', '36'),

('57', 'Coronel', 'Antonio Garc', '37'),

('58', 'Major', 'Antonio Garc', '38'),

('59', 'Coronel', 'Abdullah Öcal', '39'),
('60', 'Major', 'Abdullah Öcal', '39'),
('61', 'Tenente', 'Abdullah Öcal', '39'),

('62', 'Capitão', 'Abdullah Öcal', '40'),
('63', 'Major', 'Abdullah Öcal', '40'),

('64', 'Major', 'Abdullah Öcal', '41'),
('65', 'Coronel', 'Abdullah Öcal', '41'),

('66', 'Major', 'Abdullah Öcal', '42'),
('67', 'Tenente', 'Abdullah Öcal', '43');

INSERT INTO conflito (id, total_mortos, total_feridos, causa, lugar, nome) VALUES
('1', 65000, 90000, 'religioso', 'Iraque', 'Guerra sectária em Bagdá'),
('2', 78000, 105000, 'territorial', 'Sudao', 'Conflito de fronteiras em Darfur'),
('3', 41000, 72000, 'econômico', 'Nigéria', 'Disputa por petróleo no Delta Níger'),
('4', 88000, 130000, 'racial', 'Ruanda', 'Genocídio entre hutus e tutsis'),
('5', 50000, 65000, 'territorial', 'Israel', 'Conflito na Faixa de Gaza'),
('6', 47000, 60000, 'religioso', 'Síria', 'Guerra em Homs entre seitas rivais'),
('7', 54000, 67000, 'econômico', 'Venezuela', 'Crise humanitária por recursos'),
('8', 60000, 80000, 'racial', 'Myanmar', 'Expulsão dos rohingyas'),
('9', 70000, 90000, 'territorial', 'Ucrânia', 'Conflito armado na região de Donbas'),
('10', 55000, 75000, 'religioso', 'Índia', 'Conflito entre hindus e muçulmanos'),
('11', 48000, 70000, 'econômico', 'Congo', 'Disputa por minas de coltan'),
('12', 59000, 77000, 'territorial', 'Iémen', 'Guerra civil e territorial no Iémen'),
('13', 52000, 68000, 'racial', 'Egito', 'Conflitos étnicos em áreas urbanas'),
('14', 49000, 66000, 'religioso', 'Irã', 'Revoltas contra o regime teocrático'),
('15', 51000, 74000, 'econômico', 'Líbia', 'Disputa armada por reservas de petróleo');

INSERT INTO religiao (id_conflito, religiao_afetada) VALUES
('1', 'Sunita'),
('1', 'Xiita'),

('6', 'Sunita'),
('6', 'Alauíta'),

('10', 'Hindu'),
('10', 'Muçulmana'),

('14', 'Xiita'),
('14', 'Bahai'),

INSERT INTO territorio (id_conflito, area_afetada) VALUES
('2', 'Darfur'),
('2', 'Cartum'),
('2', 'Cordofão'),

('5', 'Gaza'),
('5', 'Cisjordânia'),
('5', 'Jerusalém'),

('9', 'Donbas'),
('9', 'Luhansk'),
('9', 'Donetsk'),
('9', 'Crimeia'),

('12', 'Sanaa'),
('12', 'Aden'),
('12', 'Marib');

INSERT INTO economia (id_conflito, materia_prima_disputada) VALUES
('3', 'Petróleo'),
('3', 'Gás'),
('3', 'Urânio'),

('7', 'Petróleo'),
('7', 'Ouro'),
('7', 'Gás'),

('11', 'Coltan'),
('11', 'Cobalto'),
('11', 'Diamante'),
('11', 'Estanho'),

('15', 'Petróleo'),
('15', 'Gás'),
('15', 'Ouro'),
('15', 'Ferro'),
('15', 'Lítio');

INSERT INTO raca (id_conflito, etnia_afetada) VALUES
('4', 'Hutu'),
('4', 'Tutsi'),

('8', 'Rohingya'),
('8', 'Bamar'),
('8', 'Shan'),

('13', 'Copta'),
('13', 'Árabe'),
('13', 'Núbio');

INSERT INTO paises_em_conflito (id_conflito, pais_envolvido) VALUES
('1', 'Iraque'),
('1', 'Afeganistão'),
('1', 'Estados Unidos'),
('1', 'Suíça'),

('2', 'Sudão'),
('2', 'Nigéria'),
('2', 'França'),

('3', 'Nigéria'),
('3', 'Colômbia'),
('3', 'Reino Unido'),

('4', 'Ruanda'),
('4', 'Estados Unidos'),
('4', 'Suíça'),

('5', 'Israel'),
('5', 'Palestina'),
('5', 'Estados Unidos'),
('5', 'Irã'),

('6', 'Síria'),
('6', 'Líbano'),
('6', 'França'),

('7', 'Venezuela'),
('7', 'Colômbia'),
('7', 'Estados Unidos'),

('8', 'Myanmar'),
('8', 'Bangladesh'),
('8', 'Noruega'),

('9', 'Ucrânia'),
('9', 'Rússia'),
('9', 'Bélgica'),
('9', 'Estados Unidos'),

('10', 'Índia'),
('10', 'Paquistão'),
('10', 'Estados Unidos'),

('11', 'República Democrática do Congo'),
('11', 'Uganda'),
('11', 'Suíça'),

('12', 'Iémen'),
('12', 'Arábia Saudita'),
('12', 'Irã'),
('12', 'Estados Unidos'),

('13', 'Egito'),
('13', 'Estados Unidos'),
('13', 'Reino Unido'),

('14', 'Irã'),
('14', 'Estados Unidos'),
('14', 'Reino Unido'),

('15', 'Líbia'),
('15', 'Turquia'),
('15', 'França'),
('15', 'Estados Unidos');

INSERT INTO participacao_grupo_armado (id_conflito, id_grupo_armado, data_entrada, data_saida) VALUES
('1', '1', '01-04-2003', '30-11-2008'),
('1', '7', '15-02-2004', '01-10-2009'),

('2', '5', '10-06-2005', '20-03-2010'),
('2', '2', '05-01-2006', '15-05-2011'),

('3', '5', '01-03-2008', '10-09-2014'),
('3', '9', '12-06-2009', '22-12-2015'),

('4', '1', '01-01-1993', '15-07-1994'),
('4', '6', '10-03-1993', '30-06-1994'),

('5', '3', '10-01-2012', '01-06-2020'),
('5', '4', '20-02-2012', '15-08-2020'),

('6', '4', '25-03-2011', '10-09-2019'),
('6', '8', '01-05-2013', '31-12-2020'),

('7', '2', '05-04-2017', '20-07-2021'),
('7', '9', '01-01-2018', '15-11-2021'),

('8', '5', '10-08-2016', '30-10-2020'),
('8', '10', '05-03-2017', '01-04-2021'),

('9', '8', '20-02-2014', '01-03-2022'),
('9', '7', '18-06-2015', '01-12-2021'),

('10', '3', '01-10-2001', '10-11-2006'),
('10', '10', '10-02-2002', '05-08-2007'),

('11', '5', '09-09-2009', '12-12-2014'),
('11', '9', '04-04-2010', '06-06-2015'),

('12', '1', '01-03-2015', '01-01-2020'),
('12', '8', '20-05-2016', '31-03-2021'),

('13', '6', '01-07-2018', '31-12-2021'),
('13', '9', '10-01-2019', '20-02-2022'),

('14', '4', '15-03-2006', '10-10-2011'),
('14', '10', '20-06-2007', '30-11-2012'),

('15', '2', '17-02-2011', '01-05-2016'),
('15', '10', '15-01-2012', '10-07-2017');

INSERT INTO participacao_org_mediadora (id_conflito, id_org_mediadora, data_entrada, data_saida) VALUES
('1', '1', '10-04-2004', '20-11-2008'),
('1', '2', '05-06-2005', '15-10-2009'),

('2', '4', '12-08-2006', '22-04-2010'),

('3', '6', '03-05-2010', '10-01-2015'),
('3', '9', '01-04-2011', '20-12-2015'),

('4', '2', '05-02-1993', '15-06-1994'),
('4', '10', '20-03-1993', '01-07-1994'),

('5', '1', '12-02-2013', '01-06-2020'),

('6', '4', '10-05-2012', '15-10-2019'),

('7', '5', '20-03-2018', '15-05-2021'),

('8', '7', '08-09-2017', '05-10-2020'),
('8', '2', '01-11-2018', '30-03-2021'),

('9', '3', '15-04-2015', '20-12-2021'),

('10', '1', '01-11-2001', '10-09-2006'),
('10', '5', '20-02-2002', '10-10-2007'),

('11', '2', '15-05-2011', '01-01-2015'),

('12', '1', '10-06-2016', '15-12-2020'),

('13', '9', '05-08-2019', '10-02-2022'),

('14', '5', '20-06-2007', '05-11-2012'),

('15', '3', '01-03-2012', '01-08-2016'),
('15', '7', '10-04-2013', '15-10-2017');

INSERT INTO dialogo (id_org_mediadora, nome_lider_politico) VALUES
('1', 'Hibatullah A.'),     
('2', 'Ayman al-Zaw.'),     
('4', 'Abubakar Shek'),     
('6', 'Antonio Garc'),     
('9', 'Rodrigo Londo'),   
('10', 'Arnaldo Oteg'), 
('5', 'Abdullah Öcal'),    
('7', 'Abubakar Shek'),     
('3', 'Abu Bakr al-B'),    
('9', 'Ismail Haniy.');    

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

INSERT INTO contrabandeia (nome_traficante, nome_arma, quantidade_possuida) VALUES
('Carlos Fuentes', 'AK-47', 56000),
('Abdul Rashid', 'AK-47', 72000),
('Yuri Ivanov', 'AK-47', 68000),

('Yuri Ivanov', 'M200 Intervent.', 51000),
('Viktor Bolkov', 'M200 Intervent.', 74000),
('Diego Ramirez', 'M200 Intervent.', 58000),

('Abdul Rashid', 'Barret M82', 97000),
('Carlos Fuentes', 'Barret M82', 61000),
('Viktor Bolkov', 'Barret M82', 84000),

('Diego Ramirez', 'FN FAL', 67000),
('Yuri Ivanov', 'FN FAL', 54000),
('Carlos Fuentes', 'FN FAL', 88000),

('Abdul Rashid', 'RPG-7', 75000),
('Viktor Bolkov', 'RPG-7', 96000),
('Carlos Fuentes', 'RPG-7', 80000),

('Yuri Ivanov', 'Uzi', 52000),
('Diego Ramirez', 'Uzi', 59000),
('Carlos Fuentes', 'Uzi', 60000),

('Yuri Ivanov', 'SCAR-H', 77000),
('Abdul Rashid', 'SCAR-H', 69000),
('Viktor Bolkov', 'SCAR-H', 88000),

('Carlos Fuentes', 'Dragunov SVD', 55000),
('Diego Ramirez', 'Dragunov SVD', 93000),
('Yuri Ivanov', 'Dragunov SVD', 70000),

('Abdul Rashid', 'M4A1', 98000),
('Viktor Bolkov', 'M4A1', 90000),
('Carlos Fuentes', 'M4A1', 85000),

('Diego Ramirez', 'G36', 72000),
('Yuri Ivanov', 'G36', 56000),
('Abdul Rashid', 'G36', 61000),

('Carlos Fuentes', 'Stinger', 63000),
('Viktor Bolkov', 'Stinger', 95000),
('Diego Ramirez', 'Stinger', 71000),

('Yuri Ivanov', 'MP5', 81000),
('Abdul Rashid', 'MP5', 75000),
('Carlos Fuentes', 'MP5', 79000),

('Viktor Bolkov', 'HK416', 87000),
('Diego Ramirez', 'HK416', 66000),
('Yuri Ivanov', 'HK416', 99000),

('Abdul Rashid', 'M249 SAW', 97000),
('Carlos Fuentes', 'M249 SAW', 86000),
('Viktor Bolkov', 'M249 SAW', 78000),

('Yuri Ivanov', 'MG3', 69000),
('Carlos Fuentes', 'MG3', 93000),
('Diego Ramirez', 'MG3', 72000),

('Viktor Bolkov', 'PKM', 89000),
('Abdul Rashid', 'PKM', 94000),
('Yuri Ivanov', 'PKM', 87000),

('Carlos Fuentes', 'RPK', 62000),
('Yuri Ivanov', 'RPK', 66000),
('Abdul Rashid', 'RPK', 71000),

('Diego Ramirez', 'M60', 99000),
('Carlos Fuentes', 'M60', 87000),
('Viktor Bolkov', 'M60', 74000),

('Yuri Ivanov', 'Glock 17', 88000),
('Abdul Rashid', 'Glock 17', 65000),
('Diego Ramirez', 'Glock 17', 61000),

('Carlos Fuentes', 'Beretta 92', 93000),
('Diego Ramirez', 'Beretta 92', 97000),
('Viktor Bolkov', 'Beretta 92', 75000),

('Yuri Ivanov', 'Desert Eagle', 72000),
('Carlos Fuentes', 'Desert Eagle', 85000),
('Abdul Rashid', 'Desert Eagle', 64000),

('Viktor Bolkov', 'Tokarev TT', 67000),
('Diego Ramirez', 'Tokarev TT', 59000),
('Abdul Rashid', 'Tokarev TT', 62000),

('Carlos Fuentes', 'Colt M1911', 91000),
('Yuri Ivanov', 'Colt M1911', 99000),
('Viktor Bolkov', 'Colt M1911', 86000),

('Abdul Rashid', 'Tavor X95', 93000),
('Yuri Ivanov', 'Tavor X95', 91000),
('Carlos Fuentes', 'Tavor X95', 89000),

('Viktor Bolkov', 'Steyr AUG', 71000),
('Diego Ramirez', 'Steyr AUG', 65000),
('Carlos Fuentes', 'Steyr AUG', 76000),

('Abdul Rashid', 'XM2010', 84000),
('Diego Ramirez', 'XM2010', 93000),
('Yuri Ivanov', 'XM2010', 79000),

('Viktor Bolkov', 'CheyTac M200', 95000),
('Carlos Fuentes', 'CheyTac M200', 96000),
('Yuri Ivanov', 'CheyTac M200', 91000),

('Abdul Rashid', 'QBU-88', 83000),
('Diego Ramirez', 'QBU-88', 71000),
('Viktor Bolkov', 'QBU-88', 79000),

('Carlos Fuentes', 'M16', 88000),
('Yuri Ivanov', 'M16', 99000),
('Abdul Rashid', 'M16', 95000),

('Viktor Bolkov', 'Galil ACE', 91000),
('Diego Ramirez', 'Galil ACE', 76000),
('Carlos Fuentes', 'Galil ACE', 85000);

INSERT INTO fornecimento (id_grupo_armado, nome_traficante, nome_arma, quantidade_fornecida) VALUES
('1', 'Carlos Fuentes', 'AK-47', 2000),
('2', 'Carlos Fuentes', 'FN FAL', 1800),
('3', 'Carlos Fuentes', 'RPG-7', 2200),
('4', 'Carlos Fuentes', 'M4A1', 2500),
('5', 'Carlos Fuentes', 'MP5', 1500),
('6', 'Carlos Fuentes', 'Colt M1911', 1700),

('1', 'Yuri Ivanov', 'M200 Intervent.', 2600),
('3', 'Yuri Ivanov', 'SCAR-H', 2400),
('5', 'Yuri Ivanov', 'G36', 1800),
('7', 'Yuri Ivanov', 'Barret M82', 2000),
('9', 'Yuri Ivanov', 'HK416', 2900),

('2', 'Abdul Rashid', 'M249 SAW', 2700),
('4', 'Abdul Rashid', 'PKM', 2200),
('6', 'Abdul Rashid', 'Stinger', 2500),
('7', 'Abdul Rashid', 'AK-47', 2000),
('9', 'Abdul Rashid', 'Glock 17', 2300),

('2', 'Diego Ramirez', 'Uzi', 1700),
('5', 'Diego Ramirez', 'Desert Eagle', 2100),
('7', 'Diego Ramirez', 'HK416', 2800),
('8', 'Diego Ramirez', 'Tokarev TT', 1400),
('10', 'Diego Ramirez', 'Steyr AUG', 1600),

('3', 'Viktor Bolkov', 'CheyTac M200', 1900),
('4', 'Viktor Bolkov', 'XM2010', 2000),
('6', 'Viktor Bolkov', 'Beretta 92', 1500),
('8', 'Viktor Bolkov', 'RPG-7', 2600),
('10', 'Viktor Bolkov', 'Galil ACE', 2300);
