-- Exemples de défis à insérer dans la table challenges
-- Ces défis couvrent tous les domaines et niveaux de difficulté

INSERT INTO challenges (title, description, domain, level, estimated_minutes, difficulty_score) VALUES
-- Social / Débutant
('Dire bonjour à un inconnu', 'Dis bonjour à une personne que tu croises dans la rue ou dans un magasin', 'social', 'beginner', 1, 2),
('Complimenter quelqu''un', 'Fais un compliment sincère à une personne de ton entourage', 'social', 'beginner', 2, 2),
('Demander l''heure', 'Demande l''heure à un inconnu dans la rue', 'social', 'beginner', 1, 1),

-- Social / Intermédiaire
('Engager une conversation', 'Démarre une conversation de 5 minutes avec un collègue que tu connais peu', 'social', 'intermediate', 5, 5),
('Participer à un événement', 'Va à un événement social (meetup, conférence, etc.) et parle à au moins 2 personnes', 'social', 'intermediate', 60, 6),
('Appeler un ami', 'Appelle un ami ou un membre de ta famille que tu n''as pas contacté depuis longtemps', 'social', 'intermediate', 10, 4),

-- Social / Spicy
('Parler à un groupe', 'Approche un groupe de personnes et engage la conversation', 'social', 'spicy', 10, 8),
('Faire un discours improvisé', 'Fais un mini-discours de 2 minutes sur un sujet qui te passionne devant des amis', 'social', 'spicy', 5, 9),

-- Confiance / Débutant
('Dire non à une demande', 'Dis non poliment à une demande qui ne te convient pas', 'confidence', 'beginner', 1, 2),
('Exprimer une opinion', 'Exprime une opinion différente dans une conversation', 'confidence', 'beginner', 2, 3),
('Porter quelque chose de différent', 'Porte un vêtement ou accessoire que tu n''oses pas habituellement', 'confidence', 'beginner', 1, 2),

-- Confiance / Intermédiaire
('Partager une vulnérabilité', 'Partage quelque chose de personnel avec un proche', 'confidence', 'intermediate', 10, 6),
('Prendre la parole en réunion', 'Exprime ton avis dans une réunion ou discussion de groupe', 'confidence', 'intermediate', 5, 5),
('Demander de l''aide', 'Demande de l''aide à quelqu''un pour quelque chose que tu pourrais faire seul', 'confidence', 'intermediate', 5, 4),

-- Confiance / Spicy
('Parler en public', 'Fais une présentation ou un discours devant un groupe', 'confidence', 'spicy', 15, 9),
('Confronter un conflit', 'Aborde directement un conflit ou malentendu avec quelqu''un', 'confidence', 'spicy', 20, 8),

-- Nouveauté / Débutant
('Essayer un nouveau café', 'Va dans un café ou restaurant que tu n''as jamais visité', 'novelty', 'beginner', 15, 2),
('Prendre un chemin différent', 'Prends un chemin différent pour aller au travail ou faire tes courses', 'novelty', 'beginner', 5, 1),
('Écouter un nouveau genre musical', 'Écoute un album d''un genre musical que tu ne connais pas', 'novelty', 'beginner', 30, 2),

-- Nouveauté / Intermédiaire
('Apprendre une nouvelle compétence', 'Passe 30 minutes à apprendre quelque chose de nouveau (langue, instrument, etc.)', 'novelty', 'intermediate', 30, 5),
('Visiter un nouveau quartier', 'Explore un quartier de ta ville que tu ne connais pas', 'novelty', 'intermediate', 60, 4),
('Essayer une nouvelle activité', 'Inscris-toi à un cours ou activité que tu n''as jamais essayée', 'novelty', 'intermediate', 60, 6),

-- Nouveauté / Spicy
('Voyager seul', 'Fais un voyage d''une journée seul dans une ville proche', 'novelty', 'spicy', 480, 9),
('Essayer un sport extrême', 'Essaie une activité physique que tu n''as jamais osé faire', 'novelty', 'spicy', 120, 8),

-- Procrastination / Débutant
('Faire une tâche repoussée', 'Fais une petite tâche que tu repousses depuis plus d''une semaine', 'procrastination', 'beginner', 15, 2),
('Ranger un espace', 'Range un tiroir, une étagère ou un coin de ta maison', 'procrastination', 'beginner', 10, 2),
('Répondre à un email', 'Réponds à un email que tu as laissé en attente', 'procrastination', 'beginner', 5, 1),

-- Procrastination / Intermédiaire
('Commencer un projet', 'Commence un projet que tu repousses depuis des mois', 'procrastination', 'intermediate', 60, 6),
('Faire un appel administratif', 'Fais cet appel administratif que tu repousses', 'procrastination', 'intermediate', 15, 4),
('Nettoyer en profondeur', 'Fais un grand nettoyage d''une pièce ou d''un espace', 'procrastination', 'intermediate', 120, 5),

-- Procrastination / Spicy
('Terminer un projet abandonné', 'Reprends et termine un projet que tu as abandonné', 'procrastination', 'spicy', 180, 8),
('Faire un changement majeur', 'Prends une décision importante que tu repousses depuis longtemps', 'procrastination', 'spicy', 60, 9),

-- Physique / Débutant
('Faire 10 minutes d''exercice', 'Fais 10 minutes d''exercice physique (marche, étirements, etc.)', 'physical', 'beginner', 10, 2),
('Prendre les escaliers', 'Prends les escaliers au lieu de l''ascenseur toute la journée', 'physical', 'beginner', 5, 1),
('Faire une promenade', 'Fais une promenade de 20 minutes dehors', 'physical', 'beginner', 20, 2),

-- Physique / Intermédiaire
('Faire une séance de sport', 'Fais une vraie séance de sport (30-45 min)', 'physical', 'intermediate', 45, 5),
('Essayer un nouveau sport', 'Essaie un sport ou activité physique que tu n''as jamais fait', 'physical', 'intermediate', 60, 6),
('Faire du yoga ou méditation', 'Fais une séance de yoga ou méditation de 20 minutes', 'physical', 'intermediate', 20, 4),

-- Physique / Spicy
('Faire un défi physique', 'Fais un défi physique intense (course, randonnée, etc.)', 'physical', 'spicy', 120, 8),
('Participer à une compétition', 'Inscris-toi et participe à une compétition sportive', 'physical', 'spicy', 180, 9);

