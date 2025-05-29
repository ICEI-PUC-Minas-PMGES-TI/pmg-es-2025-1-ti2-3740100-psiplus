package com.psiplus.service;

import com.psiplus.model.Paciente;
import com.psiplus.model.Usuario;
import com.psiplus.repository.UsuarioRepository;
import com.psiplus.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Paciente salvar(Paciente paciente) {
        Usuario usuario = paciente.getUsuario();

        if (usuario != null) {
            // Verifica se está atualizando um paciente existente
            if (paciente.getPacienteId() != null) {
                Paciente existente = buscarPorId(paciente.getPacienteId());

                if (existente != null && existente.getUsuario() != null) {
                    usuario.setUsuarioId(existente.getUsuario().getUsuarioId());

                    if (usuario.getEndereco() != null && existente.getUsuario().getEndereco() != null) {
                        usuario.getEndereco().setId(existente.getUsuario().getEndereco().getId());
                    }
                }
            } else {
                // Verifica duplicidade apenas se for um novo paciente
                if (usuarioRepository.existsByCpfCnpj(usuario.getCpfCnpj())) {
                    throw new RuntimeException("CPF já cadastrado!");
                }
            }

            // Criptografa a senha apenas se for fornecida
            if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
                String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
                usuario.setSenha(senhaCriptografada);
            }

            paciente.setUsuario(usuario);
        }

        return repository.save(paciente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
