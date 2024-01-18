const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { data_resposta, hora_resposta, nome_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { nome, senha } = req.body;
    
    if (!nome || !senha) return res.status(400).json({mensagem: 'Os campos nome e senha são obrigatórios.'});

    try {
        const sistema_ocupado = await knex('dados_banco').select('nome').first();
        
        if (sistema_ocupado) {
            
            if (sistema_ocupado.nome == nome) {
                return res.status(400).json({mensagem: `O banco ${nome_resposta(nome)} já está cadastrado e usando o sistema.`});
            } else {
                return res.status(400).json({mensagem: `O cadastro do banco: ${nome_resposta(nome)} foi bloqueado, o sistema está em uso pelo banco ${nome_resposta(sistema_ocupado.nome)}.`});
            }
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10); 
        
        await knex('dados_banco').insert({
            nome,
            senha: senhaCriptografada
        });

        return res.status(200).json({mensagem: `O cadastro do banco: ${nome_resposta(nome)} foi efetivado no sistema.`});
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const informacoes = async (req, res) => {
    const { nome, qtd_contas, orcamento, sistema_ativo } = req.banco;
    const data = data_resposta(sistema_ativo);
    const hora = hora_resposta(sistema_ativo);

    const banco_informacoes = {
        Instituicão_cadastrada: nome,
        Contas_ativas: qtd_contas,
        Orçamento_total: orcamento
    }

    const sistema = {
        Data: data,
        Hora: hora 
    }
    
    return res.status(200).json({
        Informações_banco: banco_informacoes,
        Sistema_ativado: sistema
    });
}
    

const atualizar = async (req, res) => {
    const { nome, senha } = req.body;
    const { id_banco } = req.banco;
    
    if (nome) { 
        if (req.banco.nome === nome) return res.status(401).json({mensagem: `Atualização negada: o nome ${nome_resposta(nome)} é o mesmo do banco cadastrado no sistema.`});
    }
    
    try {
    
        if (senha) { 
            const senha_atualizada = await bcrypt.compare(senha, req.banco.senha);
            
            if (senha_atualizada) return res.status(401).json({mensagem: `Atualização negada: a senha da atualização é a mesma do banco cadastrado no sistema.`});
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        const [ banco ] = await knex('dados_banco')
        .where({ id_banco })
        .update({
            nome, 
            senha: senhaCriptografada
        }).returning('*')
        console.log(banco.nome);
        if (banco.nome === nome) {
            return res.status(200).json({mensagem: 'Atualização efetivada: o nome do banco foi modificado.'});
        }
        
        if (banco.senha !== req.senha) {
            return res.status(200).json({mensagem: 'Atualização efetivada: a senha foi modificada.'});
        }
        
        return res.status(200).json({mensagem: 'Atualização efetivada: nome e senha modificados.'});

        

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

//res.status(200).json({mensagem: 'ok'})
module.exports = {
    cadastro,
    informacoes,
    atualizar
}


        

