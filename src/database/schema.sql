create database banco;

create table dados_banco (
  id_banco serial primary key,
  nome text not null,
  qtd_contas decimal(10, 2) default 0,
  orcamento decimal(10, 2) default 0,
  data_fundacao timestamp default current_timestamp,
  senha varchar(255) not null
 );
  
  create table dados_cliente (
    id_cliente serial primary key,
    nome text not null,
    cpf varchar(11) unique not null,
    email varchar(100) unique not null,
    data_nascimento date not null,
    senha varchar(255) not null,
    id_banco int references dados_banco(id_banco) on delete cascade
  );