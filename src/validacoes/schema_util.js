const knex = require('../conexoes/knex');

async function checar_cpf_email(email) {
    
    const cadastro = await knex('dados_cliente').where({email}).first();
        
    return cadastro;
}



module.exports = {
    checar_cpf_email
}