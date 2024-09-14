import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('plant_disease_mobilenet_model_finetuned.h5')

# Dictionary to map the class indices to the disease labels
class_indices = {
    'Pepper__bell___Bacterial_spot': 0,
    'Pepper__bell___healthy': 1,
    'Potato___Early_blight': 2,
    'Potato___Late_blight': 3,
    'Potato___healthy': 4,
    'Tomato_Bacterial_spot': 5,
    'Tomato_Septoria_leaf_spot': 6,
    'Tomato__Target_Spot': 7,
    'Tomato__Tomato_mosaic_virus': 8,
    'Tomato_healthy': 9,
    
}

# Reverse the dictionary to get the labels from indices
class_labels = {v: k for k, v in class_indices.items()}

def predict_disease(image_path):
    # Load and preprocess the image
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Rescale the image to [0, 1]

    # Predict the disease
    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    predicted_label = class_labels[predicted_index]
    confidence = predictions[0][predicted_index]

    return predicted_label, confidence

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    image_path = './temp_image.jpg'
    image_file.save(image_path)
    
    predicted_label, confidence = predict_disease(image_path)
    result = {
        'predicted_disease': predicted_label,
        'confidence': float(confidence)
    }
    
    return jsonify(result)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
@app.route('/signup', methods=['GET','Post'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

if __name__ == '__main__':
    app.run(debug=True)
