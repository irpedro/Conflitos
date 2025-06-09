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
    data_entrada DATE NOT NULL,
    data_saida DATE NOT NULL,

    PRIMARY KEY(id_conflito, id_grupo_armado),

    FOREIGN KEY(id_conflito) REFERENCES conflito(id),
    FOREIGN KEY(id_grupo_armado) REFERENCES grupo_armado(id)
);

CREATE TABLE participacao_org_mediadora( 
    id_conflito INT NOT NULL,
    id_org_mediadora INT NOT NULL,
    data_entrada DATE NOT NULL,
    data_saida DATE NOT NULL,

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

-- Triggers e Restrições
CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
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

CREATE FUNCTION teste_hierarquia() RETURNS trigger AS $$
DECLARE contador INTEGER := 0;

BEGIN
    SELECT
        (SELECT COUNT(*) FROM religiao WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM territorio WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM economia WHERE id_conflito = NEW.id) +
        (SELECT COUNT(*) FROM raca WHERE id_conflito = NEW.id)
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
EXECUTE FUNCTION atualizar_total_baixas_grupo();

-- Restrição: Mínimo 2 grupos por conflito
CREATE FUNCTION valida_minimo_grupos_conflito() RETURNS TRIGGER AS $$
DECLARE 
    total_grupos INT;
BEGIN
    -- Conta quantos grupos participam do conflito
    SELECT COUNT(*) INTO total_grupos
    FROM participacao_grupo_armado
    WHERE id_conflito = COALESCE(NEW.id_conflito, OLD.id_conflito);
    
    -- Se for menos que 2 grupos, impede a operação
    IF total_grupos < 2 THEN
        RAISE EXCEPTION 'Um conflito deve ter pelo menos 2 grupos armados participando. Atual: %', total_grupos;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_minimo_grupos
AFTER INSERT OR DELETE ON participacao_grupo_armado
FOR EACH ROW
EXECUTE FUNCTION valida_minimo_grupos_conflito();

-- Restrição: Sequencialidade de divisões
CREATE FUNCTION gerar_numero_divisao_sequencial() RETURNS TRIGGER AS $$
DECLARE 
    proximo_numero INT;
BEGIN
    -- Busca o próximo número sequencial para o grupo
    SELECT COALESCE(MAX(numero_divisao), 0) + 1 INTO proximo_numero
    FROM divisao
    WHERE id_grupo_armado = NEW.id_grupo_armado;
    
    -- Atribui o número sequencial
    NEW.numero_divisao = proximo_numero;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sequencia_divisao
BEFORE INSERT ON divisao
FOR EACH ROW
EXECUTE FUNCTION gerar_numero_divisao_sequencial();`,

    insertData: `-- Inserção de dados nas tabelas

-- Inserindo conflitos
INSERT INTO conflito (id, total_mortos, total_feridos, causa, lugar, nome) VALUES
(1, 800000, 2000000, 'étnica', 'Ruanda', 'Genocídio em Ruanda'),
(2, 387000, 1500000, 'política', 'Síria', 'Guerra Civil Síria'),
(3, 25000, 75000, 'territorial', 'Israel/Palestina', 'Conflito Israel-Palestina'),
(4, 176000, 300000, 'terrorismo', 'Afeganistão', 'Guerra do Afeganistão'),
(5, 377000, 800000, 'sectária', 'Iêmen', 'Guerra Civil do Iêmen');

-- Inserindo grupos armados
INSERT INTO grupo_armado (id, nome, numero_baixas) VALUES
(1, 'Frente Patriótica Ruandesa', 15000),
(2, 'Estado Islâmico', 45000),
(3, 'Hamas', 8000),
(4, 'Taliban', 52000),
(5, 'Houthis', 12000);

-- Inserindo divisões
INSERT INTO divisao (numero_divisao, id_grupo_armado, numero_barcos, numero_tanques, numero_avioes, numero_homens, numero_baixas) VALUES
(1, 1, 0, 15, 3, 5000, 2000),
(2, 1, 0, 8, 1, 3500, 1500),
(3, 2, 0, 25, 0, 8000, 15000),
(4, 3, 2, 0, 0, 30000, 6000),
(5, 4, 0, 12, 5, 60000, 35000),
(6, 5, 3, 8, 0, 15000, 8000);

-- Inserindo organizações mediadoras
INSERT INTO org_mediadora (id, nome, tipo_org, org_superior, numero_pessoas_sustentadas, tipo_ajuda) VALUES
(1, 'ONU', 'Internacional', NULL, 1000000, 'Humanitária'),
(2, 'União Africana', 'Regional', 1, 500000, 'Mediação'),
(3, 'Liga Árabe', 'Regional', 1, 300000, 'Diplomática'),
(4, 'Cruz Vermelha', 'Humanitária', NULL, 2000000, 'Médica'),
(5, 'MSF', 'Humanitária', 4, 800000, 'Médica');

-- Inserindo líderes políticos
INSERT INTO lider_politico (nome, id_grupo_armado, apoio) VALUES
('Paul Kagame', 1, 'Uganda e comunidade internacional'),
('Abu Bakr al-Baghdadi', 2, 'Extremistas islâmicos'),
('Ismail Haniyeh', 3, 'Irã e Palestinos'),
('Mullah Omar', 4, 'Tribos pashtuns'),
('Abdul-Malik al-Houthi', 5, 'Irã e xiitas');

-- Inserindo traficantes
INSERT INTO traficantes (nome) VALUES
('Viktor Bout'),
('Monzer al-Kassar'),
('Sarkis Soghanalian'),
('Adnan Khashoggi'),
('Tamir Pardo');

-- Inserindo armas
INSERT INTO armas (nome, capacidade_destrutiva) VALUES
('AK-47', 7),
('RPG-7', 8),
('M16A4', 7),
('Katyusha', 9),
('Qassam', 6);

-- Inserindo chefes militares
INSERT INTO chefe_militar (id, faixa_hierarquica, nome_lider_politico, numero_divisao) VALUES
(1, 'General', 'Paul Kagame', 1),
(2, 'Coronel', 'Paul Kagame', 2),
(3, 'Emir', 'Abu Bakr al-Baghdadi', 3),
(4, 'Comandante', 'Ismail Haniyeh', 4),
(5, 'Mullah', 'Mullah Omar', 5);

-- Inserindo subtipos de conflito (religioso, territorial, econômico, racial)
INSERT INTO religiao (id_conflito, religiao_afetada) VALUES
(2, 'Islã'),
(4, 'Islã'),
(5, 'Islã');

INSERT INTO territorio (id_conflito, area_afetada) VALUES
(3, 'Gaza');

INSERT INTO economia (id_conflito, materia_prima_disputada) VALUES
(5, 'Petróleo');

INSERT INTO raca (id_conflito, etnia_afetada) VALUES
(1, 'Tutsi');

-- Inserindo países em conflito
INSERT INTO paises_em_conflito (id_conflito, pais_envolvido) VALUES
(1, 'Ruanda'),
(1, 'França'),
(2, 'Síria'),
(2, 'Rússia'),
(2, 'Estados Unidos'),
(3, 'Israel'),
(3, 'Palestina'),
(4, 'Afeganistão'),
(4, 'Estados Unidos'),
(5, 'Iêmen'),
(5, 'Arábia Saudita');

-- Inserindo participação de grupos armados
INSERT INTO participacao_grupo_armado (id_conflito, id_grupo_armado, data_entrada, data_saida) VALUES
(1, 1, '1990-10-01', '1994-07-15'),
(2, 2, '2013-04-08', '2019-03-23'),
(3, 3, '1987-12-09', '2024-12-31'),
(4, 4, '1994-09-27', '2021-08-30'),
(5, 5, '2014-09-21', '2024-12-31');

-- Inserindo participação de organizações mediadoras
INSERT INTO participacao_org_mediadora (id_conflito, id_org_mediadora, data_entrada, data_saida) VALUES
(1, 1, '1994-04-07', '1994-07-15'),
(2, 1, '2011-03-15', '2024-12-31'),
(3, 1, '1948-05-15', '2024-12-31'),
(4, 1, '2001-10-07', '2021-08-30'),
(5, 3, '2015-03-26', '2024-12-31');

-- Inserindo diálogos
INSERT INTO dialogo (id_org_mediadora, nome_lider_politico, id_grupo_armado) VALUES
(1, 'Paul Kagame', 1),
(1, 'Ismail Haniyeh', 3),
(3, 'Abdul-Malik al-Houthi', 5);

-- Inserindo liderança
INSERT INTO lideranca (id_grupo_armado, nome_lider_politico) VALUES
(1, 'Paul Kagame'),
(2, 'Abu Bakr al-Baghdadi'),
(3, 'Ismail Haniyeh'),
(4, 'Mullah Omar'),
(5, 'Abdul-Malik al-Houthi');

-- Inserindo fornecimento de armas
INSERT INTO fornecimento (id_grupo_armado, nome_traficante, nome_arma, quantidade_fornecida) VALUES
(1, 'Viktor Bout', 'AK-47', 5000),
(2, 'Monzer al-Kassar', 'AK-47', 10000),
(3, 'Sarkis Soghanalian', 'RPG-7', 500),
(4, 'Adnan Khashoggi', 'M16A4', 3000),
(5, 'Viktor Bout', 'Katyusha', 200);

-- Inserindo contrabando
INSERT INTO contrabandeia (nome_traficante, nome_arma, quantidade_possuida) VALUES
('Viktor Bout', 'AK-47', 50000),
('Monzer al-Kassar', 'RPG-7', 2000),
('Sarkis Soghanalian', 'M16A4', 15000),
('Adnan Khashoggi', 'Katyusha', 800),
('Tamir Pardo', 'Qassam', 1200);`
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