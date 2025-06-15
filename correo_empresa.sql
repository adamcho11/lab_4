-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 21-05-2025 a las 22:56:00
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `correo_empresa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correos`
--

CREATE TABLE `correos` (
  `id` int(11) NOT NULL,
  `remitente_id` int(11) DEFAULT NULL,
  `destinatario_id` int(11) DEFAULT NULL,
  `asunto` varchar(200) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `estado` enum('enviado','borrador','pendiente') DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `eliminado_dest` tinyint(1) DEFAULT 0,
  `eliminado_rem` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `rol` enum('admin','usuario') DEFAULT NULL,
  `estado` enum('activo','suspendido') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `rol`, `estado`) VALUES
(1, 'admin@grupo5.com', 'grupo5', 'admin', 'activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `correos`
--
ALTER TABLE `correos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `remitente_id` (`remitente_id`),
  ADD KEY `destinatario_id` (`destinatario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `correos`
--
ALTER TABLE `correos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `correos`
--
ALTER TABLE `correos`
  ADD CONSTRAINT `correos_ibfk_1` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `correos_ibfk_2` FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
