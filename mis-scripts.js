// mis-scripts.js

// Función para desplegar la imagen subida por el usuario
function display(event) {
    let input_image = document.getElementById("input_image")
    input_image.src = URL.createObjectURL(event.target.files[0]);
    console.log(input_image.src)
    let d = document.querySelector(".path");
    d.textContent += input_image.src;        
}

// Función para calcular el tiempo transcurrido desde startTime hasta ahora
function calcularTiempoTranscurrido(startTime) {
    var currentTime = new Date().getTime();
    var elapsedTime = (currentTime - startTime) / 1000; // Tiempo en segundos

    // Muestra el tiempo transcurrido en el elemento HTML
    document.getElementById("tiempoTranscurrido").innerText = elapsedTime.toFixed(2);
}

// Función asincrónica para predecir el animal
async function predict_animal() {
    var startTime = new Date().getTime();

    let input = document.getElementById("input_image");
    let imageproc = tf.browser.fromPixels(input).resizeNearestNeighbor([224,224]).expandDims(0).div(255.0);
    console.log("Finalización del preprocesamiento de la imagen");

    const model = await tf.loadLayersModel('https://storage.googleapis.com/humanvsiamodel/tensorflowjs-model/model.json'); // Carga del modelo desde GCS
    const pred = model.predict(imageproc);
    console.log("Finalización de predicción");

    const animals = ["Ajolote", "Ardilla", "Cubrebocas", "Oruga", "Taco"];
    pred.data().then((data) => {
        console.log(data);
        let output = document.getElementById("output_text");
        output.innerHTML = "";
        let max_val = -1;
        let max_val_index = -1;
        for(let i = 0; i < data.length; i++) {
            if(data[i] > max_val) {
                max_val = data[i];
                max_val_index = i;
            }
        }
        let ANIMAL_DETECTADO = animals[max_val_index];
        output.innerHTML = "<p>El Objeto detectado y su probabilidad corresponden a</p><p>Animal detectado: " + ANIMAL_DETECTADO + " ( " + (max_val * 100).toFixed(2) + "% probabilidad )</p>";
        calcularTiempoTranscurrido(startTime); // Llamada a la función para calcular el tiempo transcurrido
    });    
}
