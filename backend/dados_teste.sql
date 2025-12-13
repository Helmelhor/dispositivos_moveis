-- 🧪 SCRIPT DE DADOS DE TESTE PARA PUBLICAÇÃO DE AULAS
-- Insira esses dados para testar a funcionalidade

-- 1. Criar disciplinas (se não existirem)
INSERT INTO subjects (name, description, category, icon) VALUES
('Matemática', 'Disciplina de Matemática', 'Exatas', '🔢'),
('Português', 'Disciplina de Português', 'Humanas', '📖'),
('História', 'Disciplina de História', 'Humanas', '📚'),
('Física', 'Disciplina de Física', 'Exatas', '⚡'),
('Química', 'Disciplina de Química', 'Exatas', '🧪'),
('Biologia', 'Disciplina de Biologia', 'Ciências', '🧬'),
('Programação', 'Disciplina de Programação', 'Tecnologia', '💻'),
('Inglês', 'Disciplina de Inglês', 'Idiomas', '🌍')
ON CONFLICT DO NOTHING;

-- 2. Criar usuários de teste (voluntários)
INSERT INTO users (email, password_hash, name, role, status, is_online_available, is_presencial_available) VALUES
('voluntario1@test.com', 'hash_seguro_123', 'João Silva', 'volunteer', 'active', 1, 1),
('voluntario2@test.com', 'hash_seguro_456', 'Maria Santos', 'volunteer', 'active', 1, 0),
('voluntario3@test.com', 'hash_seguro_789', 'Pedro Oliveira', 'volunteer', 'active', 0, 1),
('aprendiz@test.com', 'hash_seguro_999', 'Carlos Aprendiz', 'learner', 'active', 1, 1)
ON CONFLICT DO NOTHING;

-- 3. Criar perfis de voluntário
INSERT INTO volunteers (user_id, volunteer_type, institution, total_points, total_lessons) 
SELECT id, 'teacher', 'USP', 0, 0 FROM users WHERE email = 'voluntario1@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO volunteers (user_id, volunteer_type, institution, total_points, total_lessons)
SELECT id, 'teacher', 'UFRJ', 0, 0 FROM users WHERE email = 'voluntario2@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO volunteers (user_id, volunteer_type, institution, total_points, total_lessons)
SELECT id, 'student', 'Colégio XYZ', 0, 0 FROM users WHERE email = 'voluntario3@test.com'
ON CONFLICT DO NOTHING;

-- 4. Vincular voluntários a disciplinas
INSERT INTO volunteer_subjects (volunteer_id, subject_id)
SELECT v.id, s.id FROM volunteers v, subjects s 
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario1@test.com')
AND s.name IN ('Matemática', 'Física')
ON CONFLICT DO NOTHING;

INSERT INTO volunteer_subjects (volunteer_id, subject_id)
SELECT v.id, s.id FROM volunteers v, subjects s
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario2@test.com')
AND s.name IN ('Português', 'História')
ON CONFLICT DO NOTHING;

INSERT INTO volunteer_subjects (volunteer_id, subject_id)
SELECT v.id, s.id FROM volunteers v, subjects s
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario3@test.com')
AND s.name IN ('Programação', 'Inglês')
ON CONFLICT DO NOTHING;

-- 5. Criar aulas publicadas de teste (OPCIONAL - apenas para referência)
-- Descomente abaixo se quiser inserir dados direto no banco
/*
INSERT INTO published_lessons (volunteer_id, subject_id, title, description, media_type, views_count, likes_count) 
SELECT v.id, 
       (SELECT id FROM subjects WHERE name = 'Matemática'),
       'Introdução a Álgebra Linear',
       'Nesta aula abordaremos os conceitos fundamentais de álgebra linear, matrizes e vetores.',
       'video',
       42,
       15
FROM volunteers v
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario1@test.com');

INSERT INTO published_lessons (volunteer_id, subject_id, title, description, media_type, views_count, likes_count)
SELECT v.id,
       (SELECT id FROM subjects WHERE name = 'Português'),
       'Análise de Literatura Brasileira',
       'Análise dos principais autores e obras da literatura brasileira moderna.',
       'video',
       38,
       12
FROM volunteers v
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario2@test.com');

INSERT INTO published_lessons (volunteer_id, subject_id, title, description, media_type, views_count, likes_count)
SELECT v.id,
       (SELECT id FROM subjects WHERE name = 'Programação'),
       'JavaScript Avançado: Promises e Async/Await',
       'Aprenda a programação assíncrona em JavaScript com Promises e Async/Await.',
       'pdf',
       56,
       23
FROM volunteers v
WHERE v.user_id = (SELECT id FROM users WHERE email = 'voluntario3@test.com');
*/

-- 6. Verificar dados inseridos
SELECT 'USUÁRIOS' as categoria;
SELECT id, email, name, role FROM users WHERE role = 'volunteer';

SELECT '' as espaco;
SELECT 'VOLUNTÁRIOS' as categoria;
SELECT v.id, u.name, u.email, COUNT(vs.subject_id) as disciplinas
FROM volunteers v
JOIN users u ON v.user_id = u.id
LEFT JOIN volunteer_subjects vs ON v.id = vs.volunteer_id
GROUP BY v.id;

SELECT '' as espaco;
SELECT 'DISCIPLINAS' as categoria;
SELECT id, name, category, icon FROM subjects LIMIT 8;

-- 7. Queries úteis para testes
-- Obter ID do voluntário
-- SELECT id FROM volunteers WHERE user_id = (SELECT id FROM users WHERE email = 'voluntario1@test.com');

-- Obter ID da disciplina
-- SELECT id FROM subjects WHERE name = 'Matemática';

-- Listar todas as aulas publicadas
-- SELECT * FROM published_lessons;

-- Listar aulas de um voluntário específico
-- SELECT * FROM published_lessons WHERE volunteer_id = 1;

-- Listar aulas de uma disciplina
-- SELECT * FROM published_lessons WHERE subject_id = 1;

-- Atualizar views
-- UPDATE published_lessons SET views_count = views_count + 1 WHERE id = 1;

-- Atualizar likes
-- UPDATE published_lessons SET likes_count = likes_count + 1 WHERE id = 1;
