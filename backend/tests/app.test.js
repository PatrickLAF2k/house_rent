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
    });

    // // Teste de cadastro de inquilino
    // describe('POST /tenants/register', () => {
    //     beforeAll(async () => {
    //         // Registra um novo usuário e faz login para obter o token
    //         await request(app)
    //             .post('/register')
    //             .send({
    //                 name: 'Owner Test',
    //                 nationality: 'Brazilian',
    //                 marital_status: 'Single',
    //                 occupation: 'Engineer',
    //                 date_of_birth: '1990-01-01',
    //                 rg: '1234567',
    //                 issuing_authority: 'SSP',
    //                 cpf: '12345678900',
    //                 email: 'owner@example.com',
    //                 phone: '1234567890',
    //                 password: 'password123'
    //             });

    //         const response = await request(app)
    //             .post('/login')
    //             .send({
    //                 email: 'owner@example.com',
    //                 password: 'password123'
    //             });

    //         token = response.body.token;
    //     });

    //     it('deve registrar um novo inquilino', async () => {
    //         const response = await request(app)
    //             .post('/tenants/register')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send({
    //                 owner_id: 1, // Substitua pelo ID de um proprietário existente
    //                 name: 'John Doe',
    //                 nationality: 'Brazilian',
    //                 marital_status: 'Single',
    //                 date_of_birth: '1990-01-01',
    //                 rg: '1234567',
    //                 issuing_authority: 'SSP',
    //                 cpf: '12345678900',
    //                 email: 'john.doe@example.com',
    //                 phone: '1234567890',
    //                 address: '123 Main St',
    //                 address_number: '100',
    //                 neighborhood: 'Downtown',
    //                 municipality: 'City',
    //                 state: 'ST',
    //                 zip_code: '12345'
    //             });
    //         expect(response.statusCode).toBe(201);
    //         expect(response.body).toHaveProperty('id');
    //     });

    //     it('não deve registrar um inquilino com email já cadastrado', async () => {
    //         const response = await request(app)
    //             .post('/tenants/register')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send({
    //                 owner_id: 1, // Substitua pelo ID de um proprietário existente
    //                 name: 'Jane Doe',
    //                 nationality: 'Brazilian',
    //                 marital_status: 'Married',
    //                 date_of_birth: '1985-05-15',
    //                 rg: '1234568',
    //                 issuing_authority: 'SSP',
    //                 cpf: '12345678901',
    //                 email: 'john.doe@example.com',
    //                 phone: '1234567891',
    //                 address: '124 Main St',
    //                 address_number: '101',
    //                 neighborhood: 'Downtown',
    //                 municipality: 'City',
    //                 state: 'ST',
    //                 zip_code: '12346'
    //             });
    //         expect(response.statusCode).toBe(409);
    //         expect(response.body).toHaveProperty('mensagem', 'Email já cadastrado');
    //     });

    //     it('não deve registrar um inquilino com CPF já cadastrado', async () => {
    //         const response = await request(app)
    //             .post('/tenants/register')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send({
    //                 owner_id: 1, // Substitua pelo ID de um proprietário existente
    //                 name: 'Alice Johnson',
    //                 nationality: 'Brazilian',
    //                 marital_status: 'Divorced',
    //                 date_of_birth: '1978-09-23',
    //                 rg: '1234569',
    //                 issuing_authority: 'SSP',
    //                 cpf: '12345678900',
    //                 email: 'alice.johnson@example.com',
    //                 phone: '1234567892',
    //                 address: '125 Main St',
    //                 address_number: '102',
    //                 neighborhood: 'Downtown',
    //                 municipality: 'City',
    //                 state: 'ST',
    //                 zip_code: '12347'
    //             });
    //         expect(response.statusCode).toBe(409);
    //         expect(response.body).toHaveProperty('mensagem', 'CPF já cadastrado');
    //     });
    // });

    // Fecha a conexão com o banco de dados após todos os testes
    afterAll(async () => {
        await pool.end();
    });
});