package com.psiplus.controller;

import java.util.List;

import com.psiplus.model.Usuario;
import com.psiplus.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/usuarios/login")
    public ResponseEntity<String> login(@RequestBody Usuario credenciais) {
        boolean autenticado = usuarioService.autenticar(credenciais.getEmail(), credenciais.getSenha());

        if (autenticado) {
            return ResponseEntity.ok("Login bem-sucedido");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }
}
