const { nome_resposta, idade_resposta, data_resposta } = require("../util_resposta");

async function detalhar_cliente( cliente, dataFormatada, res) {
    const dados = {
        Numero_conta: cliente.id_cliente,
        Nome: nome_resposta(cliente.nome),
        Idade: idade_resposta(dataFormatada),
        CPF: cliente.cpf,
        Email: cliente.email,   
        Data_nascimento: data_resposta(cliente.data_nascimento)
    }
    return res.status(200).json({informações: dados});
}

module.exports = {
    detalhar_cliente
}