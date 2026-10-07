-- Ejecutar en SQL Server Management Studio (Nueva consulta)
IF DB_ID('formulario_db') IS NULL
    CREATE DATABASE formulario_db;
GO

USE formulario_db;
GO

IF OBJECT_ID('dbo.usuarios', 'U') IS NULL
CREATE TABLE dbo.usuarios (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    tipo_documento   VARCHAR(2)   NOT NULL,
    numero_documento VARCHAR(20)  NOT NULL,
    nombres          VARCHAR(100) NOT NULL,
    apellidos        VARCHAR(100) NULL,
    direccion        VARCHAR(150) NULL,
    ciudad           VARCHAR(50)  NULL,
    fecha_nacimiento DATE         NULL,
    correo           VARCHAR(120) NOT NULL,
    celular          VARCHAR(15)  NOT NULL,
    CONSTRAINT uq_documento UNIQUE (tipo_documento, numero_documento)
);
GO
