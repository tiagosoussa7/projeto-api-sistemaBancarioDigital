const deposito = async (req, res) => {
    return res.status(200).json({mensagem: `deposito`});
}
const saque = async (req, res) => {
    return res.status(200).json({mensagem: `saque`});
}
    
const transferencia = async (req, res) => {
    return res.status(200).json({mensagem: `transferência`});
}


module.exports = {
    deposito,
    saque,
    transferencia
}