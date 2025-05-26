//Comunicacao entre o banco de dados e a aplicacao (ponte)
package com.psiplus.repository;

import com.psiplus.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
}
