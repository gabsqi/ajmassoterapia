// Funcionalidade do Calendário
let currentDate = new Date();
let dataSelecionada = null;

const calendarGrid = document.getElementById('calendar-grid');
const calendarMonthYear = document.getElementById('calendar-month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const inputDataSelecionada = document.getElementById('data-selecionada');
const selectHorario = document.getElementById('horario');
const form = document.getElementById('agendamento-form');

// Nomes dos meses em português
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Horários disponíveis por dia da semana
// 0 = Domingo (fechado), 1-5 = Segunda a Sexta, 6 = Sábado
const horariosDisponivels = {
    'weekday': ['19:00', '20:00', '21:00'], // Segunda a Sexta (19h a 21h, intervalo de 1h)
    'saturday': ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'] // Sábado (8h a 21h, intervalo de 1h)
};

// Renderizar o calendário
function renderCalendar() {
    // Limpar grid anterior
    calendarGrid.innerHTML = '';

    // Atualizar header com mês e ano
    calendarMonthYear.textContent = `${meses[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Criar headers dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    diasSemana.forEach(dia => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = dia;
        calendarGrid.appendChild(dayHeader);
    });

    // Obter primeiro dia do mês e quantidade de dias
    const primeirodia = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const diasNoMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const hoje = new Date();

    // Adicionar dias vazios antes do primeiro dia
    for (let i = 0; i < primeirodia; i++) {
        const dayEmpty = document.createElement('div');
        dayEmpty.className = 'calendar-day empty';
        calendarGrid.appendChild(dayEmpty);
    }

    // Adicionar dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.className = 'calendar-day';
        dayBtn.textContent = dia;

        const dataAtual = new Date(currentDate.getFullYear(), currentDate.getMonth(), dia);
        const diaSemana = dataAtual.getDay();

        // Desabilitar datas passadas e domingos
        if (dataAtual < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) || diaSemana === 0) {
            dayBtn.disabled = true;
            dayBtn.className += ' disabled';
        } else {
            dayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                selecionarData(dia);
            });
        }

        // Destacar data selecionada
        if (dataSelecionada && 
            dataSelecionada.getDate() === dia &&
            dataSelecionada.getMonth() === currentDate.getMonth() &&
            dataSelecionada.getFullYear() === currentDate.getFullYear()) {
            dayBtn.className += ' selected';
        }

        calendarGrid.appendChild(dayBtn);
    }
}

// Selecionar data
function selecionarData(dia) {
    dataSelecionada = new Date(currentDate.getFullYear(), currentDate.getMonth(), dia);
    inputDataSelecionada.value = dataSelecionada.toISOString().split('T')[0];
    renderCalendar();
    atualizarHorarios();
}

// Atualizar horários disponíveis baseado no dia da semana
function atualizarHorarios() {
    selectHorario.innerHTML = '<option value="">Escolha um horário</option>';
    
    if (!dataSelecionada) {
        return;
    }

    // Verificar qual dia da semana foi selecionado
    const diaSemana = dataSelecionada.getDay();
    const horarios = diaSemana === 6 ? horariosDisponivels.saturday : horariosDisponivels.weekday;

    // Adicionar horários disponíveis ao select
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        selectHorario.appendChild(option);
    });
}

// Navegação entre meses
prevMonthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Enviar para WhatsApp
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data-selecionada').value;
    const horario = document.getElementById('horario').value;

    if (!nome || !data || !horario) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Formatar data para formato brasileiro
    const dataParts = data.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

    // Criar mensagem para WhatsApp
    const mensagem = `Olá Ana Júlia! Meu nome é ${nome} e gostaria de agendar um atendimento de massoterapia para ${dataFormatada} às ${horario}. A data está disponível?`;

    // Encodar mensagem para URL
    const mensagemEncodada = encodeURIComponent(mensagem);

    // Número do WhatsApp da Ana Júlia (com código do país e DDD)
    const numeroWhatsApp = '5551992977979';

    // Redirecionar para WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemEncodada}`, '_blank');
});

// Renderizar calendário ao carregar a página
renderCalendar();

