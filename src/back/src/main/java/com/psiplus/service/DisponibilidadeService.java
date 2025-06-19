package com.psiplus.service;

import com.psiplus.DTO.HorarioDisponivelDTO;
import com.psiplus.model.Consulta;
import com.psiplus.model.DisponibilidadeRecorrente;
import com.psiplus.model.ExcecaoDisponibilidade;
import com.psiplus.model.Paciente;
import com.psiplus.repository.ConsultaRepository;
import com.psiplus.repository.DisponibilidadeRecorrenteRepository;
import com.psiplus.repository.ExcecaoDisponibilidadeRepository;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.util.TipoExcecao;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.time.temporal.ChronoUnit;


@Service
public class DisponibilidadeService {

    private final DisponibilidadeRecorrenteRepository disponibilidadeRecorrenteRepository;
    private final ExcecaoDisponibilidadeService excecaoDisponibilidadeService;
    private final ConsultaRepository consultaRepository;
    private final PacienteRepository pacienteRepository;

    public DisponibilidadeService(DisponibilidadeRecorrenteRepository disponibilidadeRecorrenteRepository, ExcecaoDisponibilidadeRepository excecaoDisponibilidadeRepository, ExcecaoDisponibilidadeService excecaoDisponibilidadeService, ConsultaRepository consultaRepository, PacienteRepository pacienteRepository) {
        this.disponibilidadeRecorrenteRepository = disponibilidadeRecorrenteRepository;
        this.excecaoDisponibilidadeService = excecaoDisponibilidadeService;
        this.consultaRepository = consultaRepository;
        this.pacienteRepository = pacienteRepository;
    }


    public List<HorarioDisponivelDTO> buscarHorariosDisponiveis(Long psicologoId, LocalDate data) {
        DayOfWeek diaSemana = data.getDayOfWeek();

        List<DisponibilidadeRecorrente> recorrentes = disponibilidadeRecorrenteRepository
                .findValidDisponibilidades(psicologoId, diaSemana.getValue() % 7, data, data);

        List<ExcecaoDisponibilidade> excecoes = excecaoDisponibilidadeService.buscarExcecoesDoDia(psicologoId, data);

        List<Consulta> consultas = consultaRepository.findByPsicologoIdAndData(psicologoId, data);

        Set<HorarioDisponivelDTO> horarios = new HashSet<>();

        for (DisponibilidadeRecorrente r : recorrentes) {
            LocalDateTime inicio = data.atTime(r.getHoraInicio()).truncatedTo(ChronoUnit.MINUTES);
            LocalDateTime fim = data.atTime(r.getHoraFim()).truncatedTo(ChronoUnit.MINUTES);

            boolean estaIndisponivelPorExcecao = excecoes.stream()
                    .filter(e -> e.getTipo() == TipoExcecao.INDISPONIVEL)
                    .anyMatch(e -> !e.getDataHoraFim().isBefore(inicio) && !e.getDataHoraInicio().isAfter(fim));

            if (!estaIndisponivelPorExcecao) {
                List<HorarioDisponivelDTO> livres = subtrairConsultas(inicio, fim, consultas);
                livres.forEach(h -> h.setRecorrente(true));
                horarios.addAll(livres);

            }

        }

        excecoes.stream()
                .filter(e -> e.getTipo() == TipoExcecao.DISPONIVEL)
                .map(e -> new HorarioDisponivelDTO(
                        e.getDataHoraInicio().truncatedTo(ChronoUnit.MINUTES),
                        e.getDataHoraFim().truncatedTo(ChronoUnit.MINUTES),
                        false
                ))
                .filter(dto -> consultas.stream().noneMatch(c -> {
                    LocalDateTime iniConsulta = c.getDataHoraInicio().truncatedTo(ChronoUnit.MINUTES);
                    LocalDateTime fimConsulta = c.getDataHoraFim().truncatedTo(ChronoUnit.MINUTES);
                    return !(fimConsulta.isBefore(dto.getInicio()) || iniConsulta.isAfter(dto.getFim()));
                }))
                .forEach(horarios::add);

        List<HorarioDisponivelDTO> listaFinal = new ArrayList<>(horarios);
        listaFinal.sort(Comparator.comparing(HorarioDisponivelDTO::getInicio));

        return unificarHorarios(listaFinal);
    }

    private List<HorarioDisponivelDTO> unificarHorarios(List<HorarioDisponivelDTO> horarios) {
        if (horarios.isEmpty()) return horarios;

        horarios.sort(Comparator.comparing(HorarioDisponivelDTO::getInicio));
        List<HorarioDisponivelDTO> unificados = new ArrayList<>();
        HorarioDisponivelDTO atual = horarios.get(0);

        for (int i = 1; i < horarios.size(); i++) {
            HorarioDisponivelDTO proximo = horarios.get(i);

            if (proximo.isRecorrente() == atual.isRecorrente()
                    && !proximo.getInicio().isAfter(atual.getFim())) {

                atual = new HorarioDisponivelDTO(
                        atual.getInicio(),
                        proximo.getFim().isAfter(atual.getFim()) ? proximo.getFim() : atual.getFim(),
                        atual.isRecorrente()
                );
            } else {
                unificados.add(atual);
                atual = proximo;
            }
        }

        unificados.add(atual);
        return unificados;
    }


    private List<HorarioDisponivelDTO> subtrairConsultas(LocalDateTime inicio, LocalDateTime fim, List<Consulta> consultas) {
        List<HorarioDisponivelDTO> resultado = new ArrayList<>();
        List<LocalDateTime[]> ocupados = new ArrayList<>();

        for (Consulta c : consultas) {
            LocalDateTime ini = c.getDataHoraInicio().truncatedTo(ChronoUnit.MINUTES);
            LocalDateTime f = c.getDataHoraFim().truncatedTo(ChronoUnit.MINUTES);
            if (!(f.isBefore(inicio) || ini.isAfter(fim))) {
                ocupados.add(new LocalDateTime[]{
                        ini.isBefore(inicio) ? inicio : ini,
                        f.isAfter(fim) ? fim : f
                });
            }
        }

        ocupados.sort(Comparator.comparing(a -> a[0]));

        LocalDateTime atual = inicio;
        for (LocalDateTime[] intervalo : ocupados) {
            if (atual.isBefore(intervalo[0])) {
                resultado.add(new HorarioDisponivelDTO(atual, intervalo[0], true));
            }
            atual = intervalo[1].isAfter(atual) ? intervalo[1] : atual;
        }

        if (atual.isBefore(fim)) {
            resultado.add(new HorarioDisponivelDTO(atual, fim, true));
        }

        return resultado;
    }


    public Map<LocalDate, List<HorarioDisponivelDTO>> buscarDisponibilidadeMensal(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Long psicologoId = paciente.getPsicologo().getPsicologoId();
        LocalDate hoje = LocalDate.now();
        LocalDate fimMes = hoje.withDayOfMonth(hoje.lengthOfMonth());

        Map<LocalDate, List<HorarioDisponivelDTO>> mapa = new HashMap<>();

        for (LocalDate dia = hoje; !dia.isAfter(fimMes); dia = dia.plusDays(1)) {
            List<HorarioDisponivelDTO> horarios = buscarHorariosDisponiveis(psicologoId, dia);
            if (!horarios.isEmpty()) {
                mapa.put(dia, horarios);
            }
        }

        return mapa;
    }


}
