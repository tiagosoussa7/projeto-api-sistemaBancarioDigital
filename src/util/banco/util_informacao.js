const { nome_resposta, data_resposta, hora_resposta } = require("../util_resposta");

async function detalhar_banco(banco, res) {
    const dados_banco = {
        Banco_cadastrada: nome_resposta(banco.nome),
        Contas_ativas: banco.qtd_contas,
        Orçamento_total: banco.orcamento,
        Sistema_ativado: data_resposta(banco.data_ativacao),
        Horario: hora_resposta(banco.hora_ativacao)
    }
    
    return res.status(200).json({Informações_banco: dados_banco});
}

module.exports = {
    detalhar_banco
}