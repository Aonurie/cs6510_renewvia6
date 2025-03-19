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
    if "csvFile" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["csvFile"]
    poles_cost = request.form.get("polesCost")
    mv_cost = request.form.get("mvCablesCost")
    lv_cost = request.form.get("lvCablesCost")

    try:
        # Generate a sample plot - make it smaller and faster
        plt.figure(figsize=(6, 4), dpi=80)  # Reduced DPI
        plt.bar(["Poles", "MV Cables", "LV Cables"], 
                [float(poles_cost), float(mv_cost), float(lv_cost)],
                color=['blue', 'green', 'red'])
        plt.xlabel("Cost Types")
        plt.ylabel("Cost ($)")
        plt.title("Cost Breakdown")
        
        # Save with lower quality for faster processing
        plot_path = os.path.join(PLOT_FOLDER, "output_plot.png")
        plt.savefig(plot_path, bbox_inches='tight', pad_inches=0.1, optimize=True)
        plt.close()  # Explicitly close the figure

        return jsonify({
            "plot_url": "/static/plots/output_plot.png"  # Use relative URL
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)