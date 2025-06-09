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
    createTables: `-- Criação das tabelas do sistema de conflitos armados

-- Tabela de conflitos (principal)
CREATE TABLE conflito (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    total_mortos INTEGER DEFAULT 0,
    total_feridos INTEGER DEFAULT 0,
    data_inicio DATE,
    data_fim DATE,
    lugar VARCHAR(255),
    causa VARCHAR(100)
);

-- Tabela de grupos armados
CREATE TABLE grupo_armado (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    numero_baixas INTEGER DEFAULT 0,
    ideologia VARCHAR(100),
    lider VARCHAR(255),
    origem VARCHAR(255)
);

-- Tabela de divisões militares
CREATE TABLE divisao (
    numero_divisao SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    numero_homens INTEGER NOT NULL,
    numero_tanques INTEGER DEFAULT 0,
    numero_avioes INTEGER DEFAULT 0,
    numero_barcos INTEGER DEFAULT 0,
    numero_baixas INTEGER DEFAULT 0,
    id_grupo_armado VARCHAR(50) REFERENCES grupo_armado(id)
);

-- Tabela de organizações mediadoras
CREATE TABLE org_mediadora (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    pais_origem VARCHAR(100)
);

-- Tabela de líderes políticos
CREATE TABLE lider_politico (
    nome VARCHAR(255),
    id_grupo_armado VARCHAR(50) REFERENCES grupo_armado(id),
    partido VARCHAR(255),
    ideologia VARCHAR(100),
    PRIMARY KEY (nome, id_grupo_armado)
);

-- Tabela de traficantes
CREATE TABLE traficantes (
    nome VARCHAR(255) PRIMARY KEY,
    nacionalidade VARCHAR(100),
    especialidade VARCHAR(255)
);

-- Tabela de armas
CREATE TABLE armas (
    nome VARCHAR(255) PRIMARY KEY,
    tipo VARCHAR(100),
    capacidade_destrutiva INTEGER,
    alcance_km DECIMAL(10,2),
    origem VARCHAR(100)
);

-- Tabela de chefes militares
CREATE TABLE chefe_militar (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    patente VARCHAR(100),
    anos_experiencia INTEGER,
    numero_divisao INTEGER REFERENCES divisao(numero_divisao)
);

-- Tabelas de contexto
CREATE TABLE religiao (
    nome VARCHAR(255) PRIMARY KEY,
    origem VARCHAR(100),
    numero_seguidores BIGINT
);

CREATE TABLE territorio (
    nome VARCHAR(255) PRIMARY KEY,
    area_km2 DECIMAL(15,2),
    populacao BIGINT,
    recursos_naturais TEXT
);

CREATE TABLE economia (
    pais VARCHAR(100) PRIMARY KEY,
    pib_bilhoes DECIMAL(15,2),
    pib_per_capita DECIMAL(10,2),
    principais_exportacoes TEXT
);

CREATE TABLE raca (
    nome VARCHAR(255) PRIMARY KEY,
    origem VARCHAR(100),
    populacao_estimada BIGINT
);

-- Tabelas de relacionamento
CREATE TABLE paises_em_conflito (
    id_conflito INTEGER REFERENCES conflito(id),
    pais VARCHAR(100),
    papel VARCHAR(100),
    PRIMARY KEY (id_conflito, pais)
);

CREATE TABLE participacao_grupo_armado (
    id_conflito INTEGER REFERENCES conflito(id),
    id_grupo_armado VARCHAR(50) REFERENCES grupo_armado(id),
    data_entrada DATE,
    papel VARCHAR(100),
    PRIMARY KEY (id_conflito, id_grupo_armado)
);

CREATE TABLE participacao_org_mediadora (
    id_conflito INTEGER REFERENCES conflito(id),
    id_org_mediadora VARCHAR(50) REFERENCES org_mediadora(id),
    data_inicio DATE,
    tipo_mediacao VARCHAR(100),
    PRIMARY KEY (id_conflito, id_org_mediadora)
);

CREATE TABLE dialogo (
    id_conflito INTEGER REFERENCES conflito(id),
    id_org_mediadora VARCHAR(50) REFERENCES org_mediadora(id),
    data_dialogo DATE,
    resultado VARCHAR(255),
    PRIMARY KEY (id_conflito, id_org_mediadora, data_dialogo)
);

CREATE TABLE lideranca (
    nome_lider VARCHAR(255),
    id_grupo_armado VARCHAR(50),
    data_inicio DATE,
    data_fim DATE,
    PRIMARY KEY (nome_lider, id_grupo_armado, data_inicio),
    FOREIGN KEY (nome_lider, id_grupo_armado) REFERENCES lider_politico(nome, id_grupo_armado)
);

CREATE TABLE fornecimento (
    nome_traficante VARCHAR(255) REFERENCES traficantes(nome),
    nome_arma VARCHAR(255) REFERENCES armas(nome),
    id_grupo_armado VARCHAR(50) REFERENCES grupo_armado(id),
    quantidade INTEGER,
    data_fornecimento DATE,
    PRIMARY KEY (nome_traficante, nome_arma, id_grupo_armado)
);

CREATE TABLE contrabandeia (
    nome_traficante VARCHAR(255) REFERENCES traficantes(nome),
    id_grupo_armado VARCHAR(50) REFERENCES grupo_armado(id),
    data_inicio DATE,
    PRIMARY KEY (nome_traficante, id_grupo_armado)
);`,

    insertData: `-- Inserção de dados nas tabelas

-- Inserindo conflitos
INSERT INTO conflito (nome, total_mortos, total_feridos, data_inicio, data_fim, lugar, causa) VALUES
('Genocídio em Ruanda', 800000, 2000000, '1994-04-07', '1994-07-15', 'Ruanda', 'étnica'),
('Guerra Civil Síria', 387000, 1500000, '2011-03-15', NULL, 'Síria', 'política'),
('Conflito Israel-Palestina', 25000, 75000, '1948-05-15', NULL, 'Israel/Palestina', 'territorial'),
('Guerra do Afeganistão', 176000, 300000, '2001-10-07', '2021-08-30', 'Afeganistão', 'terrorismo'),
('Guerra Civil do Iêmen', 377000, 800000, '2014-09-21', NULL, 'Iêmen', 'sectária');

-- Inserindo grupos armados
INSERT INTO grupo_armado (id, nome, numero_baixas, ideologia, lider, origem) VALUES
('FPR', 'Frente Patriótica Ruandesa', 15000, 'Tutsi', 'Paul Kagame', 'Uganda'),
('ISIS', 'Estado Islâmico', 45000, 'Islâmica Radical', 'Abu Bakr al-Baghdadi', 'Iraque'),
('HAMAS', 'Movimento de Resistência Islâmica', 8000, 'Nacionalista Palestina', 'Ismail Haniyeh', 'Gaza'),
('TALIBAN', 'Movimento Islâmico do Talibã', 52000, 'Islâmica Conservadora', 'Hibatullah Akhundzada', 'Afeganistão'),
('HOUTHIS', 'Ansar Allah', 12000, 'Xiita', 'Abdul-Malik al-Houthi', 'Iêmen');

-- Inserindo divisões
INSERT INTO divisao (nome, numero_homens, numero_tanques, numero_avioes, numero_barcos, numero_baixas, id_grupo_armado) VALUES
('1ª Divisão FPR', 5000, 15, 3, 0, 2000, 'FPR'),
('2ª Divisão FPR', 3500, 8, 1, 0, 1500, 'FPR'),
('Brigada Al-Furqan', 8000, 25, 0, 0, 15000, 'ISIS'),
('Brigadas Ezzedin al-Qassam', 30000, 0, 0, 2, 6000, 'HAMAS'),
('Exército Vermelho Taliban', 60000, 12, 5, 0, 35000, 'TALIBAN'),
('Forças Especiais Houthi', 15000, 8, 0, 3, 8000, 'HOUTHIS');

-- Inserindo organizações mediadoras
INSERT INTO org_mediadora (id, nome, tipo, pais_origem) VALUES
('UN', 'Organização das Nações Unidas', 'Internacional', 'Estados Unidos'),
('AU', 'União Africana', 'Regional', 'Etiópia'),
('LAS', 'Liga Árabe', 'Regional', 'Egito'),
('ICRC', 'Comitê Internacional da Cruz Vermelha', 'Humanitária', 'Suíça'),
('MSF', 'Médicos Sem Fronteiras', 'Humanitária', 'França');

-- Inserindo líderes políticos
INSERT INTO lider_politico (nome, id_grupo_armado, partido, ideologia) VALUES
('Paul Kagame', 'FPR', 'Frente Patriótica Ruandesa', 'Desenvolvimentista'),
('Abu Bakr al-Baghdadi', 'ISIS', 'Estado Islâmico', 'Jihadista'),
('Ismail Haniyeh', 'HAMAS', 'Hamas', 'Islamista'),
('Mullah Omar', 'TALIBAN', 'Taliban', 'Fundamentalista'),
('Abdul-Malik al-Houthi', 'HOUTHIS', 'Ansar Allah', 'Revolucionário');

-- Inserindo traficantes
INSERT INTO traficantes (nome, nacionalidade, especialidade) VALUES
('Viktor Bout', 'Russo', 'Armas pesadas e aeronaves'),
('Monzer al-Kassar', 'Sírio', 'Armamento automático'),
('Sarkis Soghanalian', 'Libanês', 'Equipamentos militares'),
('Adnan Khashoggi', 'Saudita', 'Sistemas de defesa'),
('Tamir Pardo', 'Israelense', 'Tecnologia militar');

-- Inserindo armas
INSERT INTO armas (nome, tipo, capacidade_destrutiva, alcance_km, origem) VALUES
('AK-47', 'Fuzil de Assalto', 7, 0.4, 'Rússia'),
('RPG-7', 'Lança-granadas', 8, 0.5, 'Rússia'),
('M16A4', 'Fuzil de Assalto', 7, 0.55, 'Estados Unidos'),
('Katyusha', 'Sistema de Foguetes', 9, 20, 'Rússia'),
('Qassam', 'Foguete Artesanal', 6, 10, 'Gaza');

-- Inserindo chefes militares
INSERT INTO chefe_militar (id, nome, patente, anos_experiencia, numero_divisao) VALUES
('CM001', 'General Kayumba Nyamwasa', 'General', 25, 1),
('CM002', 'Coronel James Kabarebe', 'Coronel', 20, 2),
('CM003', 'Abu Omar al-Shishani', 'Emir', 15, 3),
('CM004', 'Mohammed Deif', 'Comandante', 30, 4),
('CM005', 'Mullah Baradar', 'Mullah', 35, 5);

-- Inserindo religiões
INSERT INTO religiao (nome, origem, numero_seguidores) VALUES
('Cristianismo', 'Oriente Médio', 2400000000),
('Islamismo', 'Arábia Saudita', 1800000000),
('Hinduísmo', 'Índia', 1200000000),
('Budismo', 'Índia', 500000000),
('Judaísmo', 'Oriente Médio', 15000000);

-- Inserindo territórios
INSERT INTO territorio (nome, area_km2, populacao, recursos_naturais) VALUES
('Gaza', 365, 2000000, 'Gás natural marítimo'),
('Síria', 185180, 17500000, 'Petróleo, gás natural'),
('Afeganistão', 652230, 38900000, 'Minerais raros, ópio'),
('Iêmen', 527970, 29800000, 'Petróleo, gás natural'),
('Ruanda', 26338, 12900000, 'Coltã, cassiterita');

-- Inserindo economia
INSERT INTO economia (pais, pib_bilhoes, pib_per_capita, principais_exportacoes) VALUES
('Síria', 40.4, 2300, 'Petróleo, têxteis, algodão'),
('Afeganistão', 19.8, 508, 'Ópio, frutas secas, tapetes'),
('Iêmen', 21.6, 724, 'Petróleo, café, peixe'),
('Ruanda', 10.3, 798, 'Café, chá, minerais'),
('Israel', 395.1, 43600, 'Tecnologia, diamantes, produtos químicos');

-- Inserindo raças/etnias
INSERT INTO raca (nome, origem, populacao_estimada) VALUES
('Tutsi', 'Grandes Lagos Africanos', 2000000),
('Hutu', 'Grandes Lagos Africanos', 11000000),
('Árabe', 'Península Arábica', 422000000),
('Pashtun', 'Afeganistão', 42000000),
('Houthi', 'Iêmen', 15000000);

-- Inserindo países em conflito
INSERT INTO paises_em_conflito (id_conflito, pais, papel) VALUES
(1, 'Ruanda', 'Principal'),
(1, 'França', 'Intervenção'),
(2, 'Síria', 'Principal'),
(2, 'Rússia', 'Apoio ao governo'),
(2, 'Estados Unidos', 'Oposição'),
(3, 'Israel', 'Principal'),
(3, 'Palestina', 'Principal'),
(4, 'Afeganistão', 'Principal'),
(4, 'Estados Unidos', 'Invasor'),
(5, 'Iêmen', 'Principal'),
(5, 'Arábia Saudita', 'Intervenção');`
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
    <div className="space-y-6">
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