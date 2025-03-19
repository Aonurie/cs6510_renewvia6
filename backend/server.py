from flask import Flask, request, jsonify
import os
import matplotlib.pyplot as plt
from UI_graph_alg import main  # Add this import

app = Flask(__name__, static_folder='static')  # Add static_folder configuration

UPLOAD_FOLDER = "uploads"
PLOT_FOLDER = "static/plots"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PLOT_FOLDER, exist_ok=True)

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
            # Call the algorithm with the file path and costs
            final_poles, G, plot_buffer, total_cost = main(
                file_path,
                float(poles_cost),
                float(mv_cost),
                float(lv_cost)
            )

            # Save the plot from the buffer
            plot_path = os.path.join(PLOT_FOLDER, "output_plot.png")
            with open(plot_path, 'wb') as f:
                f.write(plot_buffer.getvalue())

            # Clean up the temporary file
            os.remove(file_path)

            return jsonify({
                "plot_url": "/static/plots/output_plot.png",
                "total_cost": total_cost
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