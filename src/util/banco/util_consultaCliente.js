const knex = require("../../conexoes/knex");
const { data_resposta, hora_resposta, nome_resposta, idade_resposta } = require("../util_resposta");

async function cliente_consultado(cpf, res) {
    
    const cliente_cadastrado = await knex('dados_cliente').where({ cpf }).first();
            
    if (cliente_cadastrado) {
        
        const cliente = await knex.select(
            'dados_cliente.nome',
            'dados_cliente.data_nascimento',
            'dados_cliente.email',
            'dados_cliente.cpf',
            'dados_conta.numero_conta',
            'dados_conta.saldo',
            'dados_conta.data_abertura',
            'dados_conta.hora_abertura'
        )
        .from('dados_cliente')
        .join('dados_conta', 'dados_cliente.id_cliente', '=', 'dados_conta.numero_conta')
        .where({'dados_cliente.cpf': cpf}).first();
 
        const dados_cliente = {
            Nome: nome_resposta(cliente.nome),
            Data_nacimento: data_resposta(cliente.data_nascimento),
            CPF: cliente.cpf,
            Email: cliente.email,
            Numero_conta: cliente.numero_conta,
            Saldo: cliente.saldo,
            Conta_aberta: data_resposta(cliente.data_abertura),
            Horário: hora_resposta(cliente.hora_abertura)
        }
                
        return res.status(200).json({Dados_cliente: dados_cliente})
    } else {
        return res.status(404).json({mensagem: `Consulta negada: o CPF: ${cpf} não foi encontrada no banco de dados.`});
    }
}

async function clientes_consultados(res) {
    
    const clientes = await knex.select(
        'dados_cliente.nome',
        'dados_cliente.cpf',
        'dados_cliente.email',
        'dados_conta.numero_conta',
        'dados_conta.saldo'
        
    )
    .from('dados_conta')
    .join('dados_cliente', 'dados_conta.numero_conta', 'dados_cliente.id_cliente')
    .orderBy('dados_conta.numero_conta', 'asc');
    
    if (!clientes) return res.status(404).json({mensagem: 'Consulta negada: não ha clientes cadastrados.'});
    
    return res.status(200).json({Dados_clientes: clientes});
}

module.exports = {
    cliente_consultado,
    clientes_consultados
}