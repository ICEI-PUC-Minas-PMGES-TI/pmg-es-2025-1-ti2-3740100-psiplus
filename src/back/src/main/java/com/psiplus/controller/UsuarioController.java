package com.psiplus.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.psiplus.model.Usuario;
import com.psiplus.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarUsuarioPorId(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        usuario.setUsuarioId(id);

        // **Garantir que o endereço seja persistido antes de salvar o usuário**
        if (usuario.getEndereco() != null) {
            usuario.setEndereco(usuarioService.atualizarEndereco(usuario.getEndereco()));
        }

        Usuario usuarioAtualizado = usuarioService.salvarUsuario(usuario);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @PutMapping("/usuarios/{id}/foto")
    public ResponseEntity<?> atualizarFotoPerfilBase64(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String base64 = body.get("fotoPerfil");

            if (base64 == null || base64.isBlank()) {
                return ResponseEntity.badRequest().body("Base64 da imagem está vazio ou inválido.");
            }

            Usuario usuario = usuarioService.buscarUsuarioPorId(id)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            usuario.setFotoPerfil(base64);
            usuarioService.salvarUsuario(usuario);

            return ResponseEntity.ok().body(Map.of("mensagem", "Foto de perfil atualizada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao atualizar foto de perfil: " + e.getMessage()));
        }
    }

}
