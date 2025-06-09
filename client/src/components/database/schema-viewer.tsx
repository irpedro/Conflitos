import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Table, Eye, ArrowLeft, FileText, Database, Zap } from "lucide-react";
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Arquivos SQL anexados
const sqlFiles = {
  tabelas: `CREATE TABLE conflito( 
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
    org_superior VARCHAR(10),
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
    numero_divisao VARCHAR(15) NOT NULL,

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
    
    PRIMARY KEY(id_conflito, pais_envolvido),  -- Chave composta permite múltiplos países por conflito
    FOREIGN KEY(id_conflito) REFERENCES conflito(id)
);

CREATE TABLE participacao_grupo_armado( 
    id_conflito INT NOT NULL,
    id_grupo_armado INT NOT NULL,
    data_entrada VARCHAR(10) NOT NULL,
    data_saida VARCHAR(10) NOT NULL,

    PRIMARY KEY(id_conflito, id_grupo_armado),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE participacao_org_mediadora( 
    id_conflito INT NOT NULL,
    id_org_mediadora INT NOT NULL,
    data_entrada VARCHAR(10) NOT NULL,
    data_saida VARCHAR(10) NOT NULL,

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
);`,

  inserts: `-- Inserção de Conflitos
INSERT INTO conflito (id, total_mortos, total_feridos, causa, lugar, nome) VALUES
(1, 65000, 90000, 'religioso', 'Iraque', 'Guerra sectária em Bagdá'),
(2, 78000, 105000, 'territoria', 'Sudão', 'Conflito de fronteiras em Darfur'),
(3, 41000, 72000, 'econômico', 'Nigéria', 'Disputa por petróleo no Delta Níger'),
(4, 88000, 130000, 'racial', 'Ruanda', 'Genocídio entre hutus e tutsis'),
(5, 50000, 65000, 'territoria', 'Israel', 'Conflito na Faixa de Gaza'),
(6, 47000, 60000, 'religioso', 'Síria', 'Guerra em Homs entre seitas rivais'),
(7, 54000, 67000, 'econômico', 'Venezuela', 'Crise humanitária por recursos'),
(8, 60000, 80000, 'racial', 'Myanmar', 'Expulsão dos rohingyas'),
(9, 70000, 90000, 'territoria', 'Ucrânia', 'Conflito armado na região de Donbas'),
(10, 55000, 75000, 'religioso', 'Índia', 'Conflito entre hindus e muçulmanos');

-- Inserção de Grupos Armados
INSERT INTO grupo_armado (id, nome, numero_baixas) VALUES
(1, 'Taliban', 32000),
(2, 'FARC', 18000),
(3, 'Hamas', 12000),
(4, 'Hezbollah', 15000),
(5, 'Boko Haram', 29000),
(6, 'ETA', 1100),
(7, 'Al Qaeda', 25000),
(8, 'ISIS', 34000),
(9, 'ELN', 9000),
(10, 'PKK', 27000);

-- Inserção de Divisões
INSERT INTO divisao (numero_divisao, id_grupo_armado, numero_barcos, numero_tanques, numero_avioes, numero_homens, numero_baixas) VALUES
(1, 1, 5, 12, 3, 2500, 850),
(2, 1, 2, 8, 1, 1800, 600),
(3, 2, 8, 15, 4, 3200, 1200),
(4, 3, 3, 6, 2, 1500, 400),
(5, 4, 6, 10, 5, 2800, 950),
(6, 5, 4, 18, 6, 4500, 1800),
(7, 6, 1, 2, 0, 800, 150),
(8, 7, 7, 20, 8, 5000, 2200),
(9, 8, 9, 25, 12, 6000, 2800),
(10, 9, 3, 7, 2, 1200, 350);

-- Inserção de Organizações Mediadoras
INSERT INTO org_mediadora (id, nome, tipo_org, org_superior, numero_pessoas_sustentadas, tipo_ajuda) VALUES
(1, 'ONU', 'internacio', NULL, 3000, 'diplomátic'),
(2, 'Cruz Verme', 'internacio', NULL, 2500, 'médica'),
(3, 'OTAN', 'internacio', 1, 1500, 'presencial'),
(4, 'Médicos SF', 'não gov.', NULL, 1200, 'médica'),
(5, 'OEA', 'internacio', 1, 1100, 'diplomátic'),
(6, 'UNICEF', 'internacio', 1, 800, 'médica'),
(7, 'Comitê Nor', 'não gov.', NULL, 500, 'diplomátic'),
(8, 'UE', 'governamen', NULL, 1000, 'presencial'),
(9, 'Amnistia I', 'não gov.', NULL, 650, 'diplomátic'),
(10, 'OMS', 'internacio', 1, 2000, 'médica');

-- Inserção de Líderes Políticos
INSERT INTO lider_politico (nome, id_grupo_armado, apoio) VALUES
('Hibatullah A.', 1, 'Apoio tribal e religioso'),
('Rodrigo Londo', 2, 'Acordos regionais e populares'),
('Ismail Haniy.', 3, 'Apoio do Hamas e de aliados'),
('Hassan Nasral', 4, 'Apoio iraniano e político'),
('Abubakar Shek', 5, 'Grupos extremistas locais'),
('Arnaldo Oteg', 6, 'Base nacionalista basca'),
('Ayman al-Zaw.', 7, 'Apoio jihadista internacional'),
('Abu Bakr al-B', 8, 'Redes extremistas no Iraque'),
('Antonio Garc', 9, 'Campesinato colombiano'),
('Abdullah Öcal', 10, 'Curdos na Turquia e Síria');


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
(1, 'islâmica'),
(6, 'cristã'),
(10, 'hindu');

INSERT INTO territorio (id_conflito, area_afetada) VALUES
(2, 'fronteira'),
(5, 'gaza'),
(9, 'donbas');

INSERT INTO economia (id_conflito, materia_prima_disputada) VALUES
(3, 'petróleo'),
(7, 'ouro');

INSERT INTO raca (id_conflito, etnia_afetada) VALUES
(4, 'tutsi'),
(8, 'rohingya');

-- Inserção de Países em Conflito
INSERT INTO paises_em_conflito (id_conflito, pais_envolvido) VALUES
(1, 'Iraque'),
(2, 'Sudão'),
(3, 'Nigéria'),
(4, 'Ruanda'),
(5, 'Israel'),
(5, 'Palestina'),
(6, 'Síria'),
(7, 'Venezuela'),
(8, 'Myanmar'),
(9, 'Ucrânia'),
(9, 'Rússia'),
(10, 'Índia');

-- Inserção de Participação de Grupos Armados
INSERT INTO participacao_grupo_armado (id_conflito, id_grupo_armado, data_entrada, data_saida) VALUES
(1, 1, '2020-01-15', '2021-12-30'),
(2, 5, '2019-03-20', '2020-11-25'),
(3, 2, '2018-07-12', '2019-09-18'),
(4, 8, '2017-04-08', '2018-12-20'),
(5, 3, '2021-01-10', '2022-08-25'),
(6, 4, '2020-09-12', '2021-11-30'),
(7, 9, '2019-11-05', '2021-03-20'),
(8, 7, '2018-12-15', '2020-02-28'),
(9, 10, '2022-01-20', '2023-06-15'),
(10, 6, '2021-05-10', '2022-07-10');

-- Inserção de Participação de Organizações Mediadoras
INSERT INTO participacao_org_mediadora (id_conflito, id_org_mediadora, data_entrada, data_saida) VALUES
(1, 1, '2020-01-15', '2021-06-30'),
(1, 2, '2020-02-10', '2021-08-15'),
(2, 1, '2019-03-20', '2020-12-10'),
(2, 3, '2019-05-15', '2020-11-25'),
(3, 2, '2018-07-12', '2019-09-18'),
(4, 1, '2017-04-08', '2018-12-20'),
(4, 2, '2017-06-15', '2018-10-30'),
(4, 6, '2017-08-20', '2018-11-15'),
(5, 1, '2021-01-10', '2022-05-25'),
(5, 3, '2021-03-15', '2022-07-10'),
(6, 2, '2020-09-12', '2021-11-30'),
(7, 1, '2019-11-05', '2021-03-20'),
(8, 6, '2018-12-15', '2020-02-28'),
(9, 3, '2022-01-20', '2023-06-15'),
(10, 1, '2021-05-10', '2022-08-25');


-- Inserção de Diálogos
INSERT INTO dialogo (id_org_mediadora, nome_lider_politico, id_grupo_armado) VALUES
(1, 'Hibatullah A.', 1),
(1, 'Rodrigo Londo', 2),
(2, 'Ismail Haniy.', 3),
(3, 'Hassan Nasral', 4),
(1, 'Abubakar Shek', 5);

-- Inserção de Liderança
INSERT INTO lideranca (id_grupo_armado, nome_lider_politico) VALUES
(1, 'Hibatullah A.'),
(2, 'Rodrigo Londo'),
(3, 'Ismail Haniy.'),
(4, 'Hassan Nasral'),
(5, 'Abubakar Shek'),
(6, 'Arnaldo Oteg'),
(7, 'Ayman al-Zaw.'),
(8, 'Abu Bakr al-B'),
(9, 'Antonio Garc'),
(10, 'Abdullah Öcal');

INSERT INTO chefe_militar (id, faixa_hierarquica, nome_lider_politico, id_grupo_armado, numero_divisao) VALUES
(1, 'Major', 'Hibatullah A.', 1, 1),
(2, 'Coronel', 'Hibatullah A.', 1, 1),
(3, 'Tenente', 'Hibatullah A.', 1, 2),
(4, 'Major', 'Rodrigo Londo', 2, 3),
(5, 'Coronel', 'Ismail Haniy.', 3, 4),
(6, 'Tenente', 'Hassan Nasral', 4, 5),
(7, 'Capitão', 'Abubakar Shek', 5, 6),
(8, 'Major', 'Arnaldo Oteg', 6, 7),
(9, 'Coronel', 'Ayman al-Zaw.', 7, 8),
(10, 'Tenente', 'Abu Bakr al-B', 8, 9),
(11, 'Major', 'Antonio Garc', 9, 10),
(12, 'Capitão', 'Abdullah Öcal', 10, 10);
-- Inserção de Fornecimento de Armas
INSERT INTO fornecimento (id_grupo_armado, nome_traficante, nome_arma, quantidade_fornecida) VALUES
(1, 'Carlos Fuentes', 'AK-47', 150),
(1, 'Yuri Ivanov', 'RPG-7', 25),
(2, 'Abdul Rashid', 'M16', 80),
(3, 'Diego Ramirez', 'Barret M82', 10),
(4, 'Viktor Bolkov', 'SCAR-H', 60),
(5, 'Carlos Fuentes', 'M200 Inter.', 15),
(6, 'Chen Wei', 'Uzi', 45),
(7, 'Ahmed Hassan', 'Dragunov SVD', 30),
(8, 'Marco Silva', 'HK416', 95),
(9, 'Ivan Petrov', 'FN FAL', 70);

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
('Ivan Petrov', 'FN FAL', 160);`,

  restricoes: `CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
BEGIN
    IF(SELECT COUNT(*) FROM chefe_militar WHERE numero_divisao = NEW.numero_divisao) >= 3
        THEN RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_limite_chefe_div
BEFORE INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION limita_chefe_por_divisao();

--============================================================================================

CREATE FUNCTION teste_hierarquia() RETURNS trigger AS $$
DECLARE contador INTEGER := 0;

BEGIN
    SELECT
        (SELECT COUNT(*) FROM conflito_religioso WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM conflito_territorial WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM conflito_economico WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM conflito_racial WHERE id_conflito = NEW.id)
    INTO contador;

    IF contador != 1 
        THEN RAISE EXCEPTION 'Conflito % deve estar em exatamente uma subclasse. Atualmente está em %.', NEW.id, contador;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hierarquia
AFTER INSERT OR UPDATE ON conflito
FOR EACH ROW
EXECUTE FUNCTION teste_hierarquia();

--============================================================================================

CREATE OR REPLACE FUNCTION atualizar_total_baixas_grupo() RETURNS TRIGGER AS $$

DECLARE total INT;

BEGIN
    SELECT SUM(numero_baixas) INTO total
    FROM divisao
    WHERE id_grupo_armado = NEW.id_grupo_armado;

    UPDATE grupo_armado
    SET numero_baixas = COALESCE(total, 0)
    WHERE id = NEW.id_grupo_armado;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atualizar_baixas
AFTER INSERT OR UPDATE OR DELETE ON divisao
FOR EACH ROW
EXECUTE FUNCTION atualizar_total_baixas_grupo();`
};

