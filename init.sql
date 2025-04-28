
CREATE USER 'crud_user'@'%' IDENTIFIED BY 'tJp6W4tjNn6YtFUXrG^2%F';

GRANT SELECT, INSERT, UPDATE, DELETE ON rental_management.* TO 'crud_user'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON property_metadata.* TO 'crud_user'@'%';

FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS rental_management;
CREATE DATABASE IF NOT EXISTS property_metadata;

-- ----------------------------------------
-- Base de datos rental_management (DB1)
-- ----------------------------------------
USE rental_management;

CREATE TABLE IF NOT EXISTS Apartment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  apartment_type ENUM('corporate', 'tourist') NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status ENUM('active', 'inactive') NOT NULL
);

CREATE TABLE IF NOT EXISTS CorporateRate (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (apartment_id) REFERENCES Apartment(id)
);

CREATE TABLE IF NOT EXISTS TouristRate (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (apartment_id) REFERENCES Apartment(id)
);

INSERT INTO Apartment (name, address, apartment_type, city, country, latitude, longitude, status) VALUES
('Torrenazas', 'Calle Ficticia 1', 'corporate', 'Madrid', 'Spain', 40.421172, -3.668683, 'active'),
('Vinateros', 'Calle Ficticia 2', 'tourist', 'Madrid', 'Spain', 40.410674, -3.654633, 'active'),
('Guzman del Bueno', 'Calle Ficticia 3', 'corporate', 'Madrid', 'Spain', 40.434092, -3.713227, 'active'),
('Balseiro', 'Calle Ficticia 4', 'tourist', 'Madrid', 'Spain', 40.449905, -3.710190, 'active'),
('Maria del Portugal', 'Calle Ficticia 5', 'corporate', 'Madrid', 'Spain', 40.495361, -3.664375, 'active'),
('Vallecas', 'Calle Ficticia 6', 'corporate', 'Madrid', 'Spain', 40.363814, -3.587611, 'active'),
('Botanic', 'Calle Ficticia 7', 'tourist', 'Valencia', 'Spain', 39.471748, -0.385786, 'active'),
('San Ramon', 'Calle Ficticia 8', 'tourist', 'Barcelona', 'Spain', 41.385891, 2.126838, 'active'),
('Badalona', 'Calle Ficticia 9', 'corporate', 'Barcelona', 'Spain', 41.458080, 2.241886, 'active'),
('Miami Gardens', 'Calle Ficticia 10', 'corporate', 'Miami', 'United States', 25.941063, -80.200227, 'active');

INSERT INTO CorporateRate (apartment_id, start_date, end_date, monthly_rate) VALUES
(1, '2025-01-01', '2025-03-31', 3000.00),
(1, '2025-04-01', '2025-12-31', 4000.00),
(3, '2025-01-01', '2025-12-31', 3500.00),
(5, '2025-01-01', '2025-06-30', 3200.00),
(6, '2025-01-01', '2025-12-31', 3100.00),
(9, '2025-01-01', '2025-12-31', 3300.00),
(10, '2025-01-01', '2025-12-31', 5000.00);

INSERT INTO TouristRate (apartment_id, start_date, end_date, daily_rate) VALUES
(2, '2025-01-01', '2025-03-31', 50.00),
(2, '2025-04-01', '2025-12-31', 100.00),
(4, '2025-01-01', '2025-12-31', 75.00),
(7, '2025-01-01', '2025-12-31', 80.00),
(8, '2025-01-01', '2025-12-31', 90.00);

CREATE TABLE IF NOT EXISTS Client (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Reservation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_code VARCHAR(20) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'cancelled') NOT NULL,
  client_id INT NOT NULL,
  apartment_id INT NOT NULL,
  FOREIGN KEY (client_id) REFERENCES Client(id),
  FOREIGN KEY (apartment_id) REFERENCES Apartment(id)
);

CREATE TABLE IF NOT EXISTS Payment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  concept ENUM('rental', 'service_fee', 'booking_fee') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (reservation_id) REFERENCES Reservation(id)
);
-- ----------------------------------------
-- Base de datos property_metadata (DB2)
-- ----------------------------------------
USE property_metadata;

CREATE TABLE IF NOT EXISTS ApartmentExtra (
  apartment_id INT PRIMARY KEY,
  description TEXT,
  image_url VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES rental_management.Apartment(id)
);

INSERT INTO ApartmentExtra (apartment_id, description, image_url) VALUES
(1, 'A modern corporate apartment with a stunning view of the city.', 'https://example.com/images/torrenazas.jpg'),
(2, 'A cozy tourist apartment ideal for short stays in the heart of Madrid.', 'https://example.com/images/vinateros.jpg'),
(3, 'Spacious corporate apartment, perfect for long-term stays in Madrid.', 'https://example.com/images/guzmandelbueno.jpg'),
(4, 'A well-located tourist apartment with easy access to attractions.', 'https://example.com/images/balseiro.jpg'),
(5, 'Quiet corporate apartment with excellent facilities for business travelers.', 'https://example.com/images/mariadelportugal.jpg'),
(6, 'Corporate apartment close to transport links in Madrid.', 'https://example.com/images/vallecas.jpg'),
(7, 'Charming tourist apartment in the botanical gardens area.', 'https://example.com/images/botanic.jpg'),
(8, 'Comfortable tourist apartment with excellent views of Barcelona.', 'https://example.com/images/sanramon.jpg'),
(9, 'Corporate apartment in the heart of Barcelona, ideal for business trips.', 'https://example.com/images/badalona.jpg'),
(10, 'Luxury corporate apartment in Miami Gardens, perfect for executives.', 'https://example.com/images/miamigardens.jpg');
