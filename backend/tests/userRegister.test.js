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

    // Testes de cadastro de usuário
    describe('POST /register', () => {

        it('deve registrar um novo usuário', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    name: 'Owner Test',
                    nationality: 'Brazilian',
                    marital_status: 'Single',
                    occupation: 'Engineer',
                    date_of_birth: '01/01/1990',
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
                    date_of_birth: '01/01/1990',
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
                    date_of_birth: '01/01/1990',
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

        describe('Validação do campo nome', () => {

            it('não deve registrar um usuário com nome vazio', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: '',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Nome não pode estar vazio');
            });

            it('não deve registrar um usuário com nome menor que 10 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Ana Silva',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Por favor, insira o nome completo');
            });

            it('não deve registrar um usuário com nome maior que 255 caracteres', async () => {
                const longName = 'A'.repeat(256);
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: longName,
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Nome deve ter no máximo 255 caracteres');
            });

            it('não deve registrar um usuário com nome contendo caracteres especiais ou números', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'J0ão@Silv@',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Nome não pode conter caracteres especiais ou números');
            });

        });

        describe('Validação do campo nationality', () => {

            it('não deve registrar um usuário sem a nacionalidade', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com nacionalidade menor que 3 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Br',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Por favor, insira a nacionalidade completa');
            });

            it('não deve registrar um usuário com nacionalidade maior que 100 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'A'.repeat(101),
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Nacionalidade deve ter no máximo 100 caracteres');
            });

            it('não deve registrar um usuário com nacionalidade contendo números ou caracteres especiais', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Braz1l@',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Nacionalidade não pode conter números ou caracteres especiais');
            });


        });

        describe('Validação do campo marital_status', () => {

            it('não deve registrar um usuário sem o campo marital_status', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com estado civil vazio', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: '',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Estado civil não pode estar vazio');
            });

            it('não deve registrar um usuário com estado civil menor que 3 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'S',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Por favor, insira o estado civil completo');
            });

            it('não deve registrar um usuário com estado civil maior que 50 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'A'.repeat(51),
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Estado civil deve ter no máximo 50 caracteres');
            });

            it('não deve registrar um usuário com estado civil contendo números ou caracteres especiais', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Casad@123',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Estado civil não pode conter números ou caracteres especiais');
            });

        });

        describe('Validação do campo occupation', () => {

            it('não deve registrar um usuário sem ocupação', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        // ocupaçao não preenchida
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com ocupação menor que 3 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'IT',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Por favor, insira a ocupação completa');
            });

            it('não deve registrar um usuário com ocupação maior que 255 caracteres', async () => {
                const longOccupation = 'A'.repeat(256);
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: longOccupation,
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Ocupação deve ter no máximo 255 caracteres');
            });

            it('não deve registrar um usuário com ocupação contendo caracteres especiais ou números', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engenheiro 123!',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Ocupação não pode conter números ou caracteres especiais');
            });

            it('não deve registrar um usuário sem preencher o campo ocupação', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: '',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Ocupação não pode estar vazia');
            });
        });

        describe('Validação do campo date_of_birth', () => {

            it('não deve registrar um usuário sem data de nascimento', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '', // Campo vazio
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Data de nascimento não pode estar vazia');
            });

            it('não deve registrar um usuário com data de nascimento em formato inválido', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '10-02-2000', // Formato inválido (DD-MM-AAAA)
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                console.log(response.body);
                expect(response.body).toHaveProperty('mensagem', 'A data de nascimento deve estar no formato (DD/MM/AAAA)');
            });

            it('não deve registrar um usuário com data de nascimento ausente', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                        // Sem o campo date_of_birth
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com data de nascimento inválida', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: 'invalid-date', // Valor inválido
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'A data de nascimento deve estar no formato (DD/MM/AAAA)');
            });

        });

        describe('Validação do campo rg', () => {

            it('não deve registrar um usuário sem RG', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com RG menor que 7 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '123456',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'RG deve ter no mínimo 7 caracteres');
            });

            it('não deve registrar um usuário com RG maior que 12 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567890123',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'RG deve ter no máximo 12 caracteres');
            });

            it('não deve registrar um usuário com RG contendo caracteres não numéricos', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '12A4567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'RG deve conter apenas números');
            });

            it('não deve registrar um usuário sem preencher o campo RG', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'RG não pode estar vazio');
            });
        });

        describe('Validação do campo issuing_authority', () => {

            it('não deve registrar um usuário sem órgão emissor', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com órgão emissor menor que 2 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'S',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Órgão emissor deve ter no mínimo 2 caracteres');
            });

            it('não deve registrar um usuário com órgão emissor maior que 50 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'A'.repeat(51),
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Órgão emissor deve ter no máximo 50 caracteres');
            });

            it('não deve registrar um usuário com órgão emissor contendo números ou caracteres especiais', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP123!',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Órgão emissor não pode conter números ou caracteres especiais');
            });

            it('não deve registrar um usuário sem preencher o campo órgão emissor', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: '',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Órgão emissor não pode estar vazio');
            });
        });

        describe('Validação do campo cpf', () => {

            it('não deve registrar um usuário sem CPF', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com CPF menor que 11 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '1234567890',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'CPF deve ter exatamente 11 caracteres');
            });

            it('não deve registrar um usuário com CPF maior que 11 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '123456789012',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'CPF deve ter exatamente 11 caracteres');
            });

            it('não deve registrar um usuário com CPF contendo letras ou caracteres especiais', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345abc901',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'CPF deve conter apenas números');
            });

            it('não deve registrar um usuário sem preencher o campo CPF', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'CPF não pode estar vazio');
            });
        });

        describe('Validação do campo email', () => {

            it('não deve registrar um usuário sem email', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com email vazio', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: '',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Email não pode estar vazio');
            });

            it('não deve registrar um usuário com email inválido', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'email-invalido',
                        phone: '1234567890',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Por favor, insira um email válido');
            });
        });

        describe('Validação do campo phone', () => {

            it('não deve registrar um usuário sem telefone', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com telefone vazio', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Telefone não pode estar vazio');
            });

            it('não deve registrar um usuário com telefone menor que 10 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '12345',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Telefone deve ter no mínimo 10 caracteres');
            });

            it('não deve registrar um usuário com telefone maior que 20 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '123456789012345678901',
                        password: 'password123'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Telefone deve ter no máximo 20 caracteres');
            });
        });

        describe('Validação do campo password', () => {

            it('não deve registrar um usuário sem senha', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Todos os campos são obrigatórios');
            });

            it('não deve registrar um usuário com senha vazia', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: ''
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Senha não pode estar vazia');
            });

            it('não deve registrar um usuário com senha menor que 6 caracteres', async () => {
                const response = await request(app)
                    .post('/register')
                    .send({
                        name: 'Owner Test',
                        nationality: 'Brazilian',
                        marital_status: 'Single',
                        occupation: 'Engineer',
                        date_of_birth: '01/01/1990',
                        rg: '1234567',
                        issuing_authority: 'SSP',
                        cpf: '12345678900',
                        email: 'owner@example.com',
                        phone: '1234567890',
                        password: '12345'
                    });
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('mensagem', 'Senha deve ter no mínimo 6 caracteres');
            });
        });



    });

    // Fecha a conexão com o banco de dados após todos os testes

    afterAll(async () => {
        await pool.end();
    });
});