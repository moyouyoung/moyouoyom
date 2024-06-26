function convertJulianToGregorian() {
    const julianDay = document.getElementById('julianDay').value;
    const timezone = document.getElementById('timezone').value;

    if (julianDay) {
        /*const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
        const gregorianEpochMilliseconds = -210866760000000; // Milliseconds from 0000-01-01 to 1970-01-01
      
        const milliseconds = Math.floor(julianDay * millisecondsPerDay + gregorianEpochMilliseconds);
        const date = new Date(milliseconds); */
        const formattedDate = convertToTimeZone(J2Gconversion(julianDay), timezone);

        document.getElementById('gregorianDate').innerText = `Gregorian Date: ${formattedDate}`;
    } else {
        document.getElementById('gregorianDate').innerText = 'Please enter a valid Julian day.';
    }
}

function J2Gconversion(julianDay) {
    const millisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000
    const gregorianEpochMilliseconds = -210866760000000; // Milliseconds from 0000-01-01 to 1970-01-01
    
    const milliseconds = Math.floor(julianDay * millisecondsPerDay + gregorianEpochMilliseconds);
    const date = new Date(milliseconds);
    return date;
}

function convertToTimeZone(date, timeZone) {
    const { DateTime } = luxon;
    const dt = DateTime.fromJSDate(date, { zone: 'UTC' }).setZone(timeZone);
    return dt.toFormat('yyyy-MM-dd HH:mm:ss.SSS');
}

function convertGregorianToJulian() {
    const gregorianDate = document.getElementById('gregorianDateInput').value;
    const timezone = document.getElementById('timezone').value;
    /*const { DateTime } = luxon;
    const dt = DateTime.fromFormat(gregorianDate, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
*/
    if (gregorianDate) {
        //const julianDay = dt.toMillis() / 86400000 + 2440587.5;
        document.getElementById('julianDayOutput').innerText = `Julian Day: ${G2Jconversion(gregorianDate,timezone)}`;
    } else {
        document.getElementById('julianDayOutput').innerText = 'Please enter a valid Gregorian date.';
    }
}

