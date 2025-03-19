from flask import Flask, request, jsonify
import os
import matplotlib.pyplot as plt

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
PLOT_FOLDER = "static/plots"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PLOT_FOLDER, exist_ok=True)

@app.route("/process", methods=["POST"])
def process_data():
    if "excelFile" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["excelFile"]
    poles_cost = request.form.get("polesCost")
    mv_cost = request.form.get("mvCablesCost")
    lv_cost = request.form.get("lvCablesCost")

    # Save the file temporarily
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Generate a sample plot
    plot_path = os.path.join(PLOT_FOLDER, "output_plot.png")
    plt.figure(figsize=(6, 4))
    plt.bar(["Poles", "MV Cables", "LV Cables"], [float(poles_cost), float(mv_cost), float(lv_cost)])
    plt.xlabel("Cost Types")
    plt.ylabel("Cost ($)")
    plt.title("Cost Breakdown")
    plt.savefig(plot_path)
    plt.close()

    # Return the plot URL
    return jsonify({"plot_url": f"/static/plots/output_plot.png"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

