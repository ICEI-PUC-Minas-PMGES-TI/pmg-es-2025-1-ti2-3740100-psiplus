//Recebe a requisicao para cadastrar um usuario e chama o servico para salvar o usuario no banco de dados
package com.julia.cadastro;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/usuarios")
    public String cadastrarUsuario(@RequestBody Usuario usuario) {
        System.out.println("Cadastrando usuário: " + usuario);
        usuarioService.salvarUsuario(usuario);
        return "Usuário cadastrado com sucesso!";
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        System.out.println("Lista de usuários: " + usuarios);
        return usuarios;
    }
}

