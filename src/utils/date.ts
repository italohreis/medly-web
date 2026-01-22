export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTimeShort = (dateString: string): string => {
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateFull = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export const calculateDurationInMinutes = (startTime: string | null | undefined, endTime: string | null | undefined): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

export const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const isWithinDays = (dateString: string, days: number): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return date >= today && date <= futureDate;
};

export const formatLocalDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const cleanDateString = dateString.replace('Z', '');
    const [datePart, timePart] = cleanDateString.split('T');
    if (!datePart || !timePart) return '-';
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    return `${day}/${month}/${year} ${hour}:${minute}`;
};

export const formatLocalTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const cleanDateString = dateString.replace('Z', '');
    const timePart = cleanDateString.split('T')[1];
    if (!timePart) return '-';
    const [hour, minute] = timePart.split(':');
    
    return `${hour}:${minute}`;
};

export const formatLocalDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const cleanDateString = dateString.replace('Z', '');
    const datePart = cleanDateString.split('T')[0];
    if (!datePart) return '-';
    const [year, month, day] = datePart.split('-');
    
    return `${day}/${month}/${year}`;
};

export const formatLocalDateFull = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const cleanDateString = dateString.replace('Z', '');
    const datePart = cleanDateString.split('T')[0];
    if (!datePart) return '-';
    const [year, month, day] = datePart.split('-');
    
    const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const date = new Date(`${datePart}T12:00:00`);
    const weekday = weekdays[date.getDay()];
    const monthName = months[parseInt(month, 10) - 1];
    
    return `${weekday}, ${day} de ${monthName} de ${year}`;
};

export const parseLocalDateTime = (dateString: string): Date => {
    const cleanDateString = dateString.replace('Z', '');
    const [datePart, timePart] = cleanDateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = (timePart || '00:00:00').split(':').map(s => parseInt(s, 10));
    
    return new Date(year, month - 1, day, hour, minute, second || 0);
};
