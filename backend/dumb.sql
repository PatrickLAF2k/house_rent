CREATE DATABASE house_rent;

-- Tabela de proprietários
CREATE TABLE
    owners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(70) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

-- Tabela de inquilinos
CREATE TABLE
    tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(70) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30) NOT NULL,
        date_of_birth DATE NOT NULL,
        rg VARCHAR(70) UNIQUE NOT NULL,
        address VARCHAR(255) NOT NULL,
        address_number VARCHAR(10) NOT NULL,
        neighborhood VARCHAR(255) NOT NULL,
        municipality VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        zip_code VARCHAR(8) NOT NULL
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
        state VARCHAR(2) NOT NULL
    );

-- Tabela de contratos
CREATE TABLE
    contract (
        id SERIAL PRIMARY KEY,
        owner_id INT NOT NULL REFERENCES owners (id),
        tenant_id INT NOT NULL REFERENCES tenants (id),
        property_id INT NOT NULL REFERENCES properties (id),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        rent_value INT NOT NULL,
        payment_day INT NOT NULL
    );