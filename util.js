function normalizarTelefono(input) {
    // Primero detectamos si ya está en el formato deseado: +595 seguido de dígitos
    const formatoParaguay = /^\+595\d+$/;
    if (formatoParaguay.test(input)) {
        // Si ya cumple el formato, lo retornamos tal cual.
        return input;
    }

    // Si no está en el formato, procedemos con la normalización.
    // 1. Remover todos los caracteres no numéricos
    let soloDigitos = input.replace(/\D/g, '');

    // 2. Si el número comienza con '0', lo removemos
    if (soloDigitos.startsWith('0')) {
        soloDigitos = soloDigitos.slice(1);
    }

    // 3. Agregar el prefijo 595
    const numeroNormalizado = '595' + soloDigitos;

    return numeroNormalizado;
}

module.exports = normalizarTelefono