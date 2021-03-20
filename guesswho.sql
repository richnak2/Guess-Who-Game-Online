-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 07, 2021 at 10:04 PM
-- Server version: 5.6.13
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Table structure for table `games`
--
DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `type` varchar(10) NOT NULL,
  `image` varchar(50) NOT NULL,
  `description` varchar(65) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `title`, `type`, `image`, `description`, `owner_id`, `state`) VALUES
(1, 'Guess Egg', '1 1 1', 'default.png', 'guess the correct egg by  stripes , colors , ornam', 1, 1),
(9, 'Christmas guess', '1 1 1', 'default.png', 'guess the correct christmas tree decoration', 1, 1),
(34, 'Classic game guess', '1 1 1', 'default.png', 'guess image faces', 1, 1),
(35, 'Question type classic game', '1 0 1', 'default.png', 'guess image faces by asking questions', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `game_help_descriptors`
--
DROP TABLE IF EXISTS `game_help_descriptors`;
CREATE TABLE IF NOT EXISTS `game_help_descriptors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_game` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=893 ;

--
-- Dumping data for table `game_help_descriptors`
--

INSERT INTO `game_help_descriptors` (`id`, `id_game`, `type`, `description`, `image`) VALUES
(186, 1, 'color', 'oranzova', 'oranzova.png'),
(187, 1, 'color', 'zelena', 'zelena.png'),
(188, 1, 'color', 'zlta', 'zlta.png'),
(189, 1, 'stripe', 'cikcak', 'cikcak.png'),
(190, 1, 'stripe', 'stripe', 'stripe.png'),
(191, 1, 'stripe', 'vlnky', 'vlnky.png'),
(192, 1, 'pattern', 'bodky', 'bodky.png'),
(193, 1, 'pattern', 'kvetinka', 'kvetinka.png'),
(194, 1, 'pattern', 'srdiecko', 'srdiecko.png'),
(641, 9, 'color', 'zlta', 'zlta.png'),
(642, 9, 'color', 'zelena', 'zelena.png'),
(643, 9, 'color', 'modra', 'modra.png'),
(644, 9, 'color', 'cervena', 'cervena.png'),
(645, 9, 'gloss', 'matna', 'matna.png'),
(646, 9, 'gloss', 'leskla', 'gloss.png'),
(647, 9, 'ornament', 'ornament', 's ornamentom.png'),
(648, 9, 'ornament', 'bez ornamentu', 'bez ornamentu.png'),
(649, 9, 'type', 'zvoncek', 'zvoncek.png'),
(650, 9, 'type', 'hviezda', 'hviezda.png'),
(651, 9, 'type', 'gula', 'gula.png'),
(865, 35, 'accessories', ' has a hair clip', ''),
(866, 35, 'accessories', 'has a earrings', ''),
(867, 35, 'accessories', 'has a glasses', ''),
(868, 35, 'accessories', 'has a necklaces', ''),
(869, 35, 'eyes', 'has a blue eyes ', ''),
(870, 35, 'eyes', 'has a green eyes', ''),
(871, 35, 'eyes', 'has a brown eyes', ''),
(872, 35, 'hair', 'has a grey hair', ''),
(873, 35, 'hair', 'has a brown hair', ''),
(874, 35, 'hair', 'has a ginger hair', ''),
(875, 35, 'hair', 'has a blond hair', ''),
(876, 35, 'hair type', 'is with long hair', ''),
(877, 35, 'hair type', 'is with short hair', ''),
(878, 35, 'hair type', 'is bold', ''),
(879, 34, 'eyes', 'green', 'zelene.png'),
(880, 34, 'eyes', 'brown', 'oranzove.png'),
(881, 34, 'eyes', 'blue', 'modre.png'),
(882, 34, 'hair color', 'grey hair', 'sive.png'),
(883, 34, 'hair color', 'ginger hair', 'rysave.png'),
(884, 34, 'hair color', 'brown hair', 'hnedé.png'),
(885, 34, 'hair color', 'blond hair', 'blond.png'),
(886, 34, 'hair type', 'bold', 'plesaty.png'),
(887, 34, 'hair type', 'short hair', 'kratke.png'),
(888, 34, 'hair type', 'long hair', 'dlhe.png'),
(889, 34, 'accessories', 'paper clip', 'sponky.png'),
(890, 34, 'accessories', 'glases', 'okuliare.png'),
(891, 34, 'accessories', 'earrings', 'nausnice.png'),
(892, 34, 'accessories', 'necklaces', 'nahrdelnik.png');

-- --------------------------------------------------------

--
-- Table structure for table `game_images`
--
DROP TABLE IF EXISTS `game_images`;
CREATE TABLE IF NOT EXISTS `game_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_game` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `description_control` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1216 ;

--
-- Dumping data for table `game_images`
--

INSERT INTO `game_images` (`id`, `id_game`, `image`, `description_control`) VALUES
(448, 1, '1.png', 'oranzova,zlta,cikcak,vlnky'),
(449, 1, '2.png', 'oranzova,zelena,stripe,kvetinka'),
(450, 1, '3.png', 'oranzova,zelena,stripe,vlnky'),
(451, 1, '4.png', 'oranzova,zelena,cikcak'),
(452, 1, '5.png', 'oranzova,stripe'),
(453, 1, '6.png', 'zelena,vlnky'),
(454, 1, '7.png', 'zlta,stripe'),
(455, 1, '8.png', 'oranzova,zlta,vlnky'),
(456, 1, '9.png', 'zelena,zlta,cikcak,stripe'),
(457, 1, '10.png', 'zelena,zlta,cikcak,vlnky'),
(458, 1, '11.png', 'zelena,zlta,stripe,vlnky'),
(459, 1, '12.png', 'oranzova,zlta,stripe,vlnky'),
(460, 1, '13.png', 'oranzova,zelena,cikcak,stripe'),
(461, 1, '14.png', 'oranzova,zlta,cikcak,stripe'),
(462, 1, '15.png', 'oranzova,zelena,cikcak,stripe'),
(463, 1, '17.png', 'oranzova,zelena,zlta,cikcak,stripe,vlnky'),
(464, 1, '18.png', 'oranzova,srdiecko'),
(465, 1, '19.png', 'zelena,bodky'),
(466, 1, '20.png', 'oranzova,kvetinka'),
(467, 1, '21.png', 'oranzova,zelena,bodky,srdiecko'),
(468, 1, '22.png', 'zelena,zlta,kvetinka,srdiecko'),
(469, 1, '23.png', 'oranzova,zlta,bodky,srdiecko'),
(470, 1, '24.png', 'zelena,zlta,vlnky,kvetinka'),
(471, 1, '25.png', 'oranzova,zelena,stripe,srdiecko'),
(472, 1, '26.png', 'oranzova,zlta,cikcak,bodky'),
(473, 1, '27.png', 'zelena,zlta,vlnky,bodky'),
(474, 1, '28.png', 'oranzova,zelena,cikcak,srdiecko'),
(475, 1, '29.png', 'oranzova,zlta,stripe,kvetinka'),
(476, 1, '30.png', 'oranzova,zelena,cikcak,kvetinka'),
(477, 1, '16.png', 'oranzova,zelena,zlta,cikcak,stripe'),
(478, 1, '31.png', 'oranzova,zlta,vlnky,srdiecko'),
(479, 1, '32.png', 'oranzova,zelena,stripe,kvetinka'),
(480, 1, '33.png', 'zelena,zlta,stripe,bodky'),
(481, 1, '34.png', 'oranzova,zlta,cikcak,bodky'),
(482, 1, '35.png', 'oranzova,zelena,zlta,cikcak,vlnky,srdiecko'),
(783, 9, '1.png', 'cervena,leskla,bez ornamentu,gula'),
(784, 9, '2.png', 'cervena,leskla,ornament,gula'),
(785, 9, '3.png', 'cervena,matna,bez ornamentu,gula'),
(786, 9, '4.png', 'cervena,matna,ornament,gula'),
(787, 9, '5.png', 'modra,leskla,bez ornamentu,gula'),
(788, 9, '6.png', 'modra,leskla,ornament,gula'),
(789, 9, '7.png', 'modra,matna,bez ornamentu,gula'),
(790, 9, '8.png', 'modra,matna,ornament,gula'),
(791, 9, '9.png', 'zelena,leskla,bez ornamentu,gula'),
(792, 9, '10.png', 'zelena,leskla,ornament,gula'),
(793, 9, '11.png', 'zelena,matna,gula,bez ornamentu'),
(794, 9, '12.png', 'zelena,matna,ornament,gula'),
(795, 9, '13.png', 'zlta,leskla,bez ornamentu,gula'),
(796, 9, '14.png', 'zlta,leskla,ornament,gula'),
(797, 9, '15.png', 'zlta,matna,bez ornamentu,gula'),
(798, 9, '16.png', 'zlta,matna,ornament,gula'),
(799, 9, '17.png', 'cervena,leskla,bez ornamentu,zvoncek'),
(800, 9, '18.png', 'cervena,leskla,ornament,zvoncek'),
(801, 9, '19.png', 'cervena,matna,bez ornamentu,zvoncek'),
(802, 9, '20.png', 'cervena,matna,ornament,zvoncek'),
(803, 9, '21.png', 'modra,leskla,bez ornamentu,zvoncek'),
(804, 9, '22.png', 'modra,leskla,ornament,zvoncek'),
(805, 9, '23.png', 'modra,matna,bez ornamentu,zvoncek'),
(806, 9, '24.png', 'modra,matna,ornament,zvoncek'),
(807, 9, '25.png', 'zelena,leskla,bez ornamentu,zvoncek'),
(808, 9, '26.png', 'zelena,leskla,ornament,zvoncek'),
(809, 9, '27.png', 'zelena,matna,bez ornamentu,zvoncek'),
(810, 9, '28.png', 'zelena,matna,ornament,zvoncek'),
(811, 9, '29.png', 'zlta,leskla,bez ornamentu,zvoncek'),
(812, 9, '30.png', 'zlta,leskla,ornament,zvoncek'),
(1156, 35, '1.png', 'has a necklaces,has a blue eyes ,has a blond hair,is with long hair'),
(1157, 35, '2.png', ' has a hair clip,has a necklaces,has a blue eyes ,has a blond hair,is with long hair'),
(1158, 35, '3.png', 'has a glasses,has a necklaces,has a green eyes,has a blond hair,is with long hair'),
(1159, 35, '4.png', ' has a hair clip,has a brown eyes,has a blond hair,is with long hair'),
(1160, 35, '5.png', 'has a earrings,has a blue eyes ,has a brown hair,is with long hair'),
(1161, 35, '6.png', ' has a hair clip,has a earrings,has a necklaces,is with long hair'),
(1162, 35, '7.png', 'has a necklaces,has a brown eyes,has a brown hair,is with long hair'),
(1163, 35, '8.png', ' has a hair clip,has a glasses,has a green eyes,has a brown hair,is with long hair'),
(1164, 35, '9.png', 'has a necklaces,has a green eyes,has a ginger hair,is with long hair'),
(1165, 35, '10.png', 'has a glasses,has a necklaces,has a brown eyes,has a ginger hair,is with long hair'),
(1166, 35, '11.png', ' has a hair clip,has a blue eyes ,has a blond hair,is with short hair'),
(1167, 35, '12.png', 'has a earrings,has a brown eyes,has a blond hair,is with short hair'),
(1168, 35, '13.png', 'has a necklaces,has a green eyes,has a brown hair,is with short hair'),
(1169, 35, '14.png', 'has a earrings,has a glasses,has a brown eyes,is with short hair'),
(1170, 35, '15.png', 'has a glasses,has a necklaces,has a blue eyes ,has a ginger hair,is with short hair'),
(1171, 35, '16.png', 'has a glasses,has a necklaces,has a brown eyes,has a grey hair,is with short hair'),
(1172, 35, '17.png', 'has a glasses,has a necklaces,has a blue eyes ,has a grey hair,is with short hair'),
(1173, 35, '18.png', 'has a blue eyes ,has a blond hair,is with short hair'),
(1174, 35, '19.png', 'has a brown eyes,has a blond hair,is with short hair'),
(1175, 35, '20.png', 'has a glasses,has a blue eyes ,has a blond hair,is with short hair'),
(1176, 35, '21.png', 'has a blue eyes ,has a ginger hair,is with short hair'),
(1177, 35, '22.png', 'has a brown eyes,has a brown hair,is with short hair'),
(1178, 35, '23.png', 'has a green eyes,has a brown hair,is with short hair'),
(1179, 35, '24.png', 'has a blue eyes ,is with short hair'),
(1180, 35, '25.png', 'has a glasses,has a grey hair,is with short hair'),
(1181, 35, '26.png', 'has a green eyes,has a grey hair,is with short hair'),
(1182, 35, '27.png', 'has a brown eyes,has a brown hair,is with long hair'),
(1183, 35, '28.png', 'has a blue eyes ,has a blond hair,is with long hair'),
(1184, 35, '29.png', 'has a glasses,has a blue eyes ,is bold'),
(1185, 35, '30.png', 'has a brown eyes,is bold'),
(1186, 34, '1.png', ''),
(1187, 34, '2.png', ''),
(1188, 34, '3.png', ''),
(1189, 34, '4.png', ''),
(1190, 34, '5.png', ''),
(1191, 34, '6.png', ''),
(1192, 34, '7.png', ''),
(1193, 34, '8.png', ''),
(1194, 34, '9.png', ''),
(1195, 34, '10.png', ''),
(1196, 34, '11.png', ''),
(1197, 34, '12.png', ''),
(1198, 34, '13.png', ''),
(1199, 34, '14.png', ''),
(1200, 34, '15.png', ''),
(1201, 34, '16.png', ''),
(1202, 34, '17.png', ''),
(1203, 34, '18.png', ''),
(1204, 34, '19.png', ''),
(1205, 34, '20.png', ''),
(1206, 34, '21.png', ''),
(1207, 34, '22.png', ''),
(1208, 34, '23.png', ''),
(1209, 34, '24.png', ''),
(1210, 34, '25.png', ''),
(1211, 34, '26.png', ''),
(1212, 34, '27.png', ''),
(1213, 34, '28.png', ''),
(1214, 34, '29.png', ''),
(1215, 34, '30.png', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_name` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  `type_of_character` varchar(50) NOT NULL DEFAULT '#00000000 def.png ',
  `bought_characters` varchar(1000) NOT NULL DEFAULT '#00000000 def.png	',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `game_name`, `password`, `role`, `points`, `type_of_character`, `bought_characters`) VALUES
(1, '1234567890', '1234567890', 'Teacher', 368, '#ffffff80 3.png', '#ff00e7ff 1.png #00000000 #d58ffd80 #0013ff80 #ffffff80 8.png 3.png'),
(2, 'student', 'student', 'Student', 0, '0 0 0 0 0 0 0', 'bg-tr def.png '),
(3, 'student1', 'student1', 'Student', 0, '0 0 0 0 0 0 0', 'bg-tr def.png '),
(4, 'Ondrej Ricnkák', '1Deadmouse1', 'Teacher', 0, '0 0 0 0 0 0 0', 'bg-tr def.png '),
(5, 'GUESSER', '1234567890', 'Teacher', 0, '0 0 0 0 0 0 0', 'bg-tr def.png '),
(6, 'r', 'r', 'Student', 0, '0 0 0 0 0 0 0', 'bg-tr def.png '),
(7, 'dsad', '11111', 'Student', 0, '#00000000 def.png ', '#00000000 def.png	'),
(8, 'as', 'as', 'Student', 0, '#00000000 def.png ', '#00000000 def.png	'),
(9, 'asas', 'asas', 'Student', 0, '#00000000 def.png ', '#00000000 def.png	'),
(10, 'a', 'aa', 'Student', 0, '#00000000 def.png ', '#00000000 def.png	');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
