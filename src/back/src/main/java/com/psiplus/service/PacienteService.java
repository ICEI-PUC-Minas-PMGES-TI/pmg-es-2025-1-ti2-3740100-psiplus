package com.psiplus.service;

import com.psiplus.DTO.dadosCadastroDTO;
import com.psiplus.DTO.RedefinicaoSenhaDTO;
import com.psiplus.DTO.PacienteDTO;
import com.psiplus.DTO.AnotacaoDTO;
import com.psiplus.model.Paciente;
import com.psiplus.model.Psicologo;
import com.psiplus.model.Usuario;
import com.psiplus.model.Endereco;
import com.psiplus.email.EmailService;
import com.psiplus.util.EmailTemplates;
import com.psiplus.repository.UsuarioRepository;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.EnderecoRepository;
import com.psiplus.repository.PsicologoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
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

    @Autowired 
    private PsicologoRepository psicologoRepository;

    @Autowired
    private EmailService emailService;

    public List<Paciente> listarTodos() {
        return repository.findAll();
    }

    public List<PacienteDTO> buscarPorNome(String nome) {
        return repository.findByUsuarioNomeContainingIgnoreCase("%" + nome + "%")
                .stream()
                .map(PacienteDTO::new)
                .collect(Collectors.toList());
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Paciente salvar(Paciente paciente) {
        // Verificar se paciente tem psicologo setado
        if (paciente.getPsicologo() != null && paciente.getPsicologo().getPsicologoId() != null) {
            Psicologo psicologo = psicologoRepository.findById(paciente.getPsicologo().getPsicologoId())
                    .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));
            paciente.setPsicologo(psicologo);
        } else {
            paciente.setPsicologo(null);
        }

        Usuario usuario = paciente.getUsuario();

        if (usuario != null) {
            if (paciente.getPacienteId() != null) {
                // Atualização: buscar paciente existente
                Paciente existente = buscarPorId(paciente.getPacienteId());
                if (existente == null) {
                    throw new RuntimeException("Paciente não encontrado");
                }

                // Garantir que nome, cpfCnpj e dataNascimento não sejam alterados
                if (existente.getUsuario() != null) {
                    usuario.setNome(existente.getUsuario().getNome());
                    usuario.setCpfCnpj(existente.getUsuario().getCpfCnpj());
                    usuario.setDataNascimento(existente.getUsuario().getDataNascimento());
                    usuario.setUsuarioId(existente.getUsuario().getUsuarioId());

                    // Preservar a senha existente
                    usuario.setSenha(existente.getUsuario().getSenha());

                    // Preservar o ID do endereço, se existir
                    if (usuario.getEndereco() != null && existente.getUsuario().getEndereco() != null) {
                        usuario.getEndereco().setId(existente.getUsuario().getEndereco().getId());
                    }
                }
            } else {
                // Criação: validar CPF e e-mail
                if (usuarioRepository.existsByCpfCnpj(usuario.getCpfCnpj())) {
                    throw new RuntimeException("CPF já cadastrado!");
                }
                if (usuarioRepository.existsByEmail(usuario.getEmail())) {
                    throw new RuntimeException("E-mail já cadastrado!");
                }

                if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
                usuario.setSenha(usuario.getCpfCnpj());

                if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
                usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

                            // **Salvar o endereço antes do usuário**
                if (usuario.getEndereco() != null) {
                    Endereco enderecoPersistido = enderecoRepository.save(usuario.getEndereco()); // <-- Correto!
                    usuario.setEndereco(enderecoPersistido);
                }

                // Definir senha padrão apenas para novos pacientes
                if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
                    usuario.setSenha(usuario.getCpfCnpj());
                }

                // Criptografar a senha antes de salvar
                if (usuario.getSenha() != null && !usuario.getSenha().isBlank()) {
                    usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
                }
            }

            // Salvar o endereço antes do usuário
            if (usuario.getEndereco() != null) {
                Endereco enderecoPersistido = enderecoRepository.save(usuario.getEndereco());
                usuario.setEndereco(enderecoPersistido);
            }

            usuario = usuarioRepository.save(usuario);
            paciente.setUsuario(usuario);
        }

        Paciente salvo = repository.save(paciente);

        String html = EmailTemplates.gerarBoasVindas(usuario.getNome(), usuario.getEmail(), usuario.getCpfCnpj());
        emailService.enviarEmail(usuario.getEmail(), "Bem-vindo ao Psi+", html);

        // Enviar e-mail apenas para novos pacientes
        if (paciente.getPacienteId() == null) {
            String html = EmailTemplates.gerarBoasVindas(usuario.getNome(), usuario.getEmail(), usuario.getCpfCnpj());
            emailService.enviarEmail(usuario.getEmail(), "Bem-vindo ao Psi+", html);
        }

        return salvo;
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<dadosCadastroDTO> listarDadosCadastro(){
        return repository.findAll()
                .stream()
                .map(dadosCadastroDTO::new)
                .collect(Collectors.toList());
    }

    public List<PacienteDTO> listarResumo() {
        return repository.findAll()
                .stream()
                .map(PacienteDTO::new)
                .collect(Collectors.toList());
    }

    public Paciente autenticar(String email, String senha) {
        return repository.findByUsuarioEmail(email)
                .filter(p -> passwordEncoder.matches(senha, p.getUsuario().getSenha()))
                .orElse(null);
    }

    public boolean atualizarHistoricoClinico(Long pacienteId, String anotacoes) {
        Paciente paciente = buscarPorId(pacienteId);
        if (paciente == null) {
            return false;
        }
        paciente.setHistoricoClinico(anotacoes);
        salvar(paciente);
        return true;
    }

    public boolean redefinirSenha(String email, String senhaAntiga, String novaSenha, String confirmarSenha) {
        if (!novaSenha.equals(confirmarSenha)) {
            return false; // Senhas novas não coincidem
        }

        Optional<Paciente> optionalPaciente = repository.findByUsuarioEmail(email);
        if (optionalPaciente.isEmpty()) {
            return false; // Paciente não encontrado
        }

        Paciente paciente = optionalPaciente.get();
        Usuario usuario = paciente.getUsuario();

        // Verifica a senha antiga usando o encoder
        if (!passwordEncoder.matches(senhaAntiga, usuario.getSenha())) {
            return false; // Senha antiga incorreta
        }

        // Criptografa e atualiza a nova senha
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        paciente.setSenhaRedefinida(true);
        usuarioRepository.save(usuario);

        return true;
    }
}
