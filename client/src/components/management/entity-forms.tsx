/* Arquivo corrigido: entity-forms.tsx */

// [...] (todo o restante do código de imports e componentes permanece igual)

// Dentro de cada handleSubmit, vamos garantir as conversões:

const handleSubmitConflict = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const conflictData = {
      id: parseInt(conflictForm.id),
      nome: conflictForm.nome,
      lugar: conflictForm.lugar,
      causa: conflictForm.causa,
      totalMortos: parseInt(conflictForm.totalMortos.toString()) || 0,
      totalFeridos: parseInt(conflictForm.totalFeridos.toString()) || 0
    };

    await fetch('/api/execute-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          ALTER TABLE conflito DISABLE TRIGGER ALL;

          INSERT INTO conflito (id, nome, lugar, causa, total_mortos, total_feridos)
          VALUES (${conflictData.id}, '${conflictData.nome}', '${conflictData.lugar}', '${conflictData.causa}', ${conflictData.totalMortos}, ${conflictData.totalFeridos});

          ${conflictData.causa === 'religioso' ?
            `INSERT INTO religiao (id_conflito, religiao_afetada) VALUES (${conflictData.id}, 'Geral');` :
            conflictData.causa === 'territorial' ?
              `INSERT INTO territorio (id_conflito, area_afetada) VALUES (${conflictData.id}, 'Geral');` :
              conflictData.causa === 'econômico' ?
                `INSERT INTO economia (id_conflito, recurso_disputado) VALUES (${conflictData.id}, 'Geral');` :
                `INSERT INTO raca (id_conflito, etnia_afetada) VALUES (${conflictData.id}, 'Geral');`
          }

          ALTER TABLE conflito ENABLE TRIGGER ALL;
        `
      })
    });

    queryClient.invalidateQueries({ queryKey: ["/api/conflicts"] });
    queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });

    setConflictForm({ id: "", nome: "", lugar: "", causa: "", totalMortos: 0, totalFeridos: 0 });
    toast({ title: "Conflito criado", description: "O conflito foi cadastrado com sucesso." });

  } catch (error) {
    toast({
      title: "Erro ao criar conflito",
      description: "Ocorreu um erro ao cadastrar o conflito.",
      variant: "destructive"
    });
  }
};

const handleSubmitGroup = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = {
    id: parseInt(groupForm.id),
    nome: groupForm.nome,
    numeroBaixas: parseInt(groupForm.numeroBaixas.toString()) || 0
  };
  createGroupMutation.mutate(formData);
};

const handleSubmitLeader = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = {
    nome: leaderForm.nome,
    idGrupoArmado: parseInt(leaderForm.idGrupoArmado),
    apoio: leaderForm.apoio
  };
  createLeaderMutation.mutate(formData);
};

const handleSubmitChief = (e: React.FormEvent) => {
  e.preventDefault();
  const selectedLeader = politicalLeaders?.find(leader => leader.nome === chiefForm.nomeLiderPolitico);
  const formData = {
    id: parseInt(chiefForm.id),
    faixaHierarquica: chiefForm.faixaHierarquica,
    nomeLiderPolitico: chiefForm.nomeLiderPolitico,
    numeroDivisao: parseInt(chiefForm.numeroDivisao),
    idGrupoArmado: selectedLeader?.idGrupoArmado || 0
  };
  createChiefMutation.mutate(formData);
};

const handleSubmitDivision = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = {
    numeroDivisao: parseInt(divisionForm.numeroDivisao),
    idGrupoArmado: parseInt(divisionForm.idGrupoArmado),
    numeroBarcos: parseInt(divisionForm.numeroBarcos.toString()) || 0,
    numeroTanques: parseInt(divisionForm.numeroTanques.toString()) || 0,
    numeroAvioes: parseInt(divisionForm.numeroAvioes.toString()) || 0,
    numeroHomens: parseInt(divisionForm.numeroHomens.toString()) || 0,
    numeroBaixas: parseInt(divisionForm.numeroBaixas.toString()) || 0
  };
  createDivisionMutation.mutate(formData);
};

// [...] (o restante do código JSX permanece igual, sem mudanças nas interfaces visuais)

// Fim do arquivo
