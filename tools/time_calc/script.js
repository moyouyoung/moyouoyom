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

function convertnd2() {
    const fileInput = document.getElementById('fileInput');
    const timezone = document.getElementById('timezone').value;
    

    if (!fileInput.files.length) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        const lines = event.target.result.split('\n');
        //let resultHtml = '<h2>Search Results:</h2>';
        let searchResult = '';
        const regex_timeab = /(dTimeAbsolute)\s*=\s*(\d+)/;
        const regex_stamp = /(timestamp)\s*#(\d+)\s*=\s*([\d.]+)/;
        let countframe = 0;
        const framenum = [];
        const frametime = [];
        lines.forEach((line, index) => {
            const match1 = line.match(regex_timeab);
            if (match1) {
                //resultHtml += `<p>Line ${index + 1}: ${line}</p>`;
                const abtime = match1[2];
            }
            const match2 = line.match(regex_stamp);
            if (match2) {
                framenum[countframe] = match2[2];
                frametime[countframe] = match2[3];
                countframe++; 
            }
        });

        
        if (framenum.length) {
            let resultcsv = 'Frame,Time\n';
            for (let i = 0; i < framenum.length; i++) {
                resultcsv += `${framenum[i]},${frametime[i]}\n`;
            }
            const blob = new Blob([resultcsv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.getElementById('nd2link');
            downloadLink.href = url;
            downloadLink.download = 'search_result.txt';
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download Results';
        }
    };


    reader.onerror = function(event) {
        alert('Error reading file: ' + event.target.error.name);
    };

    reader.readAsText(file);
    
}
