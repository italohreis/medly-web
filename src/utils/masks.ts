export const maskCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const unmaskCPF = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const maskPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
};

export const unmaskPhone = (value: string): string => {
    return value.replace(/\D/g, '');
};

export const maskCRM = (value: string): string => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const numbers = cleaned.replace(/[^0-9]/g, '').slice(0, 6);
    const state = cleaned.replace(/[^A-Z]/g, '').slice(0, 2);
    if (state) {
        return `${numbers}-${state}`;
    }
    return numbers;
};

export const maskDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
};
