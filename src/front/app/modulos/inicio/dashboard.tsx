import Main from "~/componentes/Main";
import MenuLateralPsicólogo from "~/componentes/MenuLateralPsicólogo";
import InputPadrao from "~/componentes/InputPadrao";
import IconPesquisar from "../../../public/assets/IconPesquisar.png"
import ExitIcon from "../../../public/assets/ExitIcon.png"
import IconArquivado from "../../../public/assets/IconArquivado.png"
import Filtro from "../../../public/assets/Filtro.png"
import BotaoPadrao from "~/componentes/BotaoPadrao";
import TabelaPadrao from "~/componentes/TabelaPadrao";
export function Dashboard(){
    const pacientesMock = [
        {
            nome: "Larissa Oliveira",
            CPF: "321.987.654-00",
            "e-mail": "larissa.oli@email.com",
            telefone: "(11) 98765-4321",
            nascimento: "15/07/1998",
        },
        {
            nome: "Matheus Fernandes",
            CPF: "654.321.987-22",
            "e-mail": "matheusf@email.com",
            telefone: "(21) 91234-5678",
            nascimento: "02/02/1997",
        },
        {
            nome: "Juliana Rocha",
            CPF: "789.123.456-33",
            "e-mail": "juliana.rocha@email.com",
            telefone: "(31) 99999-0000",
            nascimento: "30/09/2002",
        },
        {
            nome: "Renan Costa",
            CPF: "111.222.333-44",
            "e-mail": "renan.costa@email.com",
            telefone: "(19) 98888-7766",
            nascimento: "05/05/1995",
        },
        {
            nome: "Camila Martins",
            CPF: "555.666.777-88",
            "e-mail": "camila.m@email.com",
            telefone: "(85) 98456-1234",
            nascimento: "12/03/2000",
        },
        {
            nome: "Bruno Almeida",
            CPF: "999.000.111-22",
            "e-mail": "bruno.almeida@email.com",
            telefone: "(62) 98123-4567",
            nascimento: "20/11/1994",
        },
        {
            nome: "Tatiane Ribeiro",
            CPF: "333.444.555-66",
            "e-mail": "tatiribeiro@email.com",
            telefone: "(71) 98700-3210",
            nascimento: "08/06/1996",
        },
        {
            nome: "Gabriel Antunes",
            CPF: "777.888.999-00",
            "e-mail": "g.antunes@email.com",
            telefone: "(43) 99123-9988",
            nascimento: "17/01/1993",
        },
        {
            nome: "Isabela Moreira",
            CPF: "222.333.444-55",
            "e-mail": "isamoreira@email.com",
            telefone: "(51) 98444-1122",
            nascimento: "26/12/1999",
        },
        {
            nome: "Felipe Souza",
            CPF: "888.999.000-11",
            "e-mail": "felipesouza@email.com",
            telefone: "(13) 99666-7788",
            nascimento: "09/09/1992",
        },
    ];
    return (
        <Main>
            <div className="flex h-screen bg-white ">
                {/* Lado esquerdo com menu do psicólogo*/}
               <MenuLateralPsicólogo telaAtiva={"pacientes"}/>
                <div className="w-px bg-gray-300"></div>
                <div className="m-5 w-4/5">
                    <div className="flex">
                        <InputPadrao
                            placeholder="Pesquisar"
                            classNameInput="border-0 font-semibold text-[14px]"
                            icon={<img className="w-[25px]" src={IconPesquisar} alt="pesquisar" />}
                        />
                        <BotaoPadrao
                            color="bg-white"
                            className="text-[16px] !font-medium  ml-auto !text-black "
                            texto="Sair"
                            icone={<img className=" w-[26px] " src={ExitIcon} alt="Sair" />}
                        />
                    </div>
                    <hr className="border-t-2 border-[#DFE5F1] my-5"/>
                    <h1 className="font-semibold text-black mx-4 text-[20px]">Pacientes</h1>
                    <TabelaPadrao data={pacientesMock}/>
                </div>
            </div>
        </Main>
    )
}
