const { nome_resposta } = require('../util/util_resposta.js');

const { 
    comparar_senha, 
    checar_cpf, 
    checar_banco, 
    checar_conta, 
    checar_saldo 
} = require('../util/util_funcionalidades.js');

const { insert_banco } = require('../util/banco/util_cadastrar.js');

const { informacao_banco } = require('../util/banco/util_informacao.js');

const { 
    conta_consultada, 
    contas_consultadas 
} = require('../util/banco/util_consultaConta.js');

const { 
    cliente_consultado, 
    clientes_consultados 
} = require('../util/banco/util_consultaCliente.js');

const { 
    update_banco1, 
    update_banco2, 
    update_banco3 
} = require('../util/banco/util_atualizar.js');

const { 
    delete_conta, 
    nome 
} = require('../util/banco/util_excluirContaCliente.js');

const { 
    somar_saldos, 
    delete_banco 
} = require('../util/banco/util_excluir.js');

const cadastrar = async (req,res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    
    try {
        const banco = await checar_banco();
        
        if (banco) {
            if (banco.nome == instituicao_nome) { return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(instituicao_nome)} já é a atual controladora do sistema bancário digital.`});
            
            } else return res.status(400).json({mensagem: `Cadastro negado: a instituição ${nome_resposta(banco.nome)} é a atual controladora do sistema bancário digital.`});
        }
        await insert_banco(instituicao_nome, instituicao_senha);
        
        return res.status(200).json({mensagem: `Cadastro efetivado: a instituição ${nome_resposta(instituicao_nome)} agora é controladora do sistema bancário digital.`});
    } catch (error) {
        return res.status(500).json({mensagem: `${error.message}`});
    }
}                   
                                              
const informacoes = async (req, res) => {
    const { banco } = req;
    return informacao_banco(banco, res);
}

const consulta_conta = async (req, res) => { 
    const { numero_conta } = req.body;
    
    if (numero_conta) return conta_consultada(numero_conta, res);
    return contas_consultadas(res);
}

const consulta_cliente = async (req, res) => {
    const { cpf } = req.body;
    
    if (cpf) return cliente_consultado(cpf, res);
    return clientes_consultados(res);
}
        
const atualizar = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const { id_banco, nome, senha } = req.banco;
    
    try {   
            if (instituicao_nome && instituicao_senha) {
                
                if (instituicao_nome === nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(instituicao_nome) } é o mesmo do banco controlador do sistema.`});
                
                if (await comparar_senha(instituicao_senha, senha)) return res.status(401).json({mensagem: `Atualização negada: a senha da atualização é a mesma do banco cadastrado no sistema.`});
                
                await update_banco1(instituicao_nome, instituicao_senha, id_banco);
                
                return res.status(200).json({mensagem: `Atualização efetivada: o nome e a senha da instituição foram modificados.`});
            }
                                           
            if (instituicao_nome) {
                if (instituicao_nome === nome) return res.status(400).json({mensagem: `Atualização negada: o nome ${nome_resposta(instituicao_nome) } é o mesmo do banco controlador do sistema.`});
                await update_banco2(instituicao_nome, id_banco);
                return res.status(200).json({mensagem: `Atualização efetivada: o banco: ${nome_resposta(req.banco.nome)} agora se chama ${nome_resposta(instituicao_nome)}.`});
            }
                
            if (instituicao_senha) { 
                if (await comparar_senha(instituicao_senha, senha)) return res.status(401).json({mensagem: `Atualização negada: a senha da atualização é a mesma do banco cadastrado no sistema.`});
                await update_banco3(instituicao_senha, id_banco);
                return res.status(200).json({mensagem: `Atualização efetivada: a senha da instituição foi modificada.`});
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
            const conta = await checar_conta(numero_conta);

            if (!conta) return res.status(400).json({mensagem: `Exclusão negada: O numero de conta: ${numero_conta} não foi encontrado.`});
            
            if (conta.saldo > 0) return res.status(400).json({mensagem: `Exclusão negada: conta de numero: ${numero_conta} possui saldo de ${conta.saldo}, solicitar ao cliente ${nome_resposta(await nome(numero_conta))} retirada total do saldo.`});
            
            await delete_conta(numero_conta);

            return res.status(200).json({mensagem: `Exclusão efetivada: a conta de número: ${numero_conta}, cliente ${nome_resposta(await nome(numero_conta))} foi excluída.`});
        }
        
        if (cpf) {
            const conta = await checar_cpf(cpf);
            
            if (!conta) return res.status(400).json({mensagem: `Exclusão negada: O CPF: ${cpf} não foi encontrado.`});
            
            const saldo = await checar_saldo(conta.id_cliente);
            
            if (saldo > 0) return res.status(400).json({mensagem: `Exclusão negada: conta de numero: ${conta.id_cliente} possui saldo de ${saldo}, solicitar ao cliente: ${nome_resposta(conta.nome)} retirada total do saldo.`});
            
            await delete_conta(conta.id_cliente);
            
            return res.status(200).json({mensagem: `Exclusão efetivada: a conta de número: ${conta.id_cliente}, cliente ${conta.nome} e com CPF: ${cpf} vinculado foi excluída.`});
        }
            
        return res.status(200).json({mensagem: 'Exclusão negada: preencha número da conta ou cpf do cliente.'});
    } catch (error) {
        return res.status(500).json(`${error.message}`)
    }
}

const excluir = async (req, res) => {
    const { instituicao_nome, instituicao_senha } = req.body;
    const { id_banco, senha, nome } = req.banco;
         
    try {
        if (instituicao_nome !== nome) return res.status(400).json({mensagem: `Exclusão negada: o banco ${nome_resposta(instituicao_nome)} não é o controlador atual do sistema.`}); 
            
        if (!await comparar_senha(instituicao_senha, senha)) return res.status(400).json({mensagem: 'Exclusão negada: senha inválida.'});

        if (await somar_saldos(id_banco) > 0) return res.status(400).json({mensagem: `Exclusão negada: o banco ${nome_resposta(instituicao_nome)} possui contas com saldo.`})
            
        await delete_banco(id_banco);
            
        return res.json({mensagem: `Exclusão efetivada: o banco ${nome_resposta(instituicao_nome)} não é mais o controlador do sistema.`});
    } catch (error) {
        return res.status(500).json(`${error.message}`)
    }
}

module.exports = {
    cadastrar,
    informacoes,
    consulta_conta,
    consulta_cliente,
    atualizar,
    excluir_contaCliente,
    excluir
}