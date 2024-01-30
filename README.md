# _API - Sistema Bancário_

_Essa **RESTful API** simula algumas das principais funcionalidades de um sistema bancário back-end. Ao cadastrar um banco e ativa o sistema através do login, imediatamente são liberadas as funcionalidades relacionadas ao banco e ao cadastro de clientes para abertura de contas._

_Algumas dessas funcionalidades são geração de informações do banco, consulta indivídual ou geral de dados cadastrais e contas dos clientes, atualização e exclusão de dados do banco etc._

_Já em relação a abertura de conta, ao ser realizado o primeiro cadastro de cliente é gerado automaticamente um conta, ao qual feito login dá acesso as diversas funcionalidades, sendo algumas delas, acesso a informações de dados cadastrados, consulta a dados da conta, geração de relatórios de depositos, saques e transferências etc._

## _Funcionalidades do Projeto_

### `Banco:`

- _Cadastro do banco controlador do sistema._
- _Login banco - ativação do sistema._
- _Consulta detalhada de informações do banco._
- _Consulta de contas bancárias ativas do banco._
- _Consulta de dados cadastrais dos clientes._
- _Exclusão de conta bancário do cliente._
- _Atualização de dados cadastrais do banco._
- _Exclusão de dados cadastrais do banco._

### `Conta:`

- _Casdatro de cliente e abertura automática de conta bancária._
- _Login cliente._
- _Consulta detalhada de informações do cliente._
- _Consulta detalhada de informações da conta bancário._
- _Atualização de dados cadastrais do cliente._
- _Exclusão de dados cadastrais e conta bancária do cliente._
- _Consulta de extrato._
- _Efetuar deposito._
- _Efetuar saque._
- _Efetuar transferências._

## _Rodando o projeto_

## _Endpoints - Banco:_

<details>
<summary><b>Cadastro banco</b></summary>
<br>

#### `POST/banco`

_Essa rota é utilizada para o cadastro do banco controlador do sistema._

#### _Requisição:_

_Sem parametros de rota ou query. O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes)._

- _instituicao_nome_
- _instituicao_senha_

#### _Requisitos obrigatórios:_

- _Valida se os campos **instituicao_nome** e **instituicao_senha** foram passados corretamente._
- _Valida se já existe um banco controlador cadastrado no sistema._
- _Criptografa a senha antes de pesistir no banco de dados._
- _Cadastra o banco que irá controlar o sistema._

#### _Resposta:_

_Caso haja **sucesso** na requisição de cadastro, o corpo (body) da resposta haverá um objeto com uma propriedade mensagem escrito: **"Cadastro efetivado: a instituição (instituicao_nome) agora é controladora do sistema bancário digital"**._

// imagem

</details>

<details>
<summary><b>Login banco</b></summary>
<br>

## _Login banco_

#### `POST/banco/login`

_Essa rota permite que o banco controlador cadastrado realize login e ative o sistema e as funcionalidades do banco como também ativa a rota de cadastro de contas._

#### _Requisição:_

_Sem parametros de rota ou query. O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes)._

- _instituicao_nome_
- _instituicao_senha_

#### _Requisitos obrigatórios:_

- _Valida se os campos **instituicao_nome** e **instituicao_senha** foram passados corretamente._
- _Verifica se o nome e a senha da instituição conferem com a do cadastro._
- _Cria um token de autenticação para o banco._

#### _Resposta:_

_Caso haja **sucesso** na requisição de login, o corpo (body) da resposta haverá um objeto com a propriedade token, que deverá possuir como valor o token de autenticação gerado._

// imagem

</details>

##

#### **_ATENÇÃO: todas as funcionalidades (endpoints) do banco a seguir, exigirão o token de autenticação do banco controlador do sistema logado. Portanto será necessário validar o token informado_**

##

<details>
<summary><b>Informações banco</b></summary>
<br>

#### `GET/banco/informacao`

_Essa rota é utilizada para o gerar um relatório com o nome do banco cadastrado, a quantidade de contas ativas, o orçamento total do banco, ao qual é a soma do saldo de todas as contas ativas e a data e horário de ativação do sistema bancário._

#### _Requisição:_

_Sem parametros de rota ou query.O corpo (body) da requisição não deverá possuir nenhum conteúdo._

#### _Requisitos obrigatórios:_

- _O endpoint informará em forma de objeto as informações do banco._

#### _Resposta:_

_Caso haja **sucesso** na requisição, o corpo (body) da resposta haverá um objeto com as informações detalhadas do banco._

// imagem

</details>

