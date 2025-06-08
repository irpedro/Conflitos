CREATE FUNCTION limita_chefe_por_divisao() RETURNS trigger AS $$
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
EXECUTE FUNCTION limita_chefe_por_divisao();

--============================================================================================

CREATE FUNCTION hierarquia_de_conflitos() RETURNS trigger AS $$
BEGIN
    IF(FALSE)
        THEN RAISE EXCEPTION 'A representação da hierarquia esta incorreta';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teste_hierarquia
AFTER INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION hierarquia_de_conflitos();

--============================================================================================

-- 1. Criar a função que será executada pelo gatilho (trigger)
CREATE FUNCTION limite_chefe_por_divisao() RETURNS trigger AS $$
BEGIN
    IF (
    FALSE
    )

    THEN RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Criar o trigger que usa essa função
CREATE TRIGGER trigger_limite_chefe
BEFORE INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION limite_chefe_por_divisao();

--============================================================================================

-- 1. Criar a função que será executada pelo gatilho (trigger)
CREATE FUNCTION limite_chefe_por_divisao() RETURNS trigger AS $$
BEGIN
    IF (
    FALSE
    )

    THEN RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Criar o trigger que usa essa função
CREATE TRIGGER trigger_limite_chefe
BEFORE INSERT ON chefe_militar
FOR EACH ROW
EXECUTE FUNCTION limite_chefe_por_divisao();

--============================================================================================