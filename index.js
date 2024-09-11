const { select } = require('@inquirer/prompts');

const start = async () => {
  while(true){
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar",
        },
        {
          name: "listar metas",
          value: "listar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ]
    });

    switch(opcao){
      case "cadastrar":
        console.log("Vamos cadastrar");
        break;
      case "listar":
        console.log("Listar");
        break;
      case "sair":
        console.log("Saindo...");
        return;
    }
  }
}

start(); 