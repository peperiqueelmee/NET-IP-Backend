--
-- Table structure for table `departments`
--
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL DEFAULT 'HHRR',
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `departments`
--
INSERT INTO `departments` VALUES (1,'Recursos Humanos'),(2,'Contabilidad'),(3,'Administración'),(4,'Ventas');

--
-- Table structure for table `restrictions`
--
DROP TABLE IF EXISTS `restrictions`;
CREATE TABLE `restrictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(50) NOT NULL DEFAULT 'No posee Restricciones',
  PRIMARY KEY (`id`)
);
INSERT INTO `restrictions` VALUES (1,'No posee Restricciones'),(2,'Llamada de ingreso Restringidas'),(3,'Sólo recibe llamadas');

--
-- Table structure for table `roles`
--
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL DEFAULT 'Sin Rol Asignado',
  PRIMARY KEY (`id`)
);
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Supervisor');

--
-- Table structure for table `statuses`
--
DROP TABLE IF EXISTS `statuses`;
CREATE TABLE `statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL DEFAULT 'Sin Estado Asignado',
  PRIMARY KEY (`id`)
);
INSERT INTO `statuses` VALUES (1,'Activo'),(2,'Inactivo'),(3,'Bloqueado');

--
-- Table structure for table `sys_events`
--
DROP TABLE IF EXISTS `sys_events`;
CREATE TABLE `sys_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO `sys_events` VALUES (1,'Creación'),(2,'Modificación'),(3,'Eliminación');

--
-- Table structure for table `transport_types`
--
DROP TABLE IF EXISTS `transport_types`;
CREATE TABLE `transport_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL DEFAULT 'UDP',
  PRIMARY KEY (`id`)
);
INSERT INTO `transport_types` VALUES (1,'UDP'),(2,'TCP'),(3,'UDP/TCP');

--
-- Table structure for table `employees`
--
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(10) NOT NULL,
  `names` varchar(60) NOT NULL,
  `lastnames` varchar(60) NOT NULL,
  `status_id` int NOT NULL DEFAULT '1',
  `role_id` int NOT NULL,
  `email` varchar(60) NOT NULL,
  `username` varchar(20) NOT NULL,
  `emp_password` varchar(150) NOT NULL,
  `token` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `status_id` (`status_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
);


--
-- Table structure for table `intercoms`
--
DROP TABLE IF EXISTS `intercoms`;
CREATE TABLE `intercoms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `password` varchar(150) NOT NULL,
  `intercom_caller` int DEFAULT NULL,
  `transport_id` int NOT NULL,
  `restrictions_id` int NOT NULL,
  `status_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `intercom_number` (`number`),
  KEY `restrictions_id` (`restrictions_id`),
  KEY `intercoms_ibfk_4` (`status_id`),
  KEY `intercoms_ibfk_1` (`transport_id`),
  CONSTRAINT `intercoms_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_types` (`id`),
  CONSTRAINT `intercoms_ibfk_3` FOREIGN KEY (`restrictions_id`) REFERENCES `restrictions` (`id`),
  CONSTRAINT `intercoms_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
);

--
-- Table structure for table `log`
--
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `log_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `log_description` varchar(120) NOT NULL,
  `employee_id` int NOT NULL,
  `event_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `log_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `log_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `sys_events` (`id`)
);

--
-- Table structure for table `multi_call_ringing`
--
DROP TABLE IF EXISTS `multi_call_ringing`;
CREATE TABLE `multi_call_ringing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `password` varchar(150) NOT NULL,
  `transport_id` int NOT NULL,
  `departments_id` int NOT NULL,
  `restrictions_id` int NOT NULL DEFAULT '1',
  `status_id` int NOT NULL DEFAULT '1',
  `mcr_call_anexes` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mcr_number` (`number`),
  KEY `transport_id` (`transport_id`),
  KEY `departments_id` (`departments_id`),
  KEY `restrictions_id` (`restrictions_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `multi_call_ringing_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_types` (`id`),
  CONSTRAINT `multi_call_ringing_ibfk_2` FOREIGN KEY (`departments_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `multi_call_ringing_ibfk_3` FOREIGN KEY (`restrictions_id`) REFERENCES `restrictions` (`id`),
  CONSTRAINT `multi_call_ringing_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
);

--
-- Table structure for table `regular_anexes`
--
DROP TABLE IF EXISTS `regular_anexes`;
CREATE TABLE `regular_anexes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `password` varchar(150) NOT NULL,
  `transport_id` int NOT NULL,
  `departments_id` int NOT NULL,
  `restrictions_id` int NOT NULL DEFAULT '1',
  `status_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `anex_number` (`number`),
  KEY `transport_id` (`transport_id`),
  KEY `departments_id` (`departments_id`),
  KEY `regular_anexes_ibfk_4` (`restrictions_id`),
  KEY `regular_anexes_ibfk_5` (`status_id`),
  CONSTRAINT `regular_anexes_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_types` (`id`),
  CONSTRAINT `regular_anexes_ibfk_3` FOREIGN KEY (`departments_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `regular_anexes_ibfk_4` FOREIGN KEY (`restrictions_id`) REFERENCES `restrictions` (`id`),
  CONSTRAINT `regular_anexes_ibfk_5` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
);

--
-- Table structure for table `troncals`
--
DROP TABLE IF EXISTS `troncals`;
CREATE TABLE `troncals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `transport_id` int NOT NULL,
  `restrictions_id` int NOT NULL DEFAULT '3',
  `status_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`),
  KEY `transport_id` (`transport_id`),
  KEY `restrictions_id` (`restrictions_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `troncals_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_types` (`id`),
  CONSTRAINT `troncals_ibfk_2` FOREIGN KEY (`restrictions_id`) REFERENCES `restrictions` (`id`),
  CONSTRAINT `troncals_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
);