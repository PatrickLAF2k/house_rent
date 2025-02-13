const userSchema = require('../src/schemas/tenantsRegisterSchema');

describe('Validação do Schema de Usuário', () => {
    const testCases = [
        { field: 'name', value: '', expectedMessage: 'Nome não pode estar vazio' },
        { field: 'name', value: 'Ana', expectedMessage: 'Por favor, insira o nome completo' },
        { field: 'name', value: 'Ana@123', expectedMessage: 'Nome não pode conter caracteres especiais ou números' },

        { field: 'nationality', value: '', expectedMessage: 'Nacionalidade não pode estar vazia' },
        { field: 'nationality', value: 'Br', expectedMessage: 'Por favor, insira a nacionalidade completa' },
        { field: 'nationality', value: '12345', expectedMessage: 'Nacionalidade não pode conter números ou caracteres especiais' },

        { field: 'date_of_birth', value: '', expectedMessage: 'Data de nascimento não pode estar vazia' },
        { field: 'date_of_birth', value: '2000-01-01', expectedMessage: 'A data de nascimento deve estar no formato (DD/MM/AAAA)' },

        { field: 'cpf', value: '', expectedMessage: 'CPF não pode estar vazio' },
        { field: 'cpf', value: '123', expectedMessage: 'CPF deve ter exatamente 11 caracteres' },
        { field: 'cpf', value: 'abcdef12345', expectedMessage: 'CPF deve conter apenas números' },

        { field: 'email', value: '', expectedMessage: 'Email não pode estar vazio' },
        { field: 'email', value: 'emailinvalido', expectedMessage: 'Por favor, insira um email válido' },

        { field: 'phone', value: '', expectedMessage: 'Telefone não pode estar vazio' },
        { field: 'phone', value: '123', expectedMessage: 'Telefone deve ter no mínimo 10 caracteres' },

        { field: 'zip_code', value: '', expectedMessage: 'CEP não pode estar vazio' },
        { field: 'zip_code', value: '12345', expectedMessage: 'CEP deve ter no mínimo 8 caracteres' }
    ];

    testCases.forEach(({ field, value, expectedMessage }) => {
        it(`deve retornar erro para o campo '${field}' com valor inválido: '${value}'`, () => {
            const validUserData = {
                name: 'João da Silva',
                nationality: 'Brasileiro',
                marital_status: 'Solteiro',
                date_of_birth: '01/01/2000',
                rg: '1234567',
                issuing_authority: 'SSP',
                cpf: '12345678901',
                email: 'teste@teste.com',
                phone: '11999999999',
                address: 'Rua Exemplo, 123',
                address_number: '123',
                neighborhood: 'Centro',
                municipality: 'São Paulo',
                state: 'SP',
                zip_code: '01001000'
            };

            validUserData[field] = value;

            const { error } = userSchema.validate(validUserData, { abortEarly: false });

            expect(error).not.toBeNull();
            expect(error.details.some(err => err.message === expectedMessage)).toBe(true);
        });
    });
});
