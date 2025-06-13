package com.psiplus.service;

import com.psiplus.DTO.AgendamentoDTO;
import com.psiplus.DTO.ConsultaDTO;
import com.psiplus.model.Consulta;
import com.psiplus.model.Paciente;
import com.psiplus.model.Psicologo;
import com.psiplus.repository.ConsultaRepository;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.PsicologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private PsicologoRepository psicologoRepository;

    public Consulta agendarConsulta(AgendamentoDTO dto) {
        Consulta nova = new Consulta();
        nova.setPacienteId(dto.getPacienteId());
        nova.setPsicologoId(dto.getPsicologoId());
        nova.setData(dto.getData());
        nova.setHorarioInicio(dto.getHorarioInicio());
        nova.setHorarioFim(dto.getHorarioFim());
        return consultaRepository.save(nova);
    }

    public List<Consulta> listarPorPaciente(Long pacienteId) {
        return consultaRepository.findByPacienteId(pacienteId);
    }

    public List<Consulta> listarPorPsicologo(Long psicologoId) {
        return consultaRepository.findByPsicologoId(psicologoId);
    }

    public Consulta reagendarConsulta(Long id, AgendamentoDTO dto) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        consulta.setData(dto.getData());
        consulta.setHorarioInicio(dto.getHorarioInicio());
        consulta.setHorarioFim(dto.getHorarioFim());

        return consultaRepository.save(consulta);
    }

    public ConsultaDTO buscarConsultaDetalhada(Long idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        Paciente paciente = pacienteRepository.findById(consulta.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Psicologo psicologo = psicologoRepository.findById(consulta.getPsicologoId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        ConsultaDTO dto = new ConsultaDTO();
        dto.setIdConsulta(consulta.getId());
        dto.setData(consulta.getData());
        dto.setHorarioInicio(consulta.getHorarioInicio());
        dto.setHorarioFim(consulta.getHorarioFim());
        dto.setPacienteId(paciente.getPacienteId());
        dto.setPacienteNome(paciente.getUsuario().getNome());
        dto.setPsicologoId(psicologo.getPsicologoId());
        dto.setPsicologoNome(psicologo.getUsuario().getNome());

        return dto;
    }

    public boolean excluirConsulta(Long id) {
        Optional<Consulta> consultaOpt = consultaRepository.findById(id);
        if (consultaOpt.isPresent()) {
            consultaRepository.deleteById(id);
            return true;
        }
        return false;
    }



}

