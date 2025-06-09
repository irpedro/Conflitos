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
EXECUTE FUNCTION atualizar_total_baixas_grupo();

--============================================================================================

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

--============================================================================================

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
EXECUTE FUNCTION gerar_numero_divisao_sequencial();

--============================================================================================