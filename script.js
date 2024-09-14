document.getElementById('uploadForm').onsubmit = async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const imageFile = document.getElementById('image').files[0];
    formData.append('image', imageFile);

    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadedImage = document.getElementById('uploadedImage');
        uploadedImage.src = e.target.result;
        uploadedImage.style.display = 'block';
    };
    reader.readAsDataURL(imageFile);

    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    const resultText = document.getElementById('resultText');
    const solutionText = document.getElementById('solutionText');

    if (response.ok) {
        let predictedDiseaseLabel = result.predicted_disease;
        let predictedDiseaseName;
        let solution;

        switch (predictedDiseaseLabel) {
            case 'Pepper__bell___Bacterial_spot':
                predictedDiseaseName = 'Pepper Bell Bacterial Spot';
                solution = 'Apply copper-based fungicides and practice crop rotation.';
                break;
            case 'Pepper__bell___healthy':
                predictedDiseaseName = 'Pepper Bell (Healthy)';
                solution = 'The plant is healthy, no action is required.';
                break;
            case 'Potato___Early_blight':
                predictedDiseaseName = 'Potato Early Blight';
                solution = 'Use certified disease-free seeds and apply fungicides regularly.';
                break;
            case 'Potato___healthy':
                predictedDiseaseName = 'Potato (Healthy)';
                solution = 'The plant is healthy, no action is required.';
                break;
            case 'Potato___Late_blight':
                predictedDiseaseName = 'Potato Late Blight';
                solution = 'Ensure proper drainage and use fungicides to control the spread.';
                break;
            case 'Tomato__Target_Spot':
                predictedDiseaseName = 'Tomato Target Spot';
                solution = 'Remove infected leaves and apply fungicides to prevent spread.';
                break;
            case 'Tomato__Tomato_mosaic_virus':
                predictedDiseaseName = 'Tomato Mosaic Virus';
                solution = 'Destroy infected plants and avoid tobacco use around plants.';
                break;
            case 'Tomato_Bacterial_spot':
                predictedDiseaseName = 'Tomato Bacterial Spot';
                solution = 'Use disease-free seeds and apply copper-based bactericides.';
                break;
            case 'Tomato_healthy':
                predictedDiseaseName = 'Tomato (Healthy)';
                solution = 'The plant is healthy, no action is required.';
                break;
            case 'Tomato_Septoria_leaf_spot':
                predictedDiseaseName = 'Tomato Septoria Leaf Spot';
                solution = 'Prune infected leaves and apply fungicides as needed.';
                break;
            default:
                predictedDiseaseName = 'Unknown Disease';
                solution = 'No specific solution available.';
        }

        resultText.innerHTML = `
            <p><strong>Predicted Disease:</strong> ${predictedDiseaseName}</p>
            <p><strong>Confidence:</strong> ${(result.confidence * 100).toFixed(2)}%</p>
        `;
        solutionText.innerHTML = `<p><strong>Solution:</strong> ${solution}</p>`;
    } else {
        resultText.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
    }
};
