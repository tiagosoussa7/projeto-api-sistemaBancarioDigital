function data_resposta(data) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data);
  }
  
  function hora_resposta(data) {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(data);
  }

  function nome_resposta(nome) {
  const partesDoNome = nome.toLowerCase().split(' ');
  const nomeFormatado = partesDoNome.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return nomeFormatado;
  }

  module.exports = {
    data_resposta,
    hora_resposta,
    nome_resposta
  }