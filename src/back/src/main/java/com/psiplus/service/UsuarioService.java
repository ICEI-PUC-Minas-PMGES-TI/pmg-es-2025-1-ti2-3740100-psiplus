package com.psiplus.service;

import java.util.List;
import java.util.Optional;
import com.psiplus.model.Usuario;
import com.psiplus.model.Endereco;
import com.psiplus.repository.UsuarioRepository;
import com.psiplus.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EnderecoRepository enderecoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, EnderecoRepository enderecoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.enderecoRepository = enderecoRepository;
    }

    @Transactional
    public Optional<Usuario> buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional
    public Usuario salvarUsuario(Usuario usuario) {
        if (usuario.getUsuarioId() != null) {
            Optional<Usuario> usuarioExistente = usuarioRepository.findById(usuario.getUsuarioId());
            if (usuarioExistente.isPresent()) {
                usuario.setUsuarioId(usuarioExistente.get().getUsuarioId()); // Corrigindo para garantir a atualização correta
            }
        }

        // Se houver endereço, garanta que ele seja persistido corretamente
        if (usuario.getEndereco() != null) {
            Endereco endereco = usuario.getEndereco();
            endereco = enderecoRepository.save(endereco);
            usuario.setEndereco(endereco);
        }

        // Criptografar senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return usuarioRepository.save(usuario); // Retornando o usuário atualizado
    }

    @Transactional
    public Endereco atualizarEndereco(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public boolean autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) return false;

        Usuario usuario = usuarioOpt.get();
        return passwordEncoder.matches(senha, usuario.getSenha());
    }

}
