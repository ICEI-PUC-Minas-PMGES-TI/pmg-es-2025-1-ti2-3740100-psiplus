package com.psiplus.service;

import com.psiplus.DTO.AgendamentoDTO;
import com.psiplus.model.Consulta;
import com.psiplus.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public Consulta agendarConsulta(AgendamentoDTO dto) {
        Consulta nova = new Consulta();
        nova.setPacienteId(dto.pacienteId);
        nova.setPsicologoId(dto.psicologoId); // Se houver
        nova.setData(LocalDate.parse(dto.data));
        nova.setHorarioInicio(LocalTime.parse(dto.horarioInicio));
        nova.setHorarioFim(LocalTime.parse(dto.horarioFim));
        return consultaRepository.save(nova);
    }

    public List<Consulta> listarPorPaciente(Long pacienteId) {
        return consultaRepository.findByPacienteId(pacienteId);
    }

    public List<Consulta> listarPorPsicologo(Long psicologoId) {
        return consultaRepository.findByPsicologoId(psicologoId);
    }
}

