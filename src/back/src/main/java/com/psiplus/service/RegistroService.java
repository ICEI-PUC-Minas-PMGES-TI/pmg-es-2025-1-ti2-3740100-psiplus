package com.psiplus.service;

import com.psiplus.DTO.AnotacaoDTO;
import com.psiplus.model.Paciente;
import com.psiplus.model.Registro;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public Registro salvarRegistro(AnotacaoDTO dto) {
        Long pacienteId = dto.getPacienteId();
        if (pacienteId == null) {
            throw new IllegalArgumentException("PacienteId não pode ser nulo");
        }
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Registro registro = new Registro();
        registro.setPaciente(paciente);
        registro.setData(dto.getData());
        registro.setHora(dto.getHora());
        registro.setAnotacao(dto.getConteudo());

        return registroRepository.save(registro);
    }

    public List<Registro> listarPorPaciente(Long pacienteId) {
        if (pacienteId == null) {
            throw new IllegalArgumentException("PacienteId não pode ser nulo");
        }
        return registroRepository.findByPacientePacienteId(pacienteId);
    }
}
