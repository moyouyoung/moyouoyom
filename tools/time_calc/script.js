function convertJulianToGregorian() {
    const julianDay = document.getElementById('julianDay').value;
    const timezone = document.getElementById('timezone').value;

    if (julianDay) {
        const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
        const gregorianEpochMilliseconds = -210866760000000; // Milliseconds from 0000-01-01 to 1970-01-01
      
        const milliseconds = Math.floor(julianDay * millisecondsPerDay + gregorianEpochMilliseconds);
        const date = new Date(milliseconds);
        const formattedDate = convertToTimeZone(date, timezone);

        document.getElementById('gregorianDate').innerText = `Gregorian Date: ${formattedDate}`;
    } else {
        document.getElementById('gregorianDate').innerText = 'Please enter a valid Julian day.';
    }
}

function convertToTimeZone(date, timeZone) {
    const { DateTime } = luxon;
    const dt = DateTime.fromJSDate(date, { zone: 'UTC' }).setZone(timeZone);
    return dt.toFormat('yyyy-MM-dd HH:mm:ss.SSS');
}

function convertGregorianToJulian() {
    const gregorianDate = document.getElementById('gregorianDateInput').value;
    const timezone = document.getElementById('timezone').value;
    const { DateTime } = luxon;
    const dt = DateTime.fromFormat(gregorianDate, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });

    if (dt) {
        const julianDay = dt.toMillis() / 86400000 + 2440587.5;
        document.getElementById('julianDayOutput').innerText = `Julian Day: ${julianDay}`;
    } else {
        document.getElementById('julianDayOutput').innerText = 'Please enter a valid Gregorian date.';
    }
}

function showCurrentJulian() {
    const now = new Date();
    const JD = (now.getTime() / 86400000) + 2440587.5;
    document.getElementById('currentJulianDay').innerText = `Current Julian Day: ${JD.toFixed(9)}`;
}

function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const timezone = document.getElementById('timezone').value;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const julianDay = parseFloat(content.trim());
            const Z = Math.floor(julianDay + 0.5);
            const F = julianDay + 0.5 - Z;
            let A = Z;
            if (Z >= 2299161) {
                const alpha = Math.floor((Z - 1867216.25) / 36524.25);
                A += 1 + alpha - Math.floor(alpha / 4);
            }
            const B = A + 1524;
            const C = Math.floor((B - 122.1) / 365.25);
            const D = Math.floor(365.25 * C);
            const E = Math.floor((B - D) / 30.6001);
            const day = B - D - Math.floor(30.6001 * E) + F;
            let month = E < 14 ? E - 1 : E - 13;
            const year = month > 2 ? C - 4716 : C - 4715;

            const dayFraction = day % 1;
            const hours = Math.floor(dayFraction * 24);
            const minutes = Math.floor((dayFraction * 24 - hours) * 60);
            const seconds = Math.floor(((dayFraction * 24 - hours) * 60 - minutes) * 60);
            const milliseconds = Math.floor((((dayFraction * 24 - hours) * 60 - minutes) * 60 - seconds) * 1000);
            const microseconds = Math.floor((dayFraction * 86400000 - hours * 3600000 - minutes * 60000 - seconds * 1000 - milliseconds) * 1000);

            const date = new Date(Date.UTC(year, month - 1, Math.floor(day), hours, minutes, seconds, milliseconds));
            const formattedDate = convertToTimeZone(date, timezone);

            document.getElementById('fileOutput').innerText = `Gregorian Date: ${formattedDate}`;
        };
        reader.readAsText(file);
    } else {
        document.getElementById('fileOutput').innerText = 'Please select a file.';
    }
}
