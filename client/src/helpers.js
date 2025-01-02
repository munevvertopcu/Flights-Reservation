export const hoursDifference = (start, end) => {
    // Saat ve dakikaları ayır
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);

    // Toplam dakikaya çevir
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    // Dakika farkını hesapla
    let diffMinutes = endTotalMinutes - startTotalMinutes;

    // Eğer fark negatifse, bir gün ekle (24 saat)
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }

    // Farkı saat ve dakikaya dönüştür
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    // Sonucu "xh ym" formatında döndür
    return `${diffHours}h ${remainingMinutes}m`;
}

export const getTime = (timeString, hoursToAdd, minutesToAdd) => {
    // "hh:mm" formatındaki stringi parçala
    const [hours, minutes] = timeString.split(':').map(Number);

    // Toplam dakikayı hesapla
    const totalMinutes = (hours * 60 + minutes) + (hoursToAdd * 60 + minutesToAdd);

    // Yeni saat ve dakikayı hesapla
    const newHours = Math.floor(totalMinutes / 60) % 24; // 24 saat formatında döngü
    const newMinutes = totalMinutes % 60;

    // Sonucu "hh:mm" formatında döndür
    const formattedHours = newHours.toString().padStart(2, '0');
    const formattedMinutes = newMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

export const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export const addTimeAndFormat = (dateString, hoursToAdd, minutesToAdd) => {
    const date = new Date(dateString); // String'i Date nesnesine çevir (format : 2024-12-29T19:40:00.000+01:00)

    // Saat ve dakika ekle
    date.setHours(date.getHours() + hoursToAdd);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    // Saat ve dakika değerlerini al ve iki basamaklı hale getir
    const options = {
        timeZone: 'Europe/Amsterdam',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24 saat formatı için
    };
    const amsterdamTime = new Intl.DateTimeFormat('en-US', options).format(date);

    return { amsterdamTime: amsterdamTime, date: date }; // hh:mm formatında döndür
}

export const getRandomPrice = () => {
    const prices = [235, 304, 378, 258, 342, 430]
    const randomIndex = Math.floor(Math.random() * prices.length);
    return prices[randomIndex];
}