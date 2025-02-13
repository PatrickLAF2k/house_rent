const userSchema = require('../src/schemas/userSchema');

describe('Validação do Schema de Usuário', () => {
    const testCases = [
        { field: 'name', value: '', expectedMessage: 'Nome não pode estar vazio' },
        { field: 'name', value: 'A', expectedMessage: 'Por favor, insira o nome completo' },
        { field: 'name', value: '1234567890', expectedMessage: 'Nome não pode conter caracteres especiais ou números' },

        { field: 'nationality', value: '', expectedMessage: 'Nacionalidade não pode estar vazia' },
        { field: 'nationality', value: 'Br', expectedMessage: 'Por favor, insira a nacionalidade completa' },

        { field: 'date_of_birth', value: '', expectedMessage: 'Data de nascimento não pode estar vazia' },
        { field: 'date_of_birth', value: '01-01-2000', expectedMessage: 'A data de nascimento deve estar no formato (DD/MM/AAAA)' },

        { field: 'rg', value: '', expectedMessage: 'RG não pode estar vazio' },
        { field: 'rg', value: 'abc', expectedMessage: 'RG deve conter apenas números' },

        { field: 'cpf', value: '', expectedMessage: 'CPF não pode estar vazio' },
        { field: 'cpf', value: '12345', expectedMessage: 'CPF deve ter exatamente 11 caracteres' },
        { field: 'cpf', value: 'abcdef12345', expectedMessage: 'CPF deve conter apenas números' },

        { field: 'email', value: '', expectedMessage: 'Email não pode estar vazio' },
        { field: 'email', value: 'emailinvalido', expectedMessage: 'Por favor, insira um email válido' },

        { field: 'phone', value: '', expectedMessage: 'Telefone não pode estar vazio' },
        { field: 'phone', value: '123', expectedMessage: 'Telefone deve ter no mínimo 10 caracteres' },

        { field: 'password', value: '', expectedMessage: 'Senha não pode estar vazia' },
        { field: 'password', value: '123', expectedMessage: 'Senha deve ter no mínimo 6 caracteres' }
    ];

    testCases.forEach(({ field, value, expectedMessage }) => {
        it(`deve retornar erro para o campo '${field}' com valor inválido: '${value}'`, () => {
            const userData = {
                name: 'Usuário Válido',
                nationality: 'Brasileiro',
                marital_status: 'Solteiro',
                occupation: 'Engenheiro',
                date_of_birth: '10/10/2000',
                rg: '1234567',
                issuing_authority: 'SSP',
                cpf: '12345678901',
                email: 'email@teste.com',
                phone: '11999999999',
                password: 'senha123'
            };

            userData[field] = value;

            const { error } = userSchema.validate(userData, { abortEarly: false });

            expect(error).not.toBeNull();
            expect(error.details.some(err => err.message === expectedMessage)).toBe(true);
        });
    });
});
