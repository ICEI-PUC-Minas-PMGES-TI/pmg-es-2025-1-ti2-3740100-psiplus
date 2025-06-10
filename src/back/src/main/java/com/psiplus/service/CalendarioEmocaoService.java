package com.psiplus.service;

import com.psiplus.model.CalendarioEmocao;
import com.psiplus.repository.CalendarioEmocaoRepository;
import com.psiplus.DTO.CalendarioEmocaoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class CalendarioEmocaoService {

    @Autowired
    private CalendarioEmocaoRepository calendarioEmocaoRepository;

    public CalendarioEmocao salvar(CalendarioEmocao emocao) {
        return calendarioEmocaoRepository.save(emocao);
    }

    public List<CalendarioEmocao> listarTodos() {
        return calendarioEmocaoRepository.findAll();
    }

    public List<CalendarioEmocaoDTO> listarPorPacienteId(Long pacienteId) {
        return calendarioEmocaoRepository.findByPaciente_PacienteId(pacienteId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<CalendarioEmocaoDTO> listarPorPacienteEData(Long pacienteId, LocalDate data) {
        return calendarioEmocaoRepository.findByPaciente_PacienteIdAndData(pacienteId, data)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CalendarioEmocaoDTO toDTO(CalendarioEmocao entity) {
        CalendarioEmocaoDTO dto = new CalendarioEmocaoDTO();
        dto.setId(entity.getId());
        dto.setPacienteId(entity.getPaciente().getPacienteId());
        dto.setTipoEmocaoId(entity.getTipoEmocao().getId());
        dto.setData(entity.getData());
        dto.setHora(entity.getHora());
        dto.setSentimento(entity.getSentimento());
        dto.setNotas(entity.getNotas());
        return dto;
    }
}
