from flask import Flask, request, jsonify, send_file
import os
import matplotlib.pyplot as plt
from UI_graph_alg import main2  # Add this import
import time
import uuid

app = Flask(__name__, static_folder='static')  # Add static_folder configuration

UPLOAD_FOLDER = "uploads"
PLOT_FOLDER = "static/plots"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PLOT_FOLDER, exist_ok=True)

# Set a longer timeout for the server
app.config['PERMANENT_SESSION_LIFETIME'] = 180  # 3 minutes
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching

@app.route("/process", methods=["POST"])
def process_data():
    try:
        if "csvFile" not in request.files:
            print("No file in request")  # Debug log
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["csvFile"]
        if not file:
            print("File is empty")  # Debug log
            return jsonify({"error": "Empty file"}), 400

        # Debug logs for form data
        print("Received form data:", {
            "filename": file.filename,
            "poles_cost": request.form.get("polesCost"),
            "mv_cost": request.form.get("mvCablesCost"),
            "lv_cost": request.form.get("lvCablesCost")
        })

        poles_cost = request.form.get("polesCost", "0")
        mv_cost = request.form.get("mvCablesCost", "0")
        lv_cost = request.form.get("lvCablesCost", "0")

        try:
            # Convert costs to float with error handling
            costs = [float(poles_cost), float(mv_cost), float(lv_cost)]
        except ValueError as e:
            print(f"Error converting costs to float: {e}")  # Debug log
            return jsonify({"error": "Invalid cost values"}), 400

        # Save the uploaded file temporarily
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        try:
            # Add a timestamp for debugging
            start_time = time.time()
            print(f"Starting algorithm at {start_time}")

            # Call the algorithm with the file path and costs
            final_poles, G, plot_buffer, total_cost = main2(
                file_path,
                float(poles_cost),
                float(mv_cost),
                float(lv_cost)
            )

            # Log processing time
            end_time = time.time()
            print(f"Algorithm completed in {end_time - start_time} seconds")

            # Generate a unique filename for the plot
            unique_id = str(uuid.uuid4())
            plot_filename = f"output_plot_{unique_id}.png"
            plot_path = os.path.join(PLOT_FOLDER, plot_filename)

            # Save the plot from the buffer
            with open(plot_path, 'wb') as f:
                f.write(plot_buffer.getvalue())

            # Clean up the temporary file
            os.remove(file_path)

            # Clean up old plot files (keep only the 5 most recent)
            plot_files = sorted([f for f in os.listdir(PLOT_FOLDER) if f.startswith('output_plot_')])
            for old_file in plot_files[:-5]:
                try:
                    os.remove(os.path.join(PLOT_FOLDER, old_file))
                except Exception as e:
                    print(f"Error cleaning up old file {old_file}: {e}")

            return jsonify({
                "plot_url": f"/static/plots/{plot_filename}",
                "total_cost": total_cost,
                "processing_time": end_time - start_time
            })

        except Exception as e:
            print(f"Error in algorithm: {str(e)}")
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({"error": f"Algorithm error: {str(e)}"}), 500

    except Exception as e:
        print(f"Error in process_data: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)