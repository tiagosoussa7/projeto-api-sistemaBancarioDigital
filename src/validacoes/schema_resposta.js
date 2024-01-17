function data_resposta(data) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data);
  }
  
  function hora_resposta(data) {
    return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(data);
  }

  function nome_resposta(nome) {
    return nome.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }

  module.exports = {
    data_resposta,
    hora_resposta,
    nome_resposta
  }