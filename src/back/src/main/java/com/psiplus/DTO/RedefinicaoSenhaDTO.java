package com.psiplus.DTO;

public class RedefinicaoSenhaDTO {
    private String email;
    private String senhaAntiga;
    private String novaSenha;
    private String confirmarSenha;

    //Getters e Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenhaAntiga() {
        return senhaAntiga;
    }

    public void setSenhaAntiga(String senhaAntiga) {
        this.senhaAntiga = senhaAntiga;
    }

    public String getNovaSenha() {
        return novaSenha;
    }

    public void setNovaSenha(String novaSenha) {
        this.novaSenha = novaSenha;
    }

    public String getConfirmarSenha() {
        return confirmarSenha;
    }

    public void setConfirmarSenha(String confirmarSenha) {
        this.confirmarSenha = confirmarSenha;
    }
}
