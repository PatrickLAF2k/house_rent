CREATE DATABASE house_rent;

-- Tabela de proprietários
CREATE TABLE
    owners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(70)  UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30)  NOT NULL,
        password VARCHAR(255) NOT NULL
    );

-- Tabela de inquilinos
CREATE TABLE
    tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(70)  NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30)  NOT NULL
    );

-- Tabela de imóveis
CREATE TABLE
    properties (
        id SERIAL PRIMARY KEY,
        zip_code VARCHAR(8) NOT NULL,
        street VARCHAR(255) NOT NULL,
        number VARCHAR(10) NOT NULL,
        neighborhood VARCHAR(255),
        municipality VARCHAR(100),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL
    );

-- Tabela de contratos
CREATE TABLE
    contract (
        id SERIAL PRIMARY KEY,
        owner_id INT NOT NULL REFERENCES owners (id) ON DELETE CASCADE,
        tenant_id INT NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        property_id INT NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        rent_value INTEGER NOT NULL,
        payment_day INTEGER NOT NULL
    );