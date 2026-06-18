-- Script d'initialisation de la base de données Aiven (defaultdb)
-- À exécuter UNE SEULE FOIS directement sur la base de données Aiven

USE defaultdb;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `prenom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `date_naissance` DATE NOT NULL,
  `ville` VARCHAR(100) NOT NULL,
  `code_postal` CHAR(5) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