function G2Jconversion(gregorianDate,timezone) {
    const { DateTime } = luxon;
    const dt = DateTime.fromFormat(gregorianDate, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
    const julianDay = dt.toMillis() / 86400000 + 2440587.5;
    return julianDay;
}

function showCurrentJulian() {
    const now = new Date();
    const JD = (now.getTime() / 86400000) + 2440587.5;
    document.getElementById('currentJulianDay').innerText = `Current Julian Day: ${JD.toFixed(9)}`;
}

function convertnd2() {
    const fileInput = document.getElementById('nd2Input');
    const timeOffset = document.getElementById('timeOffset').value;
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
        const regex_timeab = /(dTimeAbsolute)\s*=\s*([\d.]+)/;
        const regex_stamp = /(timestamp)\s*#(\d+)\s*=\s*([\d.]+)/;
        let countframe = 0;
        const framenum = [];
        const frametime = [];
        let abtime = 0;
        lines.forEach((line, index) => {
            const match1 = line.match(regex_timeab);
            if (match1) {
                //resultHtml += `<p>Line ${index + 1}: ${line}</p>`;
                abtime = match1[2];
            }
            const match2 = line.match(regex_stamp);
            if (match2) {
                framenum[countframe] = match2[2];
                frametime[countframe] = match2[3];
                countframe++; 
            }
        });
        
        if (framenum.length) {
            if (timeOffset) {
                let resultcsv = 'Frame,Time\n';
                const fileDate = J2Gconversion(abtime);
                const formattedFileDate = convertToTimeZone(fileDate,timezone);
                const { DateTime } = luxon;
                dtFile = DateTime.fromFormat(formattedFileDate, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
                dtOffset = DateTime.fromFormat(timeOffset, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
                const diff = dtFile.diff(dtOffset).milliseconds;
                for (let i = 0; i < framenum.length; i++) {
                    let difftime = parseFloat(frametime[i]) + diff/1000;
                    resultcsv += `${framenum[i]},${difftime.toString()}\n`;
                }
                const blob = new Blob([resultcsv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const downloadLink = document.getElementById('nd2link');
                downloadLink.href = url;
                downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + '_offset.csv';
                downloadLink.style.display = 'block';
                downloadLink.textContent = 'Download Offset Results';

            } else {
                let resultcsv = 'Frame,Time\n';
                for (let i = 0; i < framenum.length; i++) {
                    resultcsv += `${framenum[i]},${frametime[i]}\n`;
                }
                const blob = new Blob([resultcsv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const downloadLink = document.getElementById('nd2link');
                downloadLink.href = url;
                downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + '_raw.csv';
                downloadLink.style.display = 'block';
                downloadLink.textContent = 'Download Raw Results';
            }
            
        }
    };


    reader.onerror = function(event) {
        alert('Error reading file: ' + event.target.error.name);
    };

    reader.readAsText(file);
    
}

function convertflowez() {
    const fileInput = document.getElementById('flowezInput');
    const timeOffset = document.getElementById('timeOffset').value;
    const timezone = document.getElementById('timezone').value;

    if (!fileInput.files.length) {
        alert('Please select a file first!');
        return;
    }
    
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        const lines = event.target.result.split('\n');
        const regex_flowez = /([^;]+);([-+]?[0-9]*\.?[0-9]+);.*/;
        let counttime = 0;
        const timeinsec = [];
        const pressure = [];
        lines.forEach((line,index) => {
            const match = line.match(regex_flowez);
            if(match) {
                timeinsec[counttime] = match[1];
                pressure[counttime] = match[2];
                counttime++;
            }
        });
        
        if (timeinsec.length) {
            let resultcsv = 'Time,Pressure\n';
            const { DateTime } = luxon;
            if (timeOffset) {
                dtOffset = DateTime.fromFormat(timeOffset, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
            } else {
                dtOffset = DateTime.fromFormat(timeinsec[0], 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
            }

            for (let i = 0; i < timeinsec.length; i++) {
                dtFlowez = DateTime.fromFormat(timeinsec[i], 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
                let diff = dtFlowez.diff(dtOffset).milliseconds;
                diff = diff/1000;
                resultcsv += `${diff.toString()},${pressure[i]}\n`;
            }
            const blob = new Blob([resultcsv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.getElementById('flowezlink');
            downloadLink.href = url;
            downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + '_raw.csv';
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download flowez Results';



        }
    }
    reader.onerror = function(event) {
        alert('Error reading file: ' + event.target.error.name);
    };

    reader.readAsText(file);

}

function convertpatch() {
    const fileInput = document.getElementById('patchPreInput');
    const timeOffset = document.getElementById('timeOffset').value;
    const timezone = document.getElementById('timezone').value;

    if (!fileInput.files.length) {
        alert('Please select a file first!');
        return;
    }
    
    const file = fileInput.files[0];
    
    const { DateTime } = luxon;


    const reader = new FileReader();
    reader.onload = function(event) {
        const lines = event.target.result.split('\n');
        regex_patchP = /(.+?) -> (-?\d+) .*/;
        let counttime = 0; 
        const timeinsec = [];
        const pressure = [];
        lines.forEach((line) => {
            const match = line.match(regex_patchP);
            if (match) {
                timeinsec[counttime] = match[1];
                pressure[counttime] = match[2];
                counttime++;
            }
        });

        if (timeinsec.length) {
            let resultcsv = 'Time,Pressure\n';
            if (timeOffset) {
                dtrawOffset = DateTime.fromFormat(timeOffset, 'yyyy-MM-dd HH:mm:ss.SSS', { zone: timezone });
                offstring = dtrawOffset.toFormat('HH:mm:ss.SSS').toString();
                dtOffset = DateTime.fromFormat(offstring, 'HH:mm:ss.SSS');
            } else {
                dtOffset = DateTime.fromFormat(timeinsec[0], 'HH:mm:ss.SSS');
            }

            for (let i=0; i<timeinsec.length; i++) {
                dtpatchP = DateTime.fromFormat(timeinsec[i], 'HH:mm:ss.SSS');
                let diff = dtpatchP.diff(dtOffset).milliseconds;
                diff = diff/1000;
                resultcsv += `${diff.toString()},${pressure[i]}\n`;
            }
            const blob = new Blob([resultcsv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.getElementById('patchPreLink');
            downloadLink.href = url;
            downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + '_raw.csv';
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download patch pressure Results';
        }

    }

    reader.onerror = function(event) {
        alert('Error reading file: ' + event.target.error.name);
    };

    reader.readAsText(file);

}