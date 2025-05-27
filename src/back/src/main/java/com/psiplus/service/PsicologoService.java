package com.psiplus.service;

import com.psiplus.model.Psicologo;
import com.psiplus.model.Usuario;
import com.psiplus.repository.PsicologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.List;

@Service
public class PsicologoService {

    @Autowired
    private PsicologoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Psicologo> listarTodos() {
        return repository.findAll();
    }

    public Psicologo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Psicologo salvar(Psicologo psicologo) {
        Usuario usuario = psicologo.getUsuario();
        if (usuario != null && usuario.getSenha() != null) {
            String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
            usuario.setSenha(senhaCriptografada);
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
