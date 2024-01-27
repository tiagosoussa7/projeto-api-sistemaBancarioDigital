const knex = require("../../conexoes/knex");
const { data_resposta, hora_resposta } = require("../util_resposta");

async function detalhar_depositos(tabela, cliente, res) {
    return res.status(200).json({Extrato_depositos: await extrato_geral(tabela, cliente)});
}

async function detalhar_saques(tabela, cliente, res) {
    return res.status(200).json({Extrato_saques: await extrato_geral(tabela, cliente)});
}

async function detalhar_transferencias(cliente, res) {
    
    const enviados = await knex('transferencias_enviadas').where({conta_origem: cliente.id_cliente}).select('*');
    const recebidos = await knex('transferencias_recebidas').where({conta_destino: cliente.id_cliente}).select('*');
            
            const dadosEnviados = enviados.map((enviado) => ({
                Conta_destino: enviado.conta_destino,
                Valor: enviado.valor,
                Data: data_resposta(enviado.data),
                Horário: hora_resposta(enviado.hora)
            }));
            
            const dadosRecebidos = recebidos.map((recebido) => ({
                Conta_origem: recebido.conta_origem,
                Valor: recebido.valor,
                Data: data_resposta(recebido.data),
                Horário: hora_resposta(recebido.hora)
            }));
   
    return res.status(200).json({
        Transferências_enviadas: dadosEnviados,
        Transferências_recebidas: dadosRecebidos,
    });
}

async function extrato_geral(tabela, cliente) {
    
    const dados = await knex(tabela).where({numero_conta: cliente.id_cliente}).select('*');
            
            const dadosFormatados = dados.map((dado) => ({
                Numero_conta: dado.numero_conta,
                Valor: dado.valor,
                Data: data_resposta(dado.data),
                Horário: hora_resposta(dado.hora)
            }));

    return dadosFormatados;        
}


module.exports = {
    detalhar_depositos,
    detalhar_saques,
    detalhar_transferencias
}