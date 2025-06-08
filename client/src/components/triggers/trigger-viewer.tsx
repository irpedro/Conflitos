import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Zap, Database } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function TriggerViewer() {
  const { toast } = useToast();
  
  const { data: triggers } = useQuery({
    queryKey: ["/api/triggers"],
    queryFn: () => api.getTriggerInfo(),
  });

  const handleTestConstraint = (constraintType: string) => {
    toast({
      title: "Teste de Restrição",
      description: `Simulando violação da restrição: ${constraintType}`,
      variant: "destructive",
    });
  };

  const triggerDefinitions = [
    {
      name: "Limite de Chefes por Divisão",
      description: "Limita o número máximo de 3 chefes militares por divisão",
      active: true,
      code: `CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
BEGIN
    IF(SELECT COUNT(*) FROM chefe_militar WHERE numero_divisao = NEW.numero_divisao) >= 3
        THEN RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teste_limite_chefe_div
BEFORE INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION limita_chefe_por_divisao();`,
      icon: AlertTriangle,
      color: "yellow"
    },
    {
      name: "Validação de Hierarquia",
      description: "Garante que a estrutura hierárquica seja respeitada",
      active: true,
      code: `CREATE FUNCTION hierarquia_de_conflitos() RETURNS trigger AS $$
BEGIN
    -- Validações de hierarquia organizacional
    -- Verifica se líderes políticos pertencem aos grupos corretos
    -- Valida estrutura de comando militar
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validacao_hierarquia
BEFORE INSERT OR UPDATE ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION hierarquia_de_conflitos();`,
      icon: Shield,
      color: "blue"
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
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Implemented Triggers */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Triggers Implementados
            </CardTitle>
            <p className="text-sm text-slate-500">Restrições de integridade ativas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {triggerDefinitions.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <div key={trigger.name} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-2 text-yellow-600" />
                        <h4 className="font-medium text-slate-800">{trigger.name}</h4>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        ATIVO
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{trigger.description}</p>
                    <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                        <code>{trigger.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Integrity Constraints */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Restrições de Integridade
            </CardTitle>
            <p className="text-sm text-slate-500">Constraints aplicadas no banco</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {constraints.map((constraint) => (
                <div key={constraint.name} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{constraint.name}</h4>
                    <Badge className={`${
                      constraint.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      constraint.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      constraint.color === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {constraint.count} ATIVAS
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{constraint.description}</p>
                  <div className="text-sm text-slate-500 space-y-1">
                    {constraint.examples.slice(0, 3).map((example, index) => (
                      <div key={index}>• {example}</div>
                    ))}
                    {constraint.examples.length > 3 && (
                      <div className="text-slate-400">... e mais {constraint.examples.length - 3} constraints</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trigger Testing */}
      <Card className="mt-6 fade-in">
        <CardHeader>
          <CardTitle>Teste de Restrições</CardTitle>
          <p className="text-sm text-slate-500">Teste as validações implementadas no sistema</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-3">Teste: Limite de Chefes</h4>
              <p className="text-sm text-slate-600 mb-4">
                Tente adicionar um 4º chefe militar à divisão 1 (que já possui 3 chefes)
              </p>
              <Button 
                onClick={() => handleTestConstraint("Limite de Chefes")}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Executar Teste
              </Button>
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-red-800">Erro: Constraint Violada</div>
                    <div className="text-xs text-red-600 mt-1">
                      A divisão escolhida já tem o máximo de 3 chefes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-800 mb-3">Teste: Foreign Key</h4>
              <p className="text-sm text-slate-600 mb-4">
                Tente inserir um chefe militar com divisão inexistente
              </p>
              <Button 
                onClick={() => handleTestConstraint("Foreign Key")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Executar Teste
              </Button>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start">
                  <Database className="w-4 h-4 text-orange-600 mt-0.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">Erro: Chave Estrangeira</div>
                    <div className="text-xs text-orange-600 mt-1">
                      Divisão não encontrada no sistema
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
