package com.psiplus.service;

import com.psiplus.DTO.PacienteDTO;
import com.psiplus.model.Paciente;
import com.psiplus.model.Usuario;
import com.psiplus.model.Endereco;
import com.psiplus.repository.UsuarioRepository;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EnderecoRepository enderecoRepository;

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Paciente salvar(Paciente paciente) {
        Usuario usuario = paciente.getUsuario();

        if (usuario != null) {
            if (paciente.getPacienteId() != null) {
                Paciente existente = buscarPorId(paciente.getPacienteId());

                if (existente != null && existente.getUsuario() != null) {
                    usuario.setUsuarioId(existente.getUsuario().getUsuarioId());

                    if (usuario.getEndereco() != null && existente.getUsuario().getEndereco() != null) {
                        usuario.getEndereco().setId(existente.getUsuario().getEndereco().getId());
                    }
                }
            } else {
                if (usuarioRepository.existsByCpfCnpj(usuario.getCpfCnpj())) {
                    throw new RuntimeException("CPF já cadastrado!");
                }

                if (usuarioRepository.existsByEmail(usuario.getEmail())) {
                    throw new RuntimeException("E-mail já cadastrado!");
                }
            }

            // **Salvar o endereço antes do usuário**
            if (usuario.getEndereco() != null) {
                Endereco enderecoPersistido = enderecoRepository.save(usuario.getEndereco()); // <-- Correto!
                usuario.setEndereco(enderecoPersistido);
            }

            // **Criptografar a senha antes de salvar**
            if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
                usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
            }

            usuario = usuarioRepository.save(usuario);
            paciente.setUsuario(usuario);
        }

        return repository.save(paciente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<PacienteDTO> listarResumo() {
        return repository.findAll()
                .stream()
                .map(PacienteDTO::new)
                .collect(Collectors.toList());
    }
}
