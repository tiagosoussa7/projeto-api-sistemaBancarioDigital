function data_resposta(data) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data);
  }
  
  function hora_resposta(horaBanco) {
    horaBanco = horaBanco.toString();

    const horaObjeto = new Date(`2000-01-01T${horaBanco}Z`);
    const opcoes = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' };
    return horaObjeto.toLocaleTimeString([], opcoes);
  }

  function nome_resposta(nome) {
  const partesDoNome = nome.toLowerCase().split(' ');
  const nomeFormatado = partesDoNome.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return nomeFormatado;
  }

  function idade_resposta(dataNascimento) {
    const partesData = dataNascimento.split('/');
    const dataNascimentoObj = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);
    const dataAtual = new Date();
    const diferencaEmMilissegundos = dataAtual - dataNascimentoObj;
    const idade = Math.floor(diferencaEmMilissegundos / (365.25 * 24 * 60 * 60 * 1000));
  
    return idade;
  }

  module.exports = {
    data_resposta,
    hora_resposta,
    nome_resposta,
    idade_resposta
  }