const idUsuario = document.querySelector('#idUsuario');
const campoNome = document.querySelector('#nome');
const campoEmail = document.querySelector('#email');
const botaoConsultar = document.querySelector('#consultar');
const botaoCadastrar = document.querySelector('#submit');
const cadastrosTabela = document.querySelector('#tabela-cadastros-conteudo');
const formulario = document.querySelector('.formulario-cadastros');

var cadastros = [];

function LerDados() {
    fetch('http://localhost:3333/users', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            cadastros = [];
            for (const id in response) {
                response[id].idUsuario = id;
                cadastros.push(response[id])
            }
            mostrarDados();
        })
        .catch(error => console.log(error));
}

botaoConsultar.addEventListener('click', (event) => {
    event.preventDefault();
    LerDados();
})

const mostrarDados = () => {
    cadastrosTabela.innerHTML = '';
    cadastros.forEach(cadastro => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        const tdNome = document.createElement('td');
        const tdEmail = document.createElement('td');
        const tdAcoes = document.createElement('td'); //cria tdAcoes

        tdId.innerHTML = cadastro.id;
        tdNome.innerHTML = cadastro.name;
        tdEmail.innerHTML = cadastro.email;

        //cria icones de ação
        const iconeEditar = document.createElement('i');
        const iconeRemover = document.createElement('i');

        //adiciona classes aos icones
        iconeEditar.className = 'mdi mdi-pencil';
        iconeRemover.className = 'mdi mdi-delete';

        //adiciona os icones ao tdAcoes
        tdAcoes.appendChild(iconeEditar);
        tdAcoes.appendChild(iconeRemover);
        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        //adiciona tdAcoes na tr
        tr.appendChild(tdAcoes);

        iconeRemover.addEventListener('click', () => Delete(cadastro.id));
        iconeEditar.addEventListener('click', () => loadEdit(cadastro.name));

        //adiciona tr no tbody
        cadastrosTabela.appendChild(tr);
    });
}

const Create = () => {
    const cadastros = {
        name: campoNome.value,
        email: campoEmail.value,
    }
    // if (validaCampos() == false || validaSenha() == false) {
    //     loadEdit(eva.idEVA);
    // }
    fetch('http://localhost:3333/users', {
        method: 'POST', //post, get, put (update), delete
        body: JSON.stringify(cadastros)
    })
        .catch(error => console.log(error));
}

formulario.addEventListener('submit', (event) => {
    if (idUsuario.value !== '') {
        event.preventDefault();
        Update(idUsuario.value);
        limparCampos();
        LerDados();
    } else {
        event.preventDefault();
        Create();
        limparCampos();
        LerDados();
    }

})

function Delete(id) {
    fetch('http://localhost:3333/users/' + id, {
        method: 'DELETE',
    })
        .then(response => LerDados())
        .catch(erro => console.log(erro))
}

function loadEdit(name) {
    fetch('http://localhost:3333/users?search=' + name.replace(/\s+/g, '%20'), {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            idUsuario.value = response[0].id;
            campoNome.value = response[0].name;
            campoEmail.value = response[0].email;
        })
        .catch(error => console.log(error));
        limparCampos();
}

function Update(id) {
    const cadastros = {
        name: campoNome.value,
        email: campoEmail.value,
    }
    fetch('http://localhost:3333/users/' + id, {
        method: 'PUT',
        body: JSON.stringify(cadastros)
    })
        .then(response => LerDados())
        .catch(error => console.log(error));
}

function limparCampos() {
    idUsuario.value = '';
    campoNome.value = '';
    campoEmail.value = '';
}



