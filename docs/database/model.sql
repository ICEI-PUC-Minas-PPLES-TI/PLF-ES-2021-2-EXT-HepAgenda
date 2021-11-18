-- MySQL Script generated by MySQL Workbench
-- Sun Oct  3 19:37:16 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema agenda
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema agenda
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `agenda` DEFAULT CHARACTER SET utf8 ;
USE `agenda` ;

-- -----------------------------------------------------
-- Table `agenda`.`paciente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`paciente` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(120) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `registro_hc` VARCHAR(20) NULL,
  `sexo` ENUM('M', 'F') NOT NULL,
  `telefone` VARCHAR(15) NOT NULL,
  `nome_mae` VARCHAR(120) NOT NULL,
  `email` VARCHAR(50) NULL,
  `peso` DOUBLE NULL,
  `peso_atualizacao` TIMESTAMP NULL,
  `altura` DOUBLE NULL,
  `comorbidade` ENUM('HEPB', 'HEPC', 'HEPBC' 'OUTRO') NULL,
  `ativo` TINYINT(1) DEFAULT 1
  `desfecho` TINYINT(1) NULL COMMENT '1- ALTA DO SERVIÇO PÓS RVS\n2-ALTA POR OUTROS MOTIVOS 3- ACOMPANHAMENTO  SEMESTRAL OU ANUAL\n3- HCC\n4- ÓBITO\n5- RVS PARA VÍRUS C (CIRRÓTICO CONSULTAS ANUAIS OU SEMESTRAIS)\n6-ABANDONO',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`tratamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`tratamento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `identificacao` VARCHAR(30) NOT NULL,
  `direcionado` ENUM('HEPB', 'HEPC', 'OUTRO') NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`paciente_hepb`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`paciente_hepb` (
  `paciente_id` INT UNSIGNED NOT NULL,
  `cirrotico` TINYINT(1) NOT NULL,
  `portador_inativo` TINYINT(1) NOT NULL,
  `fibrose` ENUM('F0', 'F1', 'F2', 'F3', 'F4', 'F5') NULL,
  `tratamento_id` INT NULL,
  `inicio_tratamento` DATE NULL COMMENT 'DATA DE INÍCIO DO TRATAMENTO COM ANTIRETROVIRAL',
  `ultimo_resultado_alfa` DOUBLE NULL COMMENT 'ULTIMO RESULTADO DE ALFAFETOPROTEINA',
  `data_alfa` DATE NULL,
  `ultimo_resultado_ultra` VARCHAR(200) NULL COMMENT 'ULTIMO RESULTADO DE ULTRASSOM',
  `data_ultra` DATE NULL,
  `ultimo_resultado_carga` DOUBLE NULL,
  `data_carga` DATE NULL,
  `hbeag` TINYINT(1) NULL,
  `data_hbeag` DATE NULL,
  PRIMARY KEY (`paciente_id`),
  INDEX `fk_paciente_hepb_tratamento1_idx` (`tratamento_id` ASC) VISIBLE,
  CONSTRAINT `fk_paciente_hepb_paciente`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `agenda`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_paciente_hepb_tratamento1`
    FOREIGN KEY (`tratamento_id`)
    REFERENCES `agenda`.`tratamento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`paciente_hepc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`paciente_hepc` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` INT UNSIGNED NOT NULL,
  `cirrotico` TINYINT(1) NOT NULL,
  `fibrose` ENUM('F0', 'F1', 'F2', 'F3', 'F4', 'F5') NULL,
  `tratado` TINYINT(1) NULL,
  `tratamento_id` INT NULL,
  `num_tratamentos` TINYINT UNSIGNED NULL,
  `ultimo_resultado_alfa` DOUBLE NULL COMMENT 'ULTIMO RESULTADO DE ALFAFETOPROTEINA',
  `data_alfa` DATE NULL,
  `ultimo_resultado_ultra` VARCHAR(200) NULL COMMENT 'ULTIMO RESULTADO DE ULTRASSOM',
  `data_ultra` DATE NULL,
  `ultimo_resultado_carga` DOUBLE NULL,
  `data_carga` DATE NULL,
  INDEX `fk_paciente_hepc_paciente1_idx` (`paciente_id` ASC) VISIBLE,
  INDEX `fk_paciente_hepc_tratamento1_idx` (`tratamento_id` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_paciente_hepc_paciente1`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `agenda`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_paciente_hepc_tratamento1`
    FOREIGN KEY (`tratamento_id`)
    REFERENCES `agenda`.`tratamento` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`usuario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(30) NULL,
  `nome` VARCHAR(120) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `telefone` VARCHAR(15) NULL,
  `senha` VARCHAR(64) NOT NULL,
  `data_excluido` TIMESTAMP NULL,
  `data_expira` TIMESTAMP NULL,
  `tipo` ENUM('A', 'M', 'V') NOT NULL DEFAULT 'V' COMMENT 'Admin\nMedico\nVisualizador',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`consulta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`consulta` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` INT UNSIGNED NOT NULL,
  `descricao` VARCHAR(60) NULL,
  `status` ENUM('AGUARDANDOC', 'AGUARDANDOA', 'REALIZADO', 'CANCELADO') NOT NULL,
  `detalhes` TEXT NULL,
  `dt_inicio` DATE NOT NULL,
  `dt_desmarcada` TIMESTAMP NULL,
  `usuario_id_criador` INT UNSIGNED NOT NULL,
  `usuario_id_medico` INT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_consulta_paciente1_idx` (`paciente_id` ASC) VISIBLE,
  INDEX `fk_consulta_usuario1_idx` (`usuario_id_criador` ASC) VISIBLE,
  INDEX `fk_consulta_usuario2_idx` (`usuario_id_medico` ASC) VISIBLE,
  CONSTRAINT `fk_consulta_paciente1`
    FOREIGN KEY (`paciente_id`)
    REFERENCES `agenda`.`paciente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_consulta_usuario1`
    FOREIGN KEY (`usuario_id_criador`)
    REFERENCES `agenda`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_consulta_usuario2`
    FOREIGN KEY (`usuario_id_medico`)
    REFERENCES `agenda`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`arquivo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`arquivo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `consulta_id` INT UNSIGNED NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `link` VARCHAR(120) NOT NULL,
  `data_criado` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_arquivos_consulta1_idx` (`consulta_id` ASC) VISIBLE,
  CONSTRAINT `fk_arquivos_consulta1`
    FOREIGN KEY (`consulta_id`)
    REFERENCES `agenda`.`consulta` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`bloqueio_diasemana`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`bloqueio_diasemana` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `dia_semana` TINYINT(1) NOT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`bloqueio_data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`bloqueio_data` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  `usuario_id_criador` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`, `usuario_id_criador`),
  INDEX `fk_bloqueio_diasemana_usuario1_idx` (`usuario_id_criador` ASC) VISIBLE,
  CONSTRAINT `fk_bloqueio_diasemana_usuario10`
    FOREIGN KEY (`usuario_id_criador`)
    REFERENCES `agenda`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `agenda`.`log_consulta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`.`log_consulta` (
  `id` INT NOT NULL,
  `data` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descricao` VARCHAR(100) NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `consulta_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_log_consulta_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_log_consulta_consulta1_idx` (`consulta_id` ASC) VISIBLE,
  CONSTRAINT `fk_log_consulta_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `agenda`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_log_consulta_consulta1`
    FOREIGN KEY (`consulta_id`)
    REFERENCES `agenda`.`consulta` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
