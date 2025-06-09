package com.psiplus.repository;

import com.psiplus.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByPacientePacienteId(Long pacienteId);
}
