create database banco;

create table dados_banco (
  id_banco serial primary key,
  nome text not null,
  qtd_contas int default 0,
  orcamento decimal(10, 2) default 0,
  data_ativacao date default current_date,
  hora_ativacao time default current_time,
  senha varchar(255) not null
);
  
create table dados_cliente (
  id_cliente serial primary key,
  nome text not null,
  cpf varchar(14) unique not null,
  email varchar(100) unique not null,
  data_nascimento date not null,
  senha varchar(255) not null,
  id_banco int references dados_banco(id_banco) on delete cascade
);

create table dados_conta (
  numero_conta int references dados_cliente(id_cliente) on delete cascade,
  saldo decimal(10, 2) default 0,
  total_saques decimal(10, 2) default 0,
  total_depositos decimal(10, 2) default 0,
  qtd_transferencias int default 0,
  data_abertura date default current_date,
  hora_abertura time default current_time,
  id_banco int references dados_banco(id_banco) on delete cascade
);

create table dados_depositos (
  numero_conta int references dados_cliente(id_cliente) on delete cascade,
  valor decimal(10, 2),
  data date default current_date,
  hora time default current_time,
  id_banco int references dados_banco(id_banco) on delete cascade
);

create table dados_saques (
  numero_conta int references dados_cliente(id_cliente) on delete cascade,
  valor decimal(10, 2),
  data date default current_date,
  hora time default current_time,
  id_banco int references dados_banco(id_banco) on delete cascade
);

create table transferencias_enviadas (
  conta_origem int references dados_cliente(id_cliente) on delete cascade,
  valor decimal(10, 2),
  conta_destino int,
  data date default current_date,
  hora time default current_time,
  id_banco int references dados_banco(id_banco) on delete cascade
);

create table transferencias_recebidas (
  conta_destino int references dados_cliente(id_cliente) on delete cascade, 
  valor decimal(10, 2),
  conta_origem int,
  data date default current_date,
  hora time default current_time,
  id_banco int references dados_banco(id_banco) on delete cascade
 );