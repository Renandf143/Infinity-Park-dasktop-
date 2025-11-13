export interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidade?: string;
}

export interface EstadoProfissionais {
  uf: string;
  nome: string;
  profissionais: Profissional[];
}

export const profissionaisPorEstado: EstadoProfissionais[] = [
  {
    uf: "SP",
    nome: "São Paulo",
    profissionais: [
      {
        id: "1",
        nome: "Pedro Santos",
        email: "pedro.santos@yahoo.com.br",
        telefone: "+55 11 3678-9012",
        especialidade: "Engenharia de Software"
      },
      {
        id: "2",
        nome: "Maria Silva",
        email: "maria.silva@gmail.com",
        telefone: "+55 11 98765-4321",
        especialidade: "Design UX/UI"
      },
      {
        id: "3",
        nome: "João Oliveira",
        email: "joao.oliveira@hotmail.com",
        telefone: "+55 11 99876-5432",
        especialidade: "Consultoria Empresarial"
      }
    ]
  },
  {
    uf: "RJ",
    nome: "Rio de Janeiro",
    profissionais: [
      {
        id: "4",
        nome: "Ana Costa",
        email: "ana.costa@email.com",
        telefone: "+55 21 2567-8901",
        especialidade: "Marketing Digital"
      },
      {
        id: "5",
        nome: "Carlos Mendes",
        email: "carlos.mendes@outlook.com",
        telefone: "+55 21 99876-5432",
        especialidade: "Desenvolvimento Web"
      }
    ]
  },
  {
    uf: "MG",
    nome: "Minas Gerais",
    profissionais: [
      {
        id: "6",
        nome: "Lucas Ferreira",
        email: "lucas.ferreira@gmail.com",
        telefone: "+55 31 3456-7890",
        especialidade: "Análise de Dados"
      },
      {
        id: "7",
        nome: "Fernanda Rocha",
        email: "fernanda.rocha@email.com",
        telefone: "+55 31 98765-4321",
        especialidade: "Recursos Humanos"
      }
    ]
  },
  {
    uf: "BA",
    nome: "Bahia",
    profissionais: [
      {
        id: "8",
        nome: "Roberto Alves",
        email: "roberto.alves@hotmail.com",
        telefone: "+55 71 3234-5678",
        especialidade: "Administração"
      }
    ]
  },
  {
    uf: "RS",
    nome: "Rio Grande do Sul",
    profissionais: [
      {
        id: "9",
        nome: "Juliana Gomes",
        email: "juliana.gomes@gmail.com",
        telefone: "+55 51 3456-7890",
        especialidade: "Contabilidade"
      },
      {
        id: "10",
        nome: "Ricardo Souza",
        email: "ricardo.souza@email.com",
        telefone: "+55 51 99876-5432",
        especialidade: "Logística"
      }
    ]
  },
  {
    uf: "PR",
    nome: "Paraná",
    profissionais: [
      {
        id: "11",
        nome: "Beatriz Lima",
        email: "beatriz.lima@hotmail.com",
        telefone: "+55 41 3234-5678",
        especialidade: "Educação"
      }
    ]
  },
  {
    uf: "PE",
    nome: "Pernambuco",
    profissionais: [
      {
        id: "12",
        nome: "Gustavo Pereira",
        email: "gustavo.pereira@gmail.com",
        telefone: "+55 81 3456-7890",
        especialidade: "Saúde"
      }
    ]
  },
  {
    uf: "CE",
    nome: "Ceará",
    profissionais: [
      {
        id: "13",
        nome: "Camila Barbosa",
        email: "camila.barbosa@email.com",
        telefone: "+55 85 3234-5678",
        especialidade: "Turismo"
      }
    ]
  },
  {
    uf: "PA",
    nome: "Pará",
    profissionais: [
      {
        id: "14",
        nome: "Diego Santos",
        email: "diego.santos@hotmail.com",
        telefone: "+55 91 3456-7890",
        especialidade: "Meio Ambiente"
      }
    ]
  },
  {
    uf: "SC",
    nome: "Santa Catarina",
    profissionais: [
      {
        id: "15",
        nome: "Isabela Martins",
        email: "isabela.martins@gmail.com",
        telefone: "+55 47 3234-5678",
        especialidade: "Tecnologia"
      }
    ]
  }
];

export const getProfissionaisPorEstado = (uf: string): EstadoProfissionais | undefined => {
  return profissionaisPorEstado.find(estado => estado.uf === uf);
};
