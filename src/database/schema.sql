create database banco;

create table dados_banco (
  id_banco serial primary key,
  nome text not null,
  senha varchar(25) not null,
  qtd_contas decimal(10,2) default 0,
  data_fundacao timestamp default current_timestamp
  );