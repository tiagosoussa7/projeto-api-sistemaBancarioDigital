const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { data_resposta, hora_resposta, nome_resposta, idade_resposta } = require('../validacoes/schema_resposta');
const { conta_consultada, contas_consultadas } = require('../validacoes/schema_banco/schema_consultaConta.js');
const { cliente_consultado, clientes_consultados } = require('../validacoes/schema_banco/schema_consultaCliente.js');

const cadastro = async (req,res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    
    if ((instituicao_nome && !instituicao_senha) || (instituicao_senha && !instituicao_nome)) {
        return res.status(400).json({mensagem: `Cadastro negado: o campo ${instituicao_nome ? 'senha' : 'nome da Instituição'} é obrigátorio.`});
    }

    try {
        
        if ( instituicao_nome && instituicao_senha) {

            const sistema_ocupado = await knex('dados_banco').select('nome').first();
        
            if (sistema_ocupado) {
            
                if (sistema_ocupado.nome == instituicao_nome) {
                    return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(instituicao_nome)} já é a atual controladora do sistema bancário digital.`});
                } else {
                    return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(sistema_ocupado.nome)} é a atual controladora do sistema bancário digital.`});
                }
            }
        
            const senha_criptografada = await bcrypt.hash(instituicao_senha, 10); 
        
            await knex('dados_banco').insert({
                nome: instituicao_nome,
                senha: senha_criptografada
            });

            return res.status(200).json({mensagem: `Cadastro efetivado: a instituição ${nome_resposta(instituicao_nome)} agora é controladora do sistema bancário digital.`});
        }

        return res.status(400).json({mensagem: 'Cadastro negado: os campos instituição e senha são obrigatórios.'});
    
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const informacoes = async (req, res) => {

    const banco_informacoes = {
        Banco_cadastrada: nome_resposta(req.banco.nome),
        Contas_ativas: req.banco.qtd_contas,
        Orçamento_total: req.banco.orcamento,
        Sistema_ativado: data_resposta(req.banco.data_ativacao),
        Horario: hora_resposta(req.banco.hora_ativacao)
    }
    
    return res.status(200).json({Informações_banco: banco_informacoes});
}

const consulta_conta = async (req, res) => {
    const { numero_conta } = req.body;
    
    try {
        if (numero_conta) {
            return conta_consultada(numero_conta, res);
        }
        
        return contas_consultadas(res);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}

const consulta_cliente = async (req, res) => {
    const { cpf } = req.body;

    try {
        if (cpf) {
            return cliente_consultado(cpf, res);
        }

        return clientes_consultados(res);

    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}
const atualizar = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const { id_banco, nome, senha } = req.banco;
    

    try {
        if ((instituicao_nome && instituicao_senha) || instituicao_nome || instituicao_senha) {
            
            if (instituicao_nome && instituicao_senha) {
                
                if (instituicao_nome === nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(instituicao_nome) } é o mesmo do banco controlador do sistema.`});

                const comparar_senha = await bcrypt.compare(instituicao_senha, senha);
                
                if (comparar_senha) return res.status(401).json({mensagem: `Atualização negada: a senha da atualização é a mesma do banco cadastrado no sistema.`});
            
                const senha_criptografada = await bcrypt.hash(instituicao_senha, 10);
                
                await knex('dados_banco').where({ id_banco }).update({nome: instituicao_nome, senha: senha_criptografada });
                
                return res.status(400).json({mensagem: `Atualização efetivada: o nome e a senha da instituição foram modificados.`});
            }

            if (instituicao_nome) {
                if (instituicao_nome === nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(instituicao_nome) } é o mesmo do banco controlador do sistema.`});

                await knex('dados_banco').where({ id_banco }).update({nome: instituicao_nome});
                
                return res.status(400).json({mensagem: `Atualização efetivada: o banco: ${nome_resposta(req.banco.nome)} agora se chama ${nome_resposta(instituicao_nome)}.`});
            }
            
            if (instituicao_senha) { 
                
                const comparar_senha = await bcrypt.compare(instituicao_senha, senha);
                
                if (comparar_senha) return res.status(401).json({mensagem: `Atualização negada: a senha da atualização é a mesma do banco cadastrado no sistema.`});
            
                const senha_criptografada = await bcrypt.hash(instituicao_senha, 10);
                
                await knex('dados_banco').where({ id_banco }).update({senha: senha_criptografada });
                
                return res.status(400).json({mensagem: `Atualização efetivada: a senha da instituição foi modificada.`});
            }
        }
            
        return res.status(400).json({mensagem: 'Atualização negada: para modificação de dados é necessário preencher ao menos um campo'});
        
    } catch (error) {
        return res.status(500).json(`${error.message}`)
    }
}

