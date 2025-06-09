import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Users, Shield, Crown, Star, Loader2, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// Define tipos locais para resolver problemas de importação
type GrupoArmado = {
  id: number;
  nome: string;
  numeroBaixas: number;
};

type LiderPolitico = {
  nome: string;
  idGrupoArmado: number;
  apoio: string;
};

type Divisao = {
  numeroDivisao: number;
  idGrupoArmado: number;
  numeroBarcos: number;
  numeroTanques: number;
  numeroAvioes: number;
  numeroHomens: number;
  numeroBaixas: number;
};

export default function EntityForms() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Form states
  const [conflictForm, setConflictForm] = useState({
    id: "",
    nome: "",
    lugar: "",
    causa: "",
    totalMortos: 0,
    totalFeridos: 0
  });

  const [groupForm, setGroupForm] = useState({
    id: "",
    nome: "",
    numeroBaixas: 0
  });

  const [leaderForm, setLeaderForm] = useState({
    nome: "",
    idGrupoArmado: "",
    apoio: ""
  });

  const [chiefForm, setChiefForm] = useState({
    id: "",
    faixaHierarquica: "",
    nomeLiderPolitico: "",
    numeroDivisao: ""
  });

  const [divisionForm, setDivisionForm] = useState({
    numeroDivisao: "",
    idGrupoArmado: "",
    numeroBarcos: 0,
    numeroTanques: 0,
    numeroAvioes: 0,
    numeroHomens: 0,
    numeroBaixas: 0
  });

  // Fetch reference data
  const { data: armedGroups } = useQuery({
    queryKey: ["/api/armed-groups"],
    queryFn: () => api.getArmedGroups(),
  });

  const { data: politicalLeaders } = useQuery({
    queryKey: ["/api/political-leaders"],
    queryFn: () => api.getPoliticalLeaders(),
  });

  const { data: divisions } = useQuery({
    queryKey: ["/api/divisions"],
    queryFn: () => api.getDivisions(),
  });

  // Mutations
  const createConflictMutation = useMutation({
    mutationFn: api.createConflict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conflicts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      setConflictForm({ id: "", nome: "", lugar: "", causa: "", totalMortos: 0, totalFeridos: 0 });
      toast({ title: "Conflito criado", description: "O conflito foi cadastrado com sucesso." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar conflito",
        description: error.details || "Ocorreu um erro ao cadastrar o conflito.",
        variant: "destructive"
      });
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: api.createArmedGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/armed-groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      setGroupForm({ id: "", nome: "", numeroBaixas: 0 });
      toast({ title: "Grupo criado", description: "O grupo armado foi cadastrado com sucesso." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar grupo",
        description: error.details || "Ocorreu um erro ao cadastrar o grupo armado.",
        variant: "destructive"
      });
    }
  });

  const createLeaderMutation = useMutation({
    mutationFn: api.createPoliticalLeader,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/political-leaders"] });
      setLeaderForm({ nome: "", idGrupoArmado: "", apoio: "" });
      toast({ title: "Líder criado", description: "O líder político foi cadastrado com sucesso." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar líder",
        description: error.details || "Ocorreu um erro ao cadastrar o líder político.",
        variant: "destructive"
      });
    }
  });

  const createChiefMutation = useMutation({
    mutationFn: api.createMilitaryChief,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/military-chiefs"] });
      setChiefForm({ id: "", faixaHierarquica: "", nomeLiderPolitico: "", numeroDivisao: "" });
      toast({ title: "Chefe criado", description: "O chefe militar foi cadastrado com sucesso." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar chefe",
        description: error.details || "Ocorreu um erro ao cadastrar o chefe militar.",
        variant: "destructive"
      });
    }
  });

  const createDivisionMutation = useMutation({
    mutationFn: api.createDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/divisions"] });
      setDivisionForm({ numeroDivisao: "", idGrupoArmado: "", numeroBarcos: 0, numeroTanques: 0, numeroAvioes: 0, numeroHomens: 0, numeroBaixas: 0 });
      toast({ title: "Divisão criada", description: "A divisão foi cadastrada com sucesso." });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar divisão",
        description: error.details || "Ocorreu um erro ao cadastrar a divisão.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitConflict = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...conflictForm,
      id: parseInt(conflictForm.id)
    };
    createConflictMutation.mutate(formData);
  };

  const handleSubmitGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...groupForm,
      id: parseInt(groupForm.id)
    };
    createGroupMutation.mutate(formData);
  };

  const handleSubmitLeader = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...leaderForm,
      idGrupoArmado: parseInt(leaderForm.idGrupoArmado)
    };
    createLeaderMutation.mutate(formData);
  };

  const handleSubmitChief = (e: React.FormEvent) => {
    e.preventDefault();
    // Find the selected leader to get the group ID
    const selectedLeader = politicalLeaders?.find(leader => leader.nome === chiefForm.nomeLiderPolitico);
    const formData = {
      ...chiefForm,
      id: parseInt(chiefForm.id),
      idGrupoArmado: selectedLeader?.idGrupoArmado || 0,
      numeroDivisao: parseInt(chiefForm.numeroDivisao)
    };
    createChiefMutation.mutate(formData);
  };

  const handleSubmitDivision = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...divisionForm,
      numeroDivisao: parseInt(divisionForm.numeroDivisao),
      idGrupoArmado: parseInt(divisionForm.idGrupoArmado)
    };
    createDivisionMutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Conflict */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Cadastrar Novo Conflito
            </CardTitle>
            <p className="text-sm text-slate-500">Adicione um novo conflito ao sistema</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitConflict} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conflict-id">ID do Conflito</Label>
                  <Input
                    id="conflict-id"
                    value={conflictForm.id}
                    onChange={(e) => setConflictForm(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="Ex: 16"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="conflict-cause">Causa</Label>
                  <Select value={conflictForm.causa} onValueChange={(value) => setConflictForm(prev => ({ ...prev, causa: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a causa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="religioso">Religioso</SelectItem>
                      <SelectItem value="territorial">Territorial</SelectItem>
                      <SelectItem value="econômico">Econômico</SelectItem>
                      <SelectItem value="racial">Racial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="conflict-name">Nome do Conflito</Label>
                <Input
                  id="conflict-name"
                  value={conflictForm.nome}
                  onChange={(e) => setConflictForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Guerra Civil na Síria"
                />
              </div>
              <div>
                <Label htmlFor="conflict-location">Local</Label>
                <Input
                  id="conflict-location"
                  value={conflictForm.lugar}
                  onChange={(e) => setConflictForm(prev => ({ ...prev, lugar: e.target.value }))}
                  placeholder="País/Região"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="conflict-deaths">Total de Mortos</Label>
                  <Input
                    id="conflict-deaths"
                    type="number"
                    value={conflictForm.totalMortos}
                    onChange={(e) => setConflictForm(prev => ({ ...prev, totalMortos: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="conflict-injured">Total de Feridos</Label>
                  <Input
                    id="conflict-injured"
                    type="number"
                    value={conflictForm.totalFeridos}
                    onChange={(e) => setConflictForm(prev => ({ ...prev, totalFeridos: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={createConflictMutation.isPending}>
                {createConflictMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Cadastrar Conflito
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add New Armed Group */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Cadastrar Grupo Armado
            </CardTitle>
            <p className="text-sm text-slate-500">Adicione um novo grupo armado</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitGroup} className="space-y-4">
              <div>
                <Label htmlFor="group-name">Nome do Grupo</Label>
                <Input
                  id="group-name"
                  value={groupForm.nome}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Forças Democráticas da Síria"
                />
              </div>
              <div>
                <Label htmlFor="group-id">ID do Grupo</Label>
                <Input
                  id="group-id"
                  value={groupForm.id}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="Ex: 11"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="group-losses">Número de Baixas</Label>
                <Input
                  id="group-losses"
                  type="number"
                  value={groupForm.numeroBaixas}
                  onChange={(e) => setGroupForm(prev => ({ ...prev, numeroBaixas: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={createGroupMutation.isPending}>
                {createGroupMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Users className="w-4 h-4 mr-2" />
                )}
                Cadastrar Grupo
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add Political Leader */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-600" />
              Cadastrar Líder Político
            </CardTitle>
            <p className="text-sm text-slate-500">Adicione um novo líder político</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitLeader} className="space-y-4">
              <div>
                <Label htmlFor="leader-name">Nome do Líder</Label>
                <Input
                  id="leader-name"
                  value={leaderForm.nome}
                  onChange={(e) => setLeaderForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="leader-group">Grupo Armado</Label>
                <Select value={leaderForm.idGrupoArmado} onValueChange={(value) => setLeaderForm(prev => ({ ...prev, idGrupoArmado: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {armedGroups?.map((group: GrupoArmado) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="leader-support">Tipo de Apoio</Label>
                <Textarea
                  id="leader-support"
                  value={leaderForm.apoio}
                  onChange={(e) => setLeaderForm(prev => ({ ...prev, apoio: e.target.value }))}
                  rows={3}
                  placeholder="Descreva o tipo de apoio político..."
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={createLeaderMutation.isPending}>
                {createLeaderMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Crown className="w-4 h-4 mr-2" />
                )}
                Cadastrar Líder
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add Military Chief */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-red-600" />
              Cadastrar Chefe Militar
            </CardTitle>
            <p className="text-sm text-slate-500">Adicione um novo chefe militar</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitChief} className="space-y-4">
              <div>
                <Label htmlFor="chief-id">ID do Chefe</Label>
                <Input
                  id="chief-id"
                  value={chiefForm.id}
                  onChange={(e) => setChiefForm(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="Ex: 68"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="chief-rank">Faixa Hierárquica</Label>
                <Select value={chiefForm.faixaHierarquica} onValueChange={(value) => setChiefForm(prev => ({ ...prev, faixaHierarquica: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a patente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tenente">Tenente</SelectItem>
                    <SelectItem value="Capitão">Capitão</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Coronel">Coronel</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chief-leader">Líder Político</Label>
                <Select value={chiefForm.nomeLiderPolitico} onValueChange={(value) => setChiefForm(prev => ({ ...prev, nomeLiderPolitico: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um líder" />
                  </SelectTrigger>
                  <SelectContent>
                    {politicalLeaders?.map((leader: LiderPolitico) => (
                      <SelectItem key={leader.nome} value={leader.nome}>
                        {leader.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="chief-division">Divisão</Label>
                <Select value={chiefForm.numeroDivisao} onValueChange={(value) => setChiefForm(prev => ({ ...prev, numeroDivisao: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma divisão" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions?.map((division: Divisao) => (
                      <SelectItem key={division.numeroDivisao} value={division.numeroDivisao.toString()}>
                        Divisão {division.numeroDivisao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={createChiefMutation.isPending}>
                {createChiefMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Star className="w-4 h-4 mr-2" />
                )}
                Cadastrar Chefe
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add Division */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="w-5 h-5 mr-2 text-orange-600" />
              Cadastrar Divisão
            </CardTitle>
            <p className="text-sm text-slate-500">Adicione uma nova divisão ao grupo armado</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitDivision} className="space-y-4">
              <div>
                <Label htmlFor="division-number">Número da Divisão</Label>
                <Input
                  id="division-number"
                  value={divisionForm.numeroDivisao}
                  onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroDivisao: e.target.value }))}
                  placeholder="Ex: 101A"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="division-group">Grupo Armado</Label>
                <Select value={divisionForm.idGrupoArmado} onValueChange={(value) => setDivisionForm(prev => ({ ...prev, idGrupoArmado: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {armedGroups?.map((group: GrupoArmado) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="division-boats">Número de Barcos</Label>
                  <Input
                    id="division-boats"
                    type="number"
                    value={divisionForm.numeroBarcos}
                    onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroBarcos: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="division-tanks">Número de Tanques</Label>
                  <Input
                    id="division-tanks"
                    type="number"
                    value={divisionForm.numeroTanques}
                    onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroTanques: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="division-planes">Número de Aviões</Label>
                  <Input
                    id="division-planes"
                    type="number"
                    value={divisionForm.numeroAvioes}
                    onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroAvioes: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="division-men">Número de Homens</Label>
                  <Input
                    id="division-men"
                    type="number"
                    value={divisionForm.numeroHomens}
                    onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroHomens: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="division-casualties">Número de Baixas</Label>
                <Input
                  id="division-casualties"
                  type="number"
                  value={divisionForm.numeroBaixas}
                  onChange={(e) => setDivisionForm(prev => ({ ...prev, numeroBaixas: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={createDivisionMutation.isPending}>
                {createDivisionMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Layers className="w-4 h-4 mr-2" />
                )}
                Cadastrar Divisão
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
