package com.psiplus.service;

import com.psiplus.model.Psicologo;
import com.psiplus.model.Usuario;
import com.psiplus.repository.PsicologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import java.util.List;

@Service
public class PsicologoService {

    @Autowired
    private PsicologoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.psiplus.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private com.psiplus.repository.EnderecoRepository enderecoRepository;

    public List<Psicologo> listarTodos() {
        return repository.findAll();
    }

    public Psicologo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Psicologo salvar(Psicologo psicologo) {
        Usuario usuario = psicologo.getUsuario();

        if (usuario != null) {
            if (psicologo.getPsicologoId() == null) {
                if (usuarioRepository.existsByCpfCnpj(usuario.getCpfCnpj())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado.");
                }
                if (usuarioRepository.existsByEmail(usuario.getEmail())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
                }
            } else {
                Psicologo existente = buscarPorId(psicologo.getPsicologoId());
                if (existente != null && existente.getUsuario() != null) {
                    usuario.setUsuarioId(existente.getUsuario().getUsuarioId());
                    if (usuario.getEndereco() != null && existente.getUsuario().getEndereco() != null) {
                        usuario.getEndereco().setId(existente.getUsuario().getEndereco().getId());
                    }
                }
            }

            if (usuario.getEndereco() != null) {
                var enderecoPersistido = enderecoRepository.save(usuario.getEndereco());
                usuario.setEndereco(enderecoPersistido);
            }

            // Criptografa a senha
            if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
                usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
            }

            usuario = usuarioRepository.save(usuario);
            psicologo.setUsuario(usuario);
        }

        return repository.save(psicologo);
    }


    public void deletar(Long id) {
        repository.deleteById(id);
    }


    public Optional<Psicologo> buscarPorEmail(String email) {
        return repository.findByUsuarioEmail(email);
    }

    public Psicologo autenticar(String email, String senha) {
        return repository.findByUsuarioEmail(email)
                .filter(p -> passwordEncoder.matches(senha, p.getUsuario().getSenha()))
                .orElse(null);
    }
}
