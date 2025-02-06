const request = require('supertest');
const app = require('../src/app');
const resetDatabase = require('../src/config/resetDatabase'); // Importa o script de limpeza do banco de dados
const pool = require('../src/config/database'); // Importa a conexão com o banco de dados

describe('API de Controle de Casas Alugadas', () => {
    let token;

    // Limpa o banco de dados antes de todos os testes
    beforeAll(async () => {
        await resetDatabase();
    });

    // Teste de cadastro de usuário
    describe('POST /register', () => {
        it('deve registrar um novo usuário', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'owner@example.com',
                    phone: '1234567890',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
        });

        it('não deve registrar um usuário com email já cadastrado', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234568',
                    issuing_authority: 'SSP',
                    cpf: '12345678901',
                    email: 'owner@example.com',
                    phone: '1234567891',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'Email já cadastrado');
        });

        it('não deve registrar um usuário com CPF já cadastrado', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234569',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'owner2@example.com',
                    phone: '1234567892',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'CPF já cadastrado');
        });

        it('não deve registrar um usuário com campos obrigatórios faltando', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'owner@example.com',
                    phone: '1234567890'
                    // Falta o campo 'password'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
        });

        it('não deve registrar um usuário com formato de email inválido', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'owner@invalid',
                    phone: '1234567890',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Formato de email inválido');
        });

        it('não deve registrar um usuário com senha fraca', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'owner@example.com',
                    phone: '1234567890',
                    password: '123'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Senha fraca');
        });
    });

    // Teste de login
    describe('POST /login', () => {
        it('deve fazer login com sucesso', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'owner@example.com',
                    password: 'password123'
                });

            token = response.body.token;
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('não deve fazer login com email incorreto', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Email ou senha incorretos');
        });

        it('não deve fazer login com senha incorreta', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'owner@example.com',
                    password: 'wrongpassword'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Email ou senha incorretos');
        });

        it('não deve fazer login com campos obrigatórios faltando', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'owner@example.com'
                    // Falta o campo 'password'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
        });
    });

    // Teste de cadastro de inquilino
    describe('POST /tenants/register', () => {
        it('deve cadastrar um novo inquilino', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Tenant Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'tenant@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    address_number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12345'
                });
            console.log(response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body.inquilino).toHaveProperty('id');
        });

        it('não deve cadastrar um inquilino com email já cadastrado', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Tenant Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    date_of_birth: '1990-01-01',
                    rg: '1234568',
                    issuing_authority: 'SSP',
                    cpf: '12345678901',
                    email: 'tenant@example.com',
                    phone: '1234567891',
                    address: '123 Main St',
                    address_number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12345'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'Email já cadastrado');
        });

        it('não deve cadastrar um inquilino com CPF já cadastrado', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Tenant Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    date_of_birth: '1990-01-01',
                    rg: '1234569',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'tenant2@example.com',
                    phone: '1234567892',
                    address: '123 Main St',
                    address_number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12345'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'CPF já cadastrado');
        });

        it('não deve cadastrar um inquilino com campos obrigatórios faltando', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Tenant Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    issuing_authority: 'SSP',
                    cpf: '12345678900',
                    email: 'tenant@example.com',
                    phone: '1234567890',
                    address: '123 Main St',
                    address_number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST'
                    // Falta o campo 'zip_code'
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
        });
    });

    // Fecha a conexão com o banco de dados após todos os testes
    afterAll(async () => {
        await pool.end();
    });
});