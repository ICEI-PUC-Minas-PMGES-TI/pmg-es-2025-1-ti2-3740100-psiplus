package com.psiplus.repository;

import com.psiplus.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByCpfCnpj(String cpfCnpj);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

}

