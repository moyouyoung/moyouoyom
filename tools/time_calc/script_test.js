document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const lines = event.target.result.split('\n');
        let resultHtml = '<h2>Search Results:</h2>';
        lines.forEach((line, index) => {
            if (line.includes('dTimeAbsolute') || line.includes('timestamp')) {
                resultHtml += `<p>Line ${index + 1}: ${line}</p>`;
            }
        });
        document.getElementById('result').innerHTML = resultHtml;
    };

    reader.onerror = function(event) {
        alert('Error reading file: ' + event.target.error.name);
    };

    reader.readAsText(file);
});