const excluir_contaCliente = async (req, res) => {
    const { numero_conta, cpf } = req.body;

    try {
        if (numero_conta) {
            const conta = await knex('dados_conta').where({numero_conta}).first();
            const nome = await knex('dados_cliente').where({id_cliente: numero_conta}).select('nome').first();

            if (!conta) return res.status(400).json({mensagem: `Exclusão negada: O numero de conta: ${numero_conta} não foi encontrado.`});
            
            if (parseFloat(conta.saldo) == 0) return res.status(400).json({mensagem: `Exclusão negada: conta de numero: ${numero_conta} possui saldo de ${conta.saldo}, solicitar ao cliente ${nome_resposta(nome.nome)} retirada total do saldo.`});
            
            knex.transaction( async (trx) => {
    
                await trx('dados_conta').where({numero_conta}).del();
                await trx('dados_cliente').where({id_cliente: numero_conta}).del();
                await trx('dados_banco').decrement('qtd_contas', 1);
            });
    
            return res.status(200).json({mensagem: `Exclusão efetivada: a conta de número: ${numero_conta} foi excluída.`})
        }
        
        if (cpf) {
            const conta = await knex('dados_cliente').where({cpf}).first();
            
            if (!conta) return res.status(400).json({mensagem: `Exclusão negada: O CPF: ${cpf} não foi encontrado.`});
            
            const saldo = await knex('dados_conta').where({numero_conta: conta.id_cliente}).select('saldo').first();
            
            if (parseFloat(saldo.saldo) == 0) return res.status(400).json({mensagem: `Exclusão negada: conta de numero: ${conta.id_cliente} possui saldo de ${saldo.saldo}, solicitar ao cliente: ${nome_resposta(conta.nome)} retirada total do saldo.`});
            
            knex.transaction( async (trx) => {
    
                await trx('dados_conta').where({numero_conta: conta.id_cliente}).del();
                await trx('dados_cliente').where({cpf}).del();
                await trx('dados_banco').decrement('qtd_contas', 1);
            });
            
            return res.status(200).json({mensagem: `Exclusão efetivada: a conta de número: ${conta.id_cliente} com CPF: ${cpf} vinculado foi excluída.`});
        }
            
        return res.status(200).json({mensagem: 'Exclusão negada: preencha número da conta ou cpf do cliente.'});
    
    } catch (error) {
        
    }
}

const excluir = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const { id_banco, senha, nome } = req.banco;
   
    if (!instituicao_nome || !instituicao_senha) {
        return res.status(400).json({mensagem: `Exclusão negada: o campo ${!instituicao_nome ? 'nome da instituição' : 'senha da instituição'} não foi preenchido.`}); 
    }
       
    try {
        if (instituicao_nome && instituicao_senha) {
            
            if (instituicao_nome !== nome) return res.status(400).json({mensagem: `Exclusão negada: o banco ${nome_resposta(instituicao_nome)} não é o controlador atual do sistema.`}); 
            
            const senha_correta = await bcrypt.compare(instituicao_senha, senha);

            if (!senha_correta) return res.status(400).json({mensagem: 'Exclusão negada: senha inválida.'});
    
            await knex.transaction(async (trx) => {
                
                await trx('dados_conta').where({ id_banco}).del();
                await trx('dados_cliente').where({ id_banco}).del();
                //await trx('transacoes').where({}).del();
          
                await trx('dados_banco').where({ id_banco }).del();
          
            });    
            
            return res.json({mensagem: `Exclusão efetivada: o banco ${nome_resposta(instituicao_nome)} não é mais o controlador do sistema.`});
        }
        
        return res.json({mensagem: `Exclusão negada: é necessário preencher os campos nome e senha da instituição.`});
        
    } catch (error) {
        return res.status(500).json(`${error.message}`)
    }
}
        
module.exports = {
    cadastro,
    informacoes,
    consulta_conta,
    consulta_cliente,
    atualizar,
    excluir_contaCliente,
    excluir
}


        

