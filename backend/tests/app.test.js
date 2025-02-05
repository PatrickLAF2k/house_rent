const request = require('supertest');
const app = require('../src/app'); // Certifique-se de que o caminho para o seu arquivo app.js está correto
const pool = require('../src/config/database'); // Importa a configuração do banco de dados
const resetDatabase = require('../src/config/resetDatabase'); // Importa o script de limpeza do banco de dados

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
                    cpf: '12345678900',
                    email: 'owner2@example.com',
                    phone: '1234567892',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'CPF já cadastrado');
        });
    });

    // Teste de login de usuário
    describe('POST /login', () => {
        it('deve fazer login do usuário', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'owner@example.com',
                    password: 'password123'
                });
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('token');
            token = response.body.token; // Armazena o token JWT para uso posterior
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
    });

    // Teste de cadastro de inquilino
    describe('POST /tenants/register', () => {
        it('deve registrar um novo inquilino', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    name: 'John Doe',
                    cpf: '12345678900',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                    date_of_birth: '1990-01-01',
                    rg: '1234567',
                    address: '123 Main St',
                    address_number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12345'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('mensagem', 'Inquilino cadastrado com sucesso');
        });

        it('não deve registrar um inquilino com email já cadastrado', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    name: 'Jane Doe',
                    cpf: '12345678901',
                    email: 'john.doe@example.com',
                    phone: '1234567891',
                    date_of_birth: '1991-01-01',
                    rg: '1234568',
                    address: '124 Main St',
                    address_number: '101',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12346'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'Email já cadastrado');
        });

        it('não deve registrar um inquilino com CPF já cadastrado', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    name: 'Jane Doe',
                    cpf: '12345678900',
                    email: 'jane.doe@example.com',
                    phone: '1234567891',
                    date_of_birth: '1991-01-01',
                    rg: '1234568',
                    address: '124 Main St',
                    address_number: '101',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12346'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'CPF já cadastrado');
        });

        it('não deve registrar um inquilino com RG já cadastrado', async () => {
            const response = await request(app)
                .post('/tenants/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    name: 'Jane Doe',
                    cpf: '12345678901',
                    email: 'jane.doe@example.com',
                    phone: '1234567891',
                    date_of_birth: '1991-01-01',
                    rg: '1234567',
                    address: '124 Main St',
                    address_number: '101',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    state: 'ST',
                    zip_code: '12346'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'RG já cadastrado');
        });
    });

    // Teste de cadastro de propriedade
    describe('POST /properties/register', () => {
        it('deve registrar uma nova propriedade', async () => {
            const response = await request(app)
                .post('/properties/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    zip_code: '12345',
                    street: 'Main St',
                    number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    city: 'Metropolis',
                    state: 'ST'
                });
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
        });

        it('não deve registrar uma propriedade já cadastrada', async () => {
            const response = await request(app)
                .post('/properties/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    zip_code: '12345',
                    street: 'Main St',
                    number: '100',
                    neighborhood: 'Downtown',
                    municipality: 'City',
                    city: 'Metropolis',
                    state: 'ST'
                });
            expect(response.statusCode).toBe(409);
            expect(response.body).toHaveProperty('mensagem', 'Imóvel já cadastrado');
        });
    });

    // Teste de cadastro de contrato
    describe('POST /contract/register', () => {
        it('deve registrar um novo contrato', async () => {
            const response = await request(app)
                .post('/contract/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    tenant_id: 1, // Substitua pelo ID de um inquilino existente
                    property_id: 1, // Substitua pelo ID de uma propriedade existente
                    start_date: '2023-01-01',
                    end_date: '2024-01-01',
                    rent_value: 1000,
                    payment_day: 5
                });
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('mensagem', 'Contrato cadastrado com sucesso');
        });

        it('não deve registrar um contrato com inquilino inexistente', async () => {
            const response = await request(app)
                .post('/contract/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    tenant_id: 999, // ID de inquilino inexistente
                    property_id: 1, // Substitua pelo ID de uma propriedade existente
                    start_date: '2023-01-01',
                    end_date: '2024-01-01',
                    rent_value: 1000,
                    payment_day: 5
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Inquilino não encontrado');
        });

        it('não deve registrar um contrato com propriedade inexistente', async () => {
            const response = await request(app)
                .post('/contract/register')
                .set('Authorization', `Bearer ${token}`) // Inclui o token JWT no cabeçalho Authorization
                .send({
                    tenant_id: 1, // Substitua pelo ID de um inquilino existente
                    property_id: 999, // ID de propriedade inexistente
                    start_date: '2023-01-01',
                    end_date: '2024-01-01',
                    rent_value: 1000,
                    payment_day: 5
                });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('mensagem', 'Propriedade não encontrada');
        });
    });

    // Fechar a conexão com o banco de dados após todos os testes
    afterAll(async () => {
        await pool.end();
    });
});