export default function SchemaViewer() {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  
  const { data: ddlData } = useQuery({
    queryKey: ["/api/schema/ddl"],
    queryFn: () => api.getDDLSchema(),
  });

  const { data: conflicts } = useQuery({
    queryKey: ["/api/conflicts"],
    queryFn: () => api.getConflicts(),
  });

  const { data: armedGroups } = useQuery({
    queryKey: ["/api/armed-groups"],
    queryFn: () => api.getArmedGroups(),
  });

  const { data: divisions } = useQuery({
    queryKey: ["/api/divisions"],
    queryFn: () => api.getDivisions(),
  });

  const { data: politicalLeaders } = useQuery({
    queryKey: ["/api/political-leaders"],
    queryFn: () => api.getPoliticalLeaders(),
  });

  const { data: militaryChiefs } = useQuery({
    queryKey: ["/api/military-chiefs"],
    queryFn: () => api.getMilitaryChiefs(),
  });

  const { data: mediatorOrgs } = useQuery({
    queryKey: ["/api/mediator-orgs"],
    queryFn: () => api.getMediatorOrgs(),
  });

  const tables = [
    { name: "conflicts", displayName: "Conflitos", count: conflicts?.length || 0, type: "Principal", data: conflicts },
    { name: "groups", displayName: "Grupos Armados", count: armedGroups?.length || 0, type: "Principal", data: armedGroups },
    { name: "divisions", displayName: "Divisões", count: divisions?.length || 0, type: "Militar", data: divisions },
    { name: "leaders", displayName: "Líderes Políticos", count: politicalLeaders?.length || 0, type: "Político", data: politicalLeaders },
    { name: "chiefs", displayName: "Chefes Militares", count: militaryChiefs?.length || 0, type: "Militar", data: militaryChiefs },
    { name: "mediators", displayName: "Org. Mediadoras", count: mediatorOrgs?.length || 0, type: "Mediação", data: mediatorOrgs },
  ];

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${name} copiado para a área de transferência`,
      });
    });
  };

  const renderTableData = (tableName: string) => {
    const table = tables.find(t => t.name === tableName);
    if (!table?.data || table.data.length === 0) {
      return <div className="text-center py-8 text-slate-500">Nenhum registro encontrado</div>;
    }

    const columns = Object.keys(table.data[0]);
    
    return (
      <TableComponent>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-medium text-slate-600 uppercase text-xs tracking-wider">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.data.slice(0, 10).map((row: any, index: number) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column} className="text-sm">
                  {row[column]?.toString() || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    );
  };

  if (selectedTable) {
    const table = tables.find(t => t.name === selectedTable);
    return (
      <div className="p-6">
        <Card className="fade-in">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setSelectedTable(null)} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <CardTitle>{table?.displayName}</CardTitle>
                <p className="text-sm text-slate-500">Visualizando {table?.count} registros</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {renderTableData(selectedTable)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Esquema Atual
          </TabsTrigger>
          <TabsTrigger value="tabelas" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Criação Tabelas
          </TabsTrigger>
          <TabsTrigger value="inserts" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Inserção Dados
          </TabsTrigger>
          <TabsTrigger value="restricoes" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Triggers/Restrições
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <CardTitle>Tabelas do Sistema</CardTitle>
              <p className="text-sm text-slate-500">Clique para visualizar dados</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tables.map((table) => (
                  <div
                    key={table.name}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <div>
                      <div className="font-medium text-slate-800">{table.displayName}</div>
                      <div className="text-sm text-slate-500">{table.count} registros</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{table.type}</Badge>
                      <Eye className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tabelas" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Criação das Tabelas (DDL)
              </CardTitle>
              <p className="text-sm text-slate-500">Script SQL para criação das tabelas do sistema</p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{sqlFiles.tabelas}</code>
                </pre>
              </div>
              <div className="mt-4">
                <Button onClick={() => copyToClipboard(sqlFiles.tabelas, 'Script de Criação')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inserts" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="w-5 h-5" />
                Inserção de Dados (DML)
              </CardTitle>
              <p className="text-sm text-slate-500">Script SQL para população inicial do banco</p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{sqlFiles.inserts}</code>
                </pre>
              </div>
              <div className="mt-4">
                <Button onClick={() => copyToClipboard(sqlFiles.inserts, 'Script de Inserção')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restricoes" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Triggers e Restrições
              </CardTitle>
              <p className="text-sm text-slate-500">Funções, triggers e validações do sistema</p>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">
                  <code>{sqlFiles.restricoes}</code>
                </pre>
              </div>
              <div className="mt-4">
                <Button onClick={() => copyToClipboard(sqlFiles.restricoes, 'Script de Triggers')} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Script
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
