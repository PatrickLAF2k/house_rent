CREATE DATABASE house_rent;

CREATE TABLE
    owners (
        id SERIAL PRIMARY KEY ,
        name VARCHAR(255) NOT NULL,
        CPF VARCHAR(11) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

CREATE TABLE
    tenants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        CPF VARCHAR(11) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(30) UNIQUE NOT NULL
    );