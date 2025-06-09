-- Script completo para correção no Railway
-- Execute este script para corrigir todos os problemas identificados

-- 1. Corrigir estrutura da tabela chefe_militar
ALTER TABLE chefe_militar DROP COLUMN IF EXISTS id_grupo_armado;

-- 2. Corrigir valores de causa nos conflitos  
UPDATE conflito SET causa = 'territorial' WHERE causa = 'territoria';

-- 3. Limpar e recriar dados da tabela chefe_militar
DELETE FROM chefe_militar;

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

-- 4. Criar trigger para limitar 3 chefes por divisão
CREATE OR REPLACE FUNCTION limita_chefe_por_divisao()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM chefe_militar WHERE numero_divisao = NEW.numero_divisao) >= 3 THEN
        RAISE EXCEPTION 'A divisão escolhida já tem o máximo de 3 chefes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_limita_chefe_por_divisao ON chefe_militar;
CREATE TRIGGER trigger_limita_chefe_por_divisao
    BEFORE INSERT ON chefe_militar
    FOR EACH ROW
    EXECUTE FUNCTION limita_chefe_por_divisao();