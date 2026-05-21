/* =====================================================
   1️⃣ VARIÁVEIS GLOBAIS
   Controlam estado do calendário e elementos do DOM
===================================================== */

let currentDate = new Date();
let dataSelecionada = null;

const calendarGrid = document.getElementById('calendar-grid');
const calendarMonthYear = document.getElementById('calendar-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const inputDataSelecionada = document.getElementById('data-selecionada');
const selectHorario = document.getElementById('horario');
const form = document.getElementById('agendamento-form');
const backToTopButton = document.getElementById("backToTop");


/* =====================================================
   2️⃣ CONFIGURAÇÕES FIXAS
===================================================== */

// Meses do ano
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Horários disponíveis
const horariosDisponiveis = {
  weekday: ['19:00', '20:00', '21:00'],
  saturday: [
    '08:00', '09:00', '10:00', '11:00', '12:00'
  ]
};


/* =====================================================
   3️⃣ FUNÇÃO: renderCalendar()
   - Desenha o calendário na tela
   - Desabilita datas passadas e domingos
===================================================== */

function renderCalendar() {

  calendarGrid.innerHTML = '';

  calendarMonthYear.textContent =
    `${meses[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  diasSemana.forEach(dia => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = dia;
    calendarGrid.appendChild(header);
  });

  const primeiroDia = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const diasNoMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (let i = 0; i < primeiroDia; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    calendarGrid.appendChild(empty);
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {

    const botaoDia = document.createElement('button');
    botaoDia.type = 'button';
    botaoDia.className = 'calendar-day';
    botaoDia.textContent = dia;

    const dataAtual = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dia
    );

    const diaSemana = dataAtual.getDay();

    if (dataAtual < hoje || diaSemana === 0) {
      botaoDia.disabled = true;
      botaoDia.classList.add('disabled');
    } else {
      botaoDia.addEventListener('click', () => {
        selecionarData(dia);
      });
    }

    if (
      dataSelecionada &&
      dataSelecionada.getDate() === dia &&
      dataSelecionada.getMonth() === currentDate.getMonth() &&
      dataSelecionada.getFullYear() === currentDate.getFullYear()
    ) {
      botaoDia.classList.add('selected');
    }

    calendarGrid.appendChild(botaoDia);
  }
}


/* =====================================================
   4️⃣ FUNÇÃO: selecionarData()
   - Salva a data escolhida
   - Atualiza campo hidden
   - Atualiza horários
===================================================== */

function selecionarData(dia) {

  dataSelecionada = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    dia
  );

  inputDataSelecionada.value =
    dataSelecionada.toISOString().split('T')[0];

  renderCalendar();
  atualizarHorarios();
}


/* =====================================================
   5️⃣ FUNÇÃO: atualizarHorarios()
   - Mostra horários conforme dia escolhido
===================================================== */

function atualizarHorarios() {

  selectHorario.innerHTML =
    '<option value="">Escolha um horário</option>';

  if (!dataSelecionada) return;

  const diaSemana = dataSelecionada.getDay();

  const horarios =
    diaSemana === 6
      ? horariosDisponiveis.saturday
      : horariosDisponiveis.weekday;

  horarios.forEach(horario => {
    const option = document.createElement('option');
    option.value = horario;
    option.textContent = horario;
    selectHorario.appendChild(option);
  });
}


/* =====================================================
   6️⃣ NAVEGAÇÃO ENTRE MESES
===================================================== */

prevMonthBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const hoje = new Date();

  if (
    currentDate.getFullYear() > hoje.getFullYear() ||
    currentDate.getMonth() > hoje.getMonth()
  ) {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  }
});

nextMonthBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});


/* =====================================================
   7️⃣ ENVIO PARA WHATSAPP
   - Valida campos
   - Formata data
   - Abre WhatsApp
===================================================== */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const data = inputDataSelecionada.value;
  const horario = selectHorario.value;

  if (!nome || !data || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const [ano, mes, dia] = data.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  const mensagem =
    `Olá Ana Júlia! Meu nome é ${nome} e gostaria de agendar um atendimento de massagem para ${dataFormatada} às ${horario}. A data está disponível?`;

  const mensagemEncodada = encodeURIComponent(mensagem);

  const numeroWhatsApp = '5551992977979';

  window.open(
    `https://wa.me/${numeroWhatsApp}?text=${mensagemEncodada}`,
    '_blank'
  );
});


/* =====================================================
   8️⃣ BOTÃO VOLTAR AO TOPO (SOMENTE MOBILE)
===================================================== */

function isMobile() {
  return window.innerWidth <= 768;
}

window.addEventListener("scroll", () => {

  if (!isMobile()) return;

  if (window.scrollY > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }

});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


/* =====================================================
   9️⃣ INICIALIZAÇÃO
===================================================== */

renderCalendar();
