**Travis Status**  
<img align="left" alt="Travis status"  src="https://www.travis-ci.com/ChernoBen/pokeTeam.svg?token=c62HYvrR3yxRwZfGvY8o&branch=main" />
# Bem vindo ao Projeto PokéAPI!

A **PokeAPI** é uma **API** onde o usuário constrói um time contendo **obrigatoriamente 6** pokémons. O usúario precisa se cadastrar para poder montar seu time.  

## Índice:
- [Tenologias](#tec)
- [Sobre as rotas](#about)
- [Rodando](#start)



## Tecnologias <a name="tec"></a>


<img align="left" src="https://img.icons8.com/color/64/000000/nodejs.png"/>


A **PokéApi** utiliza um server node Express para as principais funcionalidades como:
- Cadastro e autenticação de usuário.
- Criação, edição, listagem e deleção de time.


<img align="left" src="https://img.icons8.com/color/48/000000/python--v1.png"/>


Server python Flask como worker para:
- Processar, tratar, e inserir pokemons e atributos na base de dados.

<img align="left" src="https://img.icons8.com/color/48/000000/mongodb.png"/>


Mongo DataBase  para e por : 
  - Armazenar todos os dados
  - Poder utilizar conceitos relacionais sem herdar os problemas de normalização clássicos. 
  Ex: um pokemon pode ter atributos e habilidades variadas. Sendo sua instancia:
   {
		   pokemon:"bulbasaur",
		   attibutes: ['grass', 'poison']
   }


<img align="left" src="https://img.icons8.com/fluent/48/000000/docker.png"/>


Docker para:
  - Conteinerização da aplicação facilitando a execução de testes de integração


<img align="left" src="https://img.icons8.com/color/48/000000/travis-ci.png"/>


TravisCI para:
  - Execução de testes de building e integration.

## Rotas <a name="about"></a>

**POST**`/user`:

- Criar usuario passando:
-> name, email e password
	- Status:
		- 201 - Para usuário cadastrado com sucesso.
		- 400 - Para entradas inválidas como por exemplo uma senha pequena demais, um email inválido ou já cadastrado.
		- 500 - Para erros no processo interno como por exemplo uma possível falha de conexão com a base de dados.
		 
**POST** `/auth`:

-  Obter token de autenticação:
	-> email e password
	- Status:
		- 200 - Para token gerado com sucesso.
		-  403 - Para entradas invalidas como email ou senha inválidos .
		- 500 - Para erros no processo interno como por exemplo uma possível falha de conexão com a base de dados.

**GET** `/pokemon `:
	
- Obter listagem de pokemons podendo ou não passar parametros opcionais:
	
	->attributes, _id, name
	- Status :
		-  200 - Listagem obtida com sucesso.
		- 401 - Não autorizado, ex: token inválido ou não passado.
		- 404 - Não encontrado, ex: Pokémon especificado não entrado.

**POST**`/team`:

- Cria um time entrando com um array de nomes de pokémons contento obrigatoriamente 6 pokémons:
	
	->"pokemons":["name"..."N-name]
	
	- Status:
		 
		- 201 - Pokemons cadastrados com sucesso.
		- 400 - Entrada de dados irregulares como por exemplo nomes inválidos de pokémons ou array maior ou menos que 6.
		- 401 - Usuario não atenticado, ex: usuario não cadastrado ou token inválido.
		- 404 - Entrada de nomes inválidos de pokémons.


## Tecnologias <a name="tec"></a>

**GET**`/team`:

- Obter time criado pelo usuário e listagem de atributos de "counteram" a formação:
	
	-> **não possui entradas de dados**

	- Status:
		
		- 200 - Obteve o time com sucesso.
		- 401 - Usuario não autenticado.

**PUT**`/team`:

- Alterar formação do time. O usuário insere no array "pokemons" os nomes dos pokémons que deseja alterar e em newPokémons os pokémons que deseja adicionar no lugar.
-> "pokemons":["originais",..."originaisN"]
-> "newPokemons":["newOne",..."newOneN"] 

	- Status:
		
		- 200 - Time alterado com sucesso. 
		- 400 - Entrada de dados inválidos.
		- 401 - Não autorizado.
		- 500 - Erro interno no servidor.

**DELETE**`/team`:

- Deletar time passado o _id (do time claro):
	->_id
	
	- Status:
		
		- 202 - Time deletado com sucesso.
		- 400 - Entrada de dados inválidos .
		- 401 - Usuario não autenticado.
		- 404 - Time não encontrado.

 ## Rodando: <a name="start"></a>

 - Certifique-se que sua máquina possui docker instalado e devidademente atualizado.
 - Clone este repositório
 - Siga até a raiz do projeto e execute o comando:
	 >sudo docker-compose up --build
 - Para testar as rotas da aplicação no navegador, siga para endereço:
	>localhost:3000/doc
 - Para executar a suite de tetes execute o comando:
    > sudo docker-compose -f docker-compose-test.yml -p tests run --rm api npm run test

**OBS:**  Após obter o token de autenticação, clique no cadiado, cole no campo **value** e click em authorize para poder utilizar todas as rotas que precisam de autenticação. 
