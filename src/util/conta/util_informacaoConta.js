const { nome_resposta, data_resposta, hora_resposta } = require("../util_resposta");

async function detalhar_conta(cliente, conta, res) {
    const dados_conta = {
        Numero_conta: conta.numero_conta,
        Nome: nome_resposta(cliente.nome),
        Saldo: conta.saldo,
        Total_saques: conta.total_saques,
        Total_depositos: conta.total_depositos,
        Numero_transferências: conta.qtd_transferencias,
        Conta_aberta: data_resposta(conta.data_abertura),
        Horário: hora_resposta(conta.hora_abertura),
    }
    return res.status(200).json({informações: dados_conta});
}

module.exports = {
    detalhar_conta
}