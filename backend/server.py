from flask import Flask, request, jsonify
import os
import matplotlib.pyplot as plt

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

        # Generate a sample plot
        plt.figure(figsize=(6, 4), dpi=80)
        plt.bar(["Poles", "MV Cables", "LV Cables"], costs,
                color=['blue', 'green', 'red'])
        plt.xlabel("Cost Types")
        plt.ylabel("Cost ($)")
        plt.title("Cost Breakdown")
        
        plot_path = os.path.join(PLOT_FOLDER, "output_plot.png")
        plt.savefig(plot_path, bbox_inches='tight', pad_inches=0.1)
        plt.close()

        return jsonify({
            "plot_url": "/static/plots/output_plot.png"
        })

    except Exception as e:
        print(f"Error in process_data: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)