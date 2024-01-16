const knex = require('../conexoes/knex');

const cadastro = async (req,res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) return res.status(400).json({mensagem: 'Os campos nome e senha são obrigatórios.'});

    try {
        const sistema_ocupado = await knex('dados_banco').select('nome').first();

        if (sistema_ocupado) {
            if (sistema_ocupado.nome == nome) {
                return res.status(400).json({mensagem: `O banco ${nome} já está cadastrado e usando o sistema.`});
            } else {
                return res.status(400).json({mensagem: `O cadastro do banco: ${nome} foi bloqueado, o sistema está em uso pelo banco ${sistema_ocupado.nome}.`});
            }
        }
        
        await knex('dados_banco').insert({
            nome,
            senha
        });

        return res.status(200).json({mensagem: `O cadastro do banco: ${nome} foi efetivado no sistema.`});
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
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
    atualizar
}
        

