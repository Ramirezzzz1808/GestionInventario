-- Crear base de datos
CREATE DATABASE XWYInventarioDB;
GO
USE XWYInventarioDB;
GO

-- Tabla Rol
CREATE TABLE Roles (
    Id INT PRIMARY KEY IDENTITY,
    Nombre VARCHAR(50) NOT NULL
);

-- Tabla Usuario
CREATE TABLE Usuarios (
    Id INT PRIMARY KEY IDENTITY,
    Nombre VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Contraseña VARCHAR(200),
    RolId INT,
    FOREIGN KEY (RolId) REFERENCES Roles(Id)
);

-- Tabla Articulo
CREATE TABLE Articulos (
    Id INT PRIMARY KEY IDENTITY,
    Codigo VARCHAR(50) UNIQUE,
    Nombre VARCHAR(100),
    Categoria VARCHAR(100),
    Estado VARCHAR(50),
    Ubicacion VARCHAR(100)
);

-- Tabla Prestamo
CREATE TABLE Prestamos (
    Id INT PRIMARY KEY IDENTITY,
    UsuarioId INT,
    ArticuloId INT,
    FechaSolicitud DATETIME,
    FechaEntrega DATETIME NULL,
    FechaDevolucion DATETIME NULL,
    Estado VARCHAR(50),
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    FOREIGN KEY (ArticuloId) REFERENCES Articulos(Id)
);

-- Insertar datos base
INSERT INTO Roles (Nombre) VALUES ('Administrador'), ('Operador');

INSERT INTO Usuarios (Nombre, Email, Contraseña, RolId)
VALUES 
('Ana Pérez', 'ana@xwy.com', '123456', 1),
('Luis Torres', 'luis@xwy.com', '123456', 2);

INSERT INTO Articulos (Codigo, Nombre, Categoria, Estado, Ubicacion)
VALUES 
('A1001', 'Laptop HP', 'Tecnología', 'Disponible', 'Bodega 1'),
('A1002', 'Proyector Epson', 'Tecnología', 'Disponible', 'Oficina 2'),
('A1003', 'Escritorio', 'Mobiliario', 'Disponible', 'Bodega 3');
