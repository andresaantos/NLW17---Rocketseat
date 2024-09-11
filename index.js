const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require('fs').promises;


let mensagem = "Bem vindo ao app de metas!";

let metas;

const carregarMetas = async () => {
  try{
    const dados = await fs.readFile("metas.json", "utf-8");
    metas = JSON.parse(dados);
  }
  catch(err){
    metas = []
  }
}

const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};

const cadstrarMeta = async () => {
  const meta = await input({
    message: "Digite a meta:"
  });

  if(meta.length == 0){
    return mensagem = "Digite uma meta válida!";
  }

  mensagem = "Meta cadastrada com sucesso!"
  metas.push({value: meta, checked: false});
};

const listarMetas = async () => {

  if(metas.length == 0){
    mensagem = "Não existem metas para deletar";
    return
  }
  
  const respostas = await checkbox({
    message: "Use as setas para selecionar as metas, o espaço para marcar e o enter para confirmar.",
    choices: [...metas]
  });

  metas.forEach((m) => {
    m.checked = false;
  })

  if(respostas.length == 0){
    return mensagem = "Nenhuma meta selecionada";
  }

  respostas.forEach((resposta) => {
    const meta =  metas.find((m) => {
      return m.value == resposta
    });
    meta.checked = true;
  });
  mensagem = "Metas listadas com sucesso!";
}

const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if(realizadas.length == 0){
    mensagem = "Não existe metas realizadas";
    return
  }

  await select({
    message: "Metas realizadas" + realizadas.length,
    choices: [...realizadas]
  })

  // mensagem = realizadas;
}

const metasAbertas = async () => {
  const abertas = metas.filter((meta) => {
    return !meta.checked;
  });

  if(abertas.length == 0){
    mensagem = "Não existem metas abertas 😃";
    return 
  }

  await select({
    message: "Metas abertas >" + abertas.length,
    choices: [...abertas]
  })

  mensagem = "Meta aberta com sucesso!";

}

const deletarMetas = async () => {

  if(metas.length == 0){
    mensagem = "Não existem metas para deletar";
    return
  }
  

  const metasDesmarcadas = metas.map((meta) => {
    return {value: meta.value, checked: false};
  });

  const itemsADeletar = await checkbox({
    message: "Selecione item para deletar.",
    choices: [...metasDesmarcadas],
    instructions: false
  });

  if(itemsADeletar.length == 0){
    mensagem = "Nenhum item para deletar";
    return
  }

  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) =>{
      return meta.value != item;
    })
  })

  mensagem = "Metas deletadas com sucesso!";
}

const mostrarMensagem = () => {
  console.clear();
}

const start = async () => {
  await carregarMetas()

  while(true){

    
   await salvarMetas();
   mostrarMensagem();

   if(mensagem != ""){
    console.log(mensagem);
    console.log("");
    mensagem = "";
   }

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
          name: "metas realizadas",
          value: "realizadas",  
        },
        {
          name: "metas abertas",
          value: "abertas",  
        },
        {
          name: "deletar metas",
          value: "deletar",  
        },
        {
          name: "Sair",
          value: "sair",
        },
      ]
    });

    switch(opcao){
      case "cadastrar":
        await cadstrarMeta();
        break;
        
      case "listar":
        await listarMetas()
        break;

      case "realizadas":
        await metasRealizadas();
        break;

      case "abertas":
        await metasAbertas();
        break;

      case "deletar":
        await deletarMetas();
        break;

      case "sair":
        console.log("Saindo...");
        return;
    }
  }
}

start(); 