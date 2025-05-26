package com.psiplus.controller;

import java.util.List;

import com.psiplus.model.Usuario;
import com.psiplus.service.UsuarioService;
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
