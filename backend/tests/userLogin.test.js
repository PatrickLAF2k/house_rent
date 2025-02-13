const loginSchema = require('../src/schemas/loginSchema');

describe('Validação do Schema de Login', () => {
    const testCases = [
        { field: 'email', value: '', expectedMessage: 'Email não pode estar vazio' },
        { field: 'email', value: 'emailinvalido', expectedMessage: 'Email inválido' },
        { field: 'password', value: '', expectedMessage: 'Senha não pode estar vazia' },
        { field: 'password', value: '123', expectedMessage: 'Senha deve ter no mínimo 6 caracteres' }
    ];

    testCases.forEach(({ field, value, expectedMessage }) => {
        it(`deve retornar erro para o campo '${field}' com valor inválido: '${value}'`, () => {
            const loginData = {
                email: 'teste@teste.com',
                password: 'senha123'
            };

            loginData[field] = value;

            const { error } = loginSchema.validate(loginData, { abortEarly: false });

            expect(error).not.toBeNull();
            expect(error.details.some(err => err.message === expectedMessage)).toBe(true);
        });
    });
});
