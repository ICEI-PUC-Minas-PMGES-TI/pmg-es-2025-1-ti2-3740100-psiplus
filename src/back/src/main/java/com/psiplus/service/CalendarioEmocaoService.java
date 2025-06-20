package com.psiplus.service;

import com.psiplus.DTO.CalendarioEmocaoDTO;
import com.psiplus.model.CalendarioEmocao;
import com.psiplus.model.Paciente;
import com.psiplus.model.TipoEmocao;
import com.psiplus.repository.CalendarioEmocaoRepository;
import com.psiplus.DTO.ContagemEmocaoDTO;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.TipoEmocaoRepository;
import com.psiplus.util.EmocaoDuplicadaException;
import com.psiplus.util.EntidadeNaoEncontradaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class CalendarioEmocaoService {

    @Autowired
    private CalendarioEmocaoRepository calendarioEmocaoRepository;

    @Autowired
    private TipoEmocaoRepository tipoEmocaoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public CalendarioEmocaoDTO criarEmocao(CalendarioEmocaoDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Paciente não encontrado"));

        TipoEmocao tipoEmocao = tipoEmocaoRepository.findById(dto.getTipoEmocaoId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Tipo de emoção não encontrado"));

        List<CalendarioEmocaoDTO> emocoesDoPaciente = listarPorPacienteId(dto.getPacienteId());

        boolean jaExiste = emocoesDoPaciente.stream().anyMatch(e ->
                e.getData().equals(dto.getData()) && e.getHora().equals(dto.getHora())
        );

        if (jaExiste) {
            throw new EmocaoDuplicadaException("Já existe uma emoção cadastrada neste horário para esse paciente.");
        }

        CalendarioEmocao emocao = new CalendarioEmocao();
        emocao.setPaciente(paciente);
        emocao.setTipoEmocao(tipoEmocao);
        emocao.setData(dto.getData());
        emocao.setHora(dto.getHora());
        emocao.setSentimento(dto.getSentimento());
        emocao.setNotas(dto.getNotas());

        CalendarioEmocao salvo = calendarioEmocaoRepository.save(emocao);
        return toDTO(salvo);
    }

    public List<CalendarioEmocao> listarTodos() {
        return calendarioEmocaoRepository.findAll();
    }

    public List<CalendarioEmocaoDTO> listarPorPacienteId(Long pacienteId) {
        return calendarioEmocaoRepository.findByPacienteIdComTipoEmocao(pacienteId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<CalendarioEmocaoDTO> listarPorPacienteEData(Long pacienteId, LocalDate data) {
        return calendarioEmocaoRepository.findByPacienteIdAndDataComTipoEmocao(pacienteId, data)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // Novo método para período genérico (intervalo entre datas)
    public List<CalendarioEmocaoDTO> listarPorPacienteEPeriodo(Long pacienteId, LocalDate dataInicio, LocalDate dataFim) {
        return calendarioEmocaoRepository.findByPaciente_PacienteIdAndDataBetween(pacienteId, dataInicio, dataFim)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // Filtrar pelo dia atual
    public List<CalendarioEmocaoDTO> listarPorPacienteIdEDiaAtual(Long pacienteId) {
        LocalDate hoje = LocalDate.now();
        return listarPorPacienteEData(pacienteId, hoje);
    }

    // Filtrar pela semana atual (segunda a domingo)
    public List<CalendarioEmocaoDTO> listarPorPacienteIdESemanaAtual(Long pacienteId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioSemana = hoje.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate fimSemana = hoje.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return listarPorPacienteEPeriodo(pacienteId, inicioSemana, fimSemana);
    }

    // Filtrar pelo mês atual
    public List<CalendarioEmocaoDTO> listarPorPacienteIdEMesAtual(Long pacienteId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());
        return listarPorPacienteEPeriodo(pacienteId, inicioMes, fimMes);
    }

    public CalendarioEmocaoDTO toDTO(CalendarioEmocao entity) {
        CalendarioEmocaoDTO dto = new CalendarioEmocaoDTO();
        dto.setId(entity.getId());
        dto.setPacienteId(entity.getPaciente().getPacienteId());
        dto.setTipoEmocaoId(entity.getTipoEmocao().getId());
        dto.setTipoEmocaoNome(entity.getTipoEmocao().getNome());
        dto.setData(entity.getData());
        dto.setHora(entity.getHora());
        dto.setSentimento(entity.getSentimento());
        dto.setNotas(entity.getNotas());
        return dto;
    }

    public List<ContagemEmocaoDTO> contarEmocoesPorPeriodo(Long pacienteId, int dias) {
        LocalDate dataInicio = LocalDate.now().minusDays(dias);
        LocalDate dataFim = LocalDate.now();
        return calendarioEmocaoRepository.contarPorPeriodo(pacienteId, dataInicio, dataFim);
    }

}
