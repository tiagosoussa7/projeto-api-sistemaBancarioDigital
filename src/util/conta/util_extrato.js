const knex = require("../../conexoes/knex");
const { data_resposta, hora_resposta } = require("../util_resposta");

async function detalhar_depositos(tabela, cliente, res) {
    return res.status(200).json({EXTRATO_DEPOSITOS: await extrato_geral(tabela, cliente)});
}

async function detalhar_saques(tabela, cliente, res) {
    return res.status(200).json({EXTRATO_SAQUES: await extrato_geral(tabela, cliente)});
}

async function detalhar_transferencias(tabela1, tabela2, cliente, res) {
    return res.status(200).json({EXTRATO_TRANSFERÊNCIAS: await transferencias_geral(tabela1, tabela2, cliente)})
}

async function transferencias_geral(tabela1, tabela2, cliente) {
    
    const enviados = await knex(tabela1).where({conta_origem: cliente.id_cliente}).select('*');
    const recebidos = await knex(tabela2).where({conta_destino: cliente.id_cliente}).select('*');
            
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
   
    return {
        ENVIADAS: dadosEnviados,
        RECEBIDAS: dadosRecebidos,
    };
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

async function extrato_completo(tabela1, tabela2, tabela3, tabela4, cliente, res) {
    
    const depositos = await extrato_geral(tabela1, cliente);
    const saques = await extrato_geral(tabela2, cliente);
    const transferencias = await transferencias_geral(tabela3, tabela4, cliente);

    return res.status(200).json({
        EXTRATO_DEPOSITOS: depositos,
        EXTRATO_SAQUES: saques,
        EXTRATO_TRANSFERÊNCIAS: transferencias
    })
}


module.exports = {
    detalhar_depositos,
    detalhar_saques,
    detalhar_transferencias,
    extrato_completo
}