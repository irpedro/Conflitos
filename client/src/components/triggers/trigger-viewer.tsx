import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Zap, Copy, BarChart3, Database, Users, Grid3X3 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function TriggerViewer() {
  const { toast } = useToast();
  
  const { data: triggers } = useQuery({
    queryKey: ["/api/triggers"],
    queryFn: () => api.getTriggerInfo(),
  });

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Código copiado",
      description: `O código do trigger "${name}" foi copiado para a área de transferência.`,
    });
  };

  const triggerDefinitions = [
    {
      name: "Limite de Chefes por Divisão",
      description: "Limita o número máximo de 3 chefes militares por divisão",
      table: "chefe_militar",
      event: "BEFORE INSERT",
      active: true,
      code: `CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
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
EXECUTE FUNCTION limita_chefe_por_divisao();`,
      icon: AlertTriangle,
      color: "yellow"
    },
    {
      name: "Validação de Hierarquia de Conflitos",
      description: "Garante que cada conflito esteja em exatamente uma subclasse (religioso, territorial, econômico ou racial)",
      table: "conflito",
      event: "AFTER INSERT OR UPDATE",
      active: true,
      code: `CREATE OR REPLACE FUNCTION teste_hierarquia() RETURNS TRIGGER AS $$
DECLARE 
    contador INTEGER := 0;
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

-- Trigger para validar hierarquia
DROP TRIGGER IF EXISTS trg_teste_hierarquia ON conflito;
CREATE TRIGGER trg_teste_hierarquia
    BEFORE INSERT OR UPDATE ON conflito
    FOR EACH ROW
    EXECUTE FUNCTION teste_hierarquia();`,
      icon: Shield,
      color: "blue"
    },
    {
      name: "Atualização Automática de Baixas",
      description: "Atualiza automaticamente o total de baixas do grupo armado quando há mudanças nas divisões",
      table: "divisao",
      event: "AFTER INSERT OR UPDATE OR DELETE",
      active: true,
      code: `CREATE OR REPLACE FUNCTION atualizar_total_baixas_grupo() RETURNS TRIGGER AS $$

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
EXECUTE FUNCTION atualizar_total_baixas_grupo();`,
      icon: BarChart3,
      color: "green"
    },
    {
      name: "Mínimo de Grupos por Conflito",
      description: "Garante que cada conflito tenha pelo menos 2 grupos armados participando",
      table: "participacao_grupo_armado",
      event: "AFTER INSERT OR DELETE",
      active: true,
      code: `CREATE FUNCTION valida_minimo_grupos_conflito() RETURNS TRIGGER AS $$
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
EXECUTE FUNCTION valida_minimo_grupos_conflito();`,
      icon: Users,
      color: "red"
    },
    {
      name: "Sequencialidade de Divisões",
      description: "Gera automaticamente números sequenciais para divisões dentro de cada grupo armado",
      table: "divisao",
      event: "BEFORE INSERT",
      active: true,
      code: `CREATE FUNCTION gerar_numero_divisao_sequencial() RETURNS TRIGGER AS $$
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
      icon: Grid3X3,
      color: "purple"
    }
  ];

  const constraints = [
    {
      name: "Foreign Key Constraints",
      count: 17,
      description: "Garantem integridade referencial entre tabelas",
      examples: [
        "divisao.id_grupo_armado → grupo_armado.id",
        "lider_politico.id_grupo_armado → grupo_armado.id",
        "chefe_militar.numero_divisao → divisao.numero_divisao",
        "participacao_grupo_armado.id_conflito → conflito.id"
      ],
      color: "blue"
    },
    {
      name: "NOT NULL Constraints",
      count: 52,
      description: "Campos obrigatórios protegidos contra valores nulos",
      examples: [
        "conflito.nome NOT NULL",
        "grupo_armado.nome NOT NULL",
        "divisao.numero_homens NOT NULL"
      ],
      color: "purple"
    },
    {
      name: "Primary Key Constraints",
      count: 21,
      description: "Chaves primárias únicas em todas as tabelas",
      examples: [
        "conflito(id)",
        "grupo_armado(id)",
        "divisao(numero_divisao)"
      ],
      color: "green"
    },
    {
      name: "Check Constraints",
      count: "Personalizadas",
      description: "Validações customizadas para regras de negócio",
      examples: [
        "total_mortos >= 0",
        "total_feridos >= 0",
        "numero_baixas >= 0"
      ],
      color: "yellow"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Triggers & Restrições</h1>
        <p className="text-slate-600">Funções, triggers e validações implementadas no sistema de conflitos armados</p>
      </div>

      {/* Triggers Grid */}
      <div className="grid grid-cols-1 gap-6">
        {triggerDefinitions.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <Card key={trigger.name} className="fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`w-6 h-6 mr-3 ${
                      trigger.color === 'yellow' ? 'text-yellow-600' :
                      trigger.color === 'blue' ? 'text-blue-600' :
                      'text-green-600'
                    }`} />
                    <div>
                      <CardTitle className="text-xl">{trigger.name}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Tabela: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{trigger.table}</span> • 
                        Evento: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded ml-1">{trigger.event}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">ATIVO</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(trigger.code, trigger.name)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{trigger.description}</p>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    <code>{trigger.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sistema de Triggers Ativos */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Resumo dos Triggers Implementados
          </CardTitle>
          <p className="text-sm text-slate-500">Todos os 5 triggers de integridade implementados no sistema</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triggerDefinitions.map((trigger, index) => {
              const Icon = trigger.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center">
                    <Icon className={`w-4 h-4 mr-2 ${
                      trigger.color === 'yellow' ? 'text-yellow-600' :
                      trigger.color === 'blue' ? 'text-blue-600' :
                      trigger.color === 'green' ? 'text-green-600' :
                      trigger.color === 'red' ? 'text-red-600' :
                      'text-purple-600'
                    }`} />
                    <div>
                      <span className="font-medium text-sm">{trigger.name}</span>
                      <p className="text-xs text-slate-500">{trigger.table} • {trigger.event}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">ATIVO</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
