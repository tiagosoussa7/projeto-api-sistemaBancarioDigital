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



module.exports = {
    cadastro
}
        

