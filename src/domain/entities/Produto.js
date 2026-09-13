const CATEGORIAS_VALIDAS = ['LANCHE', 'BEBIDA', 'SOBREMESA', 'ACOMPANHAMENTO'];

class Produto {
    constructor({ id, nome, categoria, preco, tempoPreparoMinutos, ativo = true}){
        Produto.validar({nome, categoria, preco, tempoPreparoMinutos});

        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.tempoPreparoMinutos = tempoPreparoMinutos;
        this.ativo = ativo;
    }

    static validar({nome, categoria, preco, tempoPreparoMinutos}){
        if(!nome || String(nome).trim().length === 0){
            throw new Error('Nome do produto é obrigatório');
        }
        if(!CATEGORIAS_VALIDAS.includes(categoria)){
            throw new Error(`Categoria inválida. Use uma de: ${CATEGORIAS_VALIDAS.join(', ')}`);
        }
        if(typeof preco !== 'number' || preco <= 0){
            throw new Error('Preço deve ser um número maior que zero');
        }
        if(typeof tempoPreparoMinutos !== 'number' || tempoPreparoMinutos < 0){
            throw new Error('Tempo de preparo deve ser um número maior ou igual a zero');
        }
    }

    atualizar({ nome, categoria, preco, tempoPreparoMinutos, ativo}){
        const dadosFinais = {
            nome: nome !== undefined ? nome : this.nome,
            categoria: categoria !== undefined ? categoria : this.categoria,
            preco: preco !== undefined ? preco : this.preco,
            tempoPreparoMinutos: tempoPreparoMinutos !== undefined ? tempoPreparoMinutos : this.tempoPreparoMinutos,
        };
        Produto.validar(dadosFinais);

        this.nome = dadosFinais.nome;
        this.categoria = dadosFinais.categoria;
        this.preco = dadosFinais.preco;
        this.tempoPreparoMinutos = dadosFinais.tempoPreparoMinutos;
        if (ativo !== undefined) this.ativo = ativo;
    }
}

Produto.CATEGORIAS_VALIDAS = CATEGORIAS_VALIDAS;
module.exports = Produto;