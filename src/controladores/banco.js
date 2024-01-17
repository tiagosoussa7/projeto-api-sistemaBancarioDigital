const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { data_resposta, hora_resposta, nome_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { nome, senha } = req.body;
    const nome_body = nome_resposta(nome);
    
    if (!nome || !senha) return res.status(400).json({mensagem: 'Os campos nome e senha são obrigatórios.'});

    try {
        const sistema_ocupado = await knex('dados_banco').select('nome').first();
        
        if (sistema_ocupado) {
            const nome_banco = nome_resposta(sistema_ocupado.nome);
            
            if (sistema_ocupado.nome == nome) {
                return res.status(400).json({mensagem: `O banco ${nome_body} já está cadastrado e usando o sistema.`});
            } else {
                return res.status(400).json({mensagem: `O cadastro do banco: ${nome_body} foi bloqueado, o sistema está em uso pelo banco ${nome_banco}.`});
            }
        }
        
        const senhaCriptografada = await bcrypt.hash(senha, 10); 
        
        await knex('dados_banco').insert({
            nome,
            senha: senhaCriptografada
        });

        return res.status(200).json({mensagem: `O cadastro do banco: ${nome_body} foi efetivado no sistema.`});
    
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
    const { senha_banco } = req.query;

    if (!senha_banco) return res.status(400).json({mensagem: 'Por favor, digite a senha.'});

    try {
        const cadastro_banco = await knex('dados_banco').select('nome', 'senha').first();
        
        if (senha_banco !== cadastro_banco.senha) return res.status(400).json({mensamgem: `A senha do banco ${cadastro_banco.nome} está incorreta.`})
        
        if (!cadastro_banco) return res.status(400).json({mensagem: 'Bloqueio de atualização! Não há banco utilizando o sistema.'});
        
        if (cadastro_banco.nome == nome) return res.status(400).json({mensagem: `O nome ${nome} é o mesmo do banco cadastrado no sistema.`});

        const [atualizacao_banco] = await knex('dados_banco')
            .update({nome, senha}).returning('*');

        if (atualizacao_banco.nome !== cadastro_banco.nome && atualizacao_banco.senha !== cadastro_banco.senha) {
            return res.status(200).json({mensagem: `O nome e a senha do banco foram atualizadas. O banco ${cadastro_banco.nome} agora se chama ${atualizacao_banco.nome}.`});
        }
        if (atualizacao_banco.nome !== cadastro_banco.nome) {
            return res.status(200).json({mensagem: `O nome do banco ${cadastro_banco.nome} foi atualizado para ${atualizacao_banco.nome}.`});
        }
        if (atualizacao_banco.senha !== cadastro_banco.senha) {
            return res.status(200).json({mensagem: `Êxito na atualização da senha.`});
        }
        if (atualizacao_banco.senha == cadastro_banco.senha) {
            return res.status(200).json({mensagem: `A senha de atualização é a mesma do cadastro.`});
        }
        
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
        

