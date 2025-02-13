const request = require('supertest');
const app = require('../src/app');
const resetDatabase = require('../src/config/resetDatabase'); // Importa o script de limpeza do banco de dados
const pool = require('../src/config/database'); // Importa a conexão com o banco de dados

describe('API de Controle de Casas Alugadas', () => {
    let token;


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
            console.log(response.body);
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

    // Fecha a conexão com o banco de dados após todos os testes

    afterAll(async () => {
        await pool.end();
    });
});