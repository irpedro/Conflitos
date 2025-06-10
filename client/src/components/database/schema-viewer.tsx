import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Database, Shield, Users, Grid3X3, MapPin, BarChart3, FileText, Table2, Copy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface TableData {
  [key: string]: any;
}

export default function SchemaViewer() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Código copiado",
      description: `O código SQL "${name}" foi copiado para a área de transferência.`,
    });
  };

  // Get data for the selected table
  const { data: tableData, isLoading, error } = useQuery<TableData[]>({
    queryKey: [`/api/query`, selectedTable],
    queryFn: async () => {
      if (!selectedTable) return [];
      
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `SELECT * FROM ${selectedTable} LIMIT 50` })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error querying table ${selectedTable}`);
      }
      
      const result = await response.json();
      return result.results || [];
    },
    enabled: !!selectedTable,
    retry: false
  });

  // SQL Scripts for table creation and data insertion
  const sqlScripts = {
    createTables: `CREATE TABLE conflito( 
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
    numero_divisao INT NOT NULL,

    PRIMARY KEY(id),
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
);`,

    insertData: `-- Inserção de Conflitos
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

INSERT INTO chefe_militar (id, faixa_hierarquica, nome_lider_politico, numero_divisao) VALUES
(1, 'Major', 'Hibatullah A.', 1),
(2, 'Coronel', 'Hibatullah A.', 1),
(3, 'Tenente', 'Hibatullah A.', 2),
(4, 'Major', 'Rodrigo Londo', 3),
(5, 'Coronel', 'Ismail Haniy.', 4),
(6, 'Tenente', 'Hassan Nasral', 5),
(7, 'Capitão', 'Abubakar Shek', 20),
(8, 'Major', 'Arnaldo Oteg', 21),
(9, 'Coronel', 'Ayman al-Zaw.', 22),
(10, 'Tenente', 'Abu Bakr al-B', 23),
(11, 'Major', 'Antonio Garc', 24),
(12, 'Capitão', 'Abdullah Öcal', 25),
(13, 'Sargento', 'Hibatullah A.', 1);

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
('Ivan Petrov', 'FN FAL', 160);`
  };

  // Available tables organized by category
  const tableCategories = {
    principais: [
      { name: "conflito", displayName: "Conflitos", icon: Shield, description: "Registros de conflitos armados" },
      { name: "grupo_armado", displayName: "Grupos Armados", icon: Users, description: "Organizações militares" },
      { name: "divisao", displayName: "Divisões", icon: Grid3X3, description: "Unidades militares" },
      { name: "org_mediadora", displayName: "Organizações Mediadoras", icon: Shield, description: "Entidades de mediação" }
    ],
    pessoal: [
      { name: "lider_politico", displayName: "Líderes Políticos", icon: Users, description: "Liderança política" },
      { name: "chefe_militar", displayName: "Chefes Militares", icon: Shield, description: "Comando militar" },
      { name: "traficantes", displayName: "Traficantes", icon: Users, description: "Traficantes de armas" }
    ],
    recursos: [
      { name: "armas", displayName: "Armas", icon: Shield, description: "Arsenal disponível" },
      { name: "territorio", displayName: "Territórios", icon: MapPin, description: "Áreas geográficas" },
      { name: "economia", displayName: "Economia", icon: BarChart3, description: "Dados econômicos" },
      { name: "religiao", displayName: "Religiões", icon: Database, description: "Aspectos religiosos" },
      { name: "raca", displayName: "Grupos Étnicos", icon: Users, description: "Diversidade étnica" }
    ],
    relacionamentos: [
      { name: "paises_em_conflito", displayName: "Países em Conflito", icon: MapPin, description: "Relação países-conflitos" },
      { name: "participacao_grupo_armado", displayName: "Participação Grupos", icon: Shield, description: "Grupos em conflitos" },
      { name: "participacao_org_mediadora", displayName: "Participação Mediadores", icon: Users, description: "Organizações em mediações" },
      { name: "dialogo", displayName: "Diálogos", icon: Users, description: "Negociações" },
      { name: "lideranca", displayName: "Liderança", icon: Users, description: "Relação líderes-grupos" },
      { name: "fornecimento", displayName: "Fornecimento", icon: Shield, description: "Suprimento de armas" },
      { name: "contrabandeia", displayName: "Contrabando", icon: Shield, description: "Atividades de contrabando" }
    ]
  };

  // Render table data
  const renderTableData = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 ml-4">Carregando dados...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Erro ao carregar dados:</p>
            <p className="text-sm text-gray-600">{error.message}</p>
          </div>
        </div>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-600">Nenhum dado encontrado para esta tabela.</p>
        </div>
      );
    }

    const columns = Object.keys(tableData[0]);

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-semibold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} className="max-w-xs truncate">
                    {row[column] !== null && row[column] !== undefined ? String(row[column]) : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // If a table is selected, show its data
  if (selectedTable) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTable(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tabela: {selectedTable}
            </h2>
            <p className="text-gray-600">
              Dados da tabela selecionada
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Tabela</CardTitle>
          </CardHeader>
          <CardContent>
            {renderTableData()}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main view showing all tables with tabs
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Esquema do Banco de Dados
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore as tabelas do sistema de conflitos armados e visualize os códigos SQL.
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Esquema Atual
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Criação de Tabelas
          </TabsTrigger>
          <TabsTrigger value="insert" className="flex items-center gap-2">
            <Table2 className="w-4 h-4" />
            Inserção de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <div className="space-y-8">
            {Object.entries(tableCategories).map(([category, tables]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {category === 'principais' ? 'Tabelas Principais' :
                   category === 'pessoal' ? 'Pessoal' :
                   category === 'recursos' ? 'Recursos' :
                   'Relacionamentos'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map((table) => {
                    const IconComponent = table.icon;
                    return (
                      <Card 
                        key={table.name} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                        onClick={() => setSelectedTable(table.name)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-blue-600" />
                              {table.displayName}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {table.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {table.name}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Script de Criação de Tabelas
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">SQL completo para criação do esquema do banco de dados</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(sqlScripts.createTables, 'Script de Criação')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Script
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  <code>{sqlScripts.createTables}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insert" className="mt-6">
          <Card className="fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Table2 className="w-5 h-5" />
                    Script de Inserção de Dados
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">SQL completo para inserção dos dados de exemplo</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(sqlScripts.insertData, 'Script de Inserção')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Script
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  <code>{sqlScripts.insertData}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