<details>
<summary><b>Consultar contas</b></summary>
<br>

#### `GET/banco/consultar/conta`

_Essa rota permite ao banco fazer duas modalidades de consulta, uma indivídual, passando o número da conta que ele deseja consultar e a outra generalizada, ao qual todas as contas que ele possui no banco de dados seram exibidas._

#### _Requisição:_

_Sem parametros de rota. O corpo (body) não possuirá requisição em caso de consulta geral de contas, e deverá possuir requisição em caso de consulta indivídual de conta, com um objeto com a seguinte propriedade (respeitando este nome)._

- _numero_conta_

#### _Requisitos obrigatórios:_

- **_Em caso de consulta indivídual de conta_**:
- - _valida se o campo **numero_conta** foi passado corretamente._
- _Valida se o número de conta existe no banco de dados._

#### _Resposta:_

_Caso haja **sucesso** na requisição, no corpo (body) da resposta haverá, em caso de consulta geral, um objeto com a listagem de todas as contas no banco ou, em caso de consulta indivídual, um objeto com as informações da conta consultada._

// imagem

</details>

<details>
<summary><b>Consultar clientes</b></summary>
<br>

### _Consultar clientes_

#### `GET/banco/consultar/cliente`

_Essa rota permite ao banco fazer duas modalidades de consulta, uma indivídual, passando o CPF do cliente que ele deseja consultar e a outra generalizada, ao qual são listados todos os dados dos clientes com conta no banco._

#### _Requisição:_

_Sem parametros de rota ou query. O corpo (body) não possuirá requisição em caso de consulta geral de dados dos clientes, e deverá possuir requisição em caso de consulta indivídual de dados do cliente, com um objeto com a seguinte propriedade (respeitando este nome)._

- _cpf_

#### _Requisitos obrigatórios:_

- **_Em caso de consulta indivídual de conta_**:
- - _valida se o campo **CPF** foi passado corretamente._
- _Valida se o CPF existe no banco de dados._

#### _Resposta:_

_Caso haja **sucesso** na requisição, no corpo (body) da resposta haverá, em caso de consulta geral, um objeto com a listagem de todas os dados dos clientes no banco ou, em caso de consulta indivídual, um objeto com as informações dos dados do cliente consultado._

//imagem

</details>

<details>
<summary><b>Atualizar dados</b></summary>
<br>

#### `PUT/banco`

_Essa rota permite ao banco modificar seus dados cadastrais._

#### _Requisição:_

_Sem parametros de rota. O corpo (body) não possuirá requisição em caso de consulta geral de contas, e deverá possuir requisição em caso de consulta indivídual de conta, com um objeto com a seguinte propriedade (respeitando este nome)._

- _numero_conta_

#### _Requisitos obrigatórios:_

- **_Em caso de consulta indivídual de conta_**:
- - _valida se o campo **numero_conta** foi passado corretamente._
- _Valida se o número de conta existe no banco de dados._

#### _Resposta:_

_Caso haja **sucesso** na requisição, no corpo (body) da resposta haverá, em caso de consulta geral, um objeto com a listagem de todas as contas no banco ou, em caso de consulta indivídual, um objeto com as informações da conta consultada._

</details>

<details>
<summary><b>Excluir: conta cliente</b></summary>
<br>

</details>

<details>
<summary><b>Excluir: cadastro do banco</b></summary>
<br>

</details>

## _Endpoints - Conta:_

<details>
<summary><b>Cadastro</b></summary>
<br>
</details>

<details>

<summary><b>Login conta</b></summary>
<br>
</details>

<details>
<summary><b>Informações conta</b></summary>
<br>
</details>

<details>
<summary><b>Informações cliente</b></summary>
<br>
</details>

<details>
<summary><b>Extrato</b></summary>
<br>
</details>

<details>
<summary><b>Atualizar dados cadastrais</b></summary>
<br>
</details>

<details>
<summary><b>Excluir conta</b></summary>
<br>
</details>

## _Endpoints - Transações:_

<details>
<summary><b>Deposito</b></summary>
<br>
</details>

<details>
<summary><b>Saque</b></summary>
<br>
</details>

<details>
<summary><b>Transferência</b></summary>
<br>
</details>

##

_Principais ferramentas para desenvolvimento do projeto:_

#

- _Javascript_
- _Express_
- _Joi_
- _Nodemon_
- _Postgres_
- _VisualStudioCode_
- _Beekeeper_
- _Insomnia_
- _Knex_
- _Jsonwebtoken_
- _Bcrypt_
- _Dotenv_
