const knex = require('../conexoes/knex');
const bcrypt = require('bcrypt');
const { data_resposta, hora_resposta, nome_resposta, idade_resposta } = require('../validacoes/schema_resposta');

const cadastro = async (req,res) => {
    const { instituicao_nome, senha } = req.body;
    
    if (instituicao_nome && !senha) return res.status(400).json({mensagem: `Cadastro negado: o campo senha é obrigátorio.`});
    if (senha && !instituicao_nome) return res.status(400).json({mensagem: `Cadastro negado: o campo Instituição é obrigátorio.`});
    
    try {
        
        if ( instituicao_nome && senha) {

            const sistema_ocupado = await knex('dados_banco').select('nome').first();
        
            if (sistema_ocupado) {
            
                if (sistema_ocupado.nome == instituicao_nome) {
                    return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(instituicao_nome)} já é a atual controladora do sistema bancário digital.`});
                } else {
                    return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(sistema_ocupado.nome)} é a atual controladora do sistema bancário digital.`});
                }
            }
        
            const senha_criptografada = await bcrypt.hash(senha, 10); 
        
            await knex('dados_banco').insert({
                nome,
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
    const { nome, qtd_contas, orcamento, data_ativacao, hora_ativacao } = req.banco;

    const banco_informacoes = {
        Banco_cadastrada: nome_resposta(nome),
        Contas_ativas: qtd_contas,
        Orçamento_total: orcamento,
        Sistema_ativado: data_resposta(data_ativacao),
        //Horario: hora_resposta(hora_ativacao)
    }
    
    return res.status(200).json({Informações_banco: banco_informacoes});
}

const consulta_conta = async (req, res) => {
    const { numero_conta } = req.body;
    
    try {
        if (numero_conta) {
            const conta_cadastrada = await knex('dados_conta').where({numero_conta: parseInt(numero_conta)}).first();
            if (conta_cadastrada) {
                const conta = await knex.select(
                    'dados_conta.numero_conta',
                    'dados_conta.saldo',
                    'dados_conta.total_saques',
                    'dados_conta.total_depositos',
                    'dados_conta.qtd_transferencias',
                    'dados_conta.abertura_conta',
                    'dados_cliente.nome'
                )
                .from('dados_conta')
                .join('dados_cliente', 'dados_conta.numero_conta', 'dados_cliente.id_cliente')
                .where({numero_conta}).first();
 
                const dados_conta = {
                    Numero_conta: conta.numero_conta,
                    Nome: nome_resposta(conta.nome),
                    Saldo: conta.saldo,
                    Total_saques: conta.total_saques,
                    Total_depositos: conta.total_depositos,
                    Numero_transferências: conta.qtd_transferencias,
                    Conta_aberta: data_resposta(conta.abertura_conta),
                    Horário: hora_resposta(conta.abertura_conta)
                }
                
                return res.status(200).json({Dados_conta: dados_conta})
            } else {
                return res.status(200).json({mensagem: `A conta de número:${numero_conta} não existe no banco ${nome_resposta(req.banco.nome)}.`})
            }
            
        }
        
        const contas = await knex.select(
            'dados_conta.numero_conta',
            'dados_cliente.nome',
            'dados_conta.saldo',
            'dados_conta.total_saques',
            'dados_conta.total_depositos',
            'dados_conta.qtd_transferencias'
        )
        .from('dados_conta')
        .join('dados_cliente', 'dados_conta.numero_conta', 'dados_cliente.id_cliente')
        .orderBy('dados_conta.numero_conta', 'asc');
        
        

        
        return res.status(200).json({Dados_contas: contas});

    } catch (error) {
        return res.status(500).json('erro')
        
    }
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

const excluir = async (req, res) => {
    const { nome, senha } = req.body;
    const { id_banco } = req.banco;
    
    if (!nome || !senha) {
        return res.status(400).json({mensagem: 'Exclusão bloqueada: os campos nome e senha são obrigatórios.'}); 
    }
    
    if (req.banco.nome !== nome) {
        return res.status(400).json({mensagem: `Exclusão bloqueada: o banco ${nome_resposta(nome)} não é o controlador atual do sistema.`}); 
    }

    try {
        const senha_correta = await bcrypt.compare(senha, req.banco.senha);

        if (!senha_correta) return res.status(400).json({mensagem: 'Senha inválida.'});

        await knex.transaction(async (trx) => {
            
            await trx('dados_conta').where({ id_banco}).del();
            await trx('dados_cliente').where({ id_banco}).del();
            //await trx('transacoes').where({}).del();
      
            await trx('dados_banco').where({ id_banco }).del();
      
        });    
        
        return res.json({mensagem: `Exclusão efetivada: o banco ${nome_resposta(nome)} não é mais o controlador do sistema.`});
        
    } catch (error) {
        return res.status(500).json(`${error.message}`)
    }
}
        


//res.status(200).json({mensagem: 'ok'})
module.exports = {
    cadastro,
    informacoes,
    atualizar,
    excluir,
    consulta_conta
}


        

