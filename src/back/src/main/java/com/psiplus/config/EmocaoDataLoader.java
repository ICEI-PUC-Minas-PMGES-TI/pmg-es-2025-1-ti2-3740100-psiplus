package com.psiplus.config;

import com.psiplus.model.TipoEmocao;
import com.psiplus.repository.TipoEmocaoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmocaoDataLoader implements CommandLineRunner {

    private final TipoEmocaoRepository tipoEmocaoRepository;

    public EmocaoDataLoader(TipoEmocaoRepository tipoEmocaoRepository) {
        this.tipoEmocaoRepository = tipoEmocaoRepository;
    }

    @Override
    public void run(String... args) {
        if (tipoEmocaoRepository.count() == 0) {
            tipoEmocaoRepository.save(new TipoEmocao("Feliz"));
            tipoEmocaoRepository.save(new TipoEmocao("Neutro"));
            tipoEmocaoRepository.save(new TipoEmocao("Triste"));
            tipoEmocaoRepository.save(new TipoEmocao("Raiva"));
        }
    }
}
