from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route("/run-script", methods=["POST"])
def run_script():
    data = request.json  # Get user inputs from Vercel frontend
    poles_cost = data.get("polesCost")
    mv_cables_cost = data.get("mvCablesCost")
    lv_cables_cost = data.get("lvCablesCost")

    script_path = os.path.join(os.getcwd(), "UI_graph_alg.py")

    # Run the script and capture output
    result = subprocess.run(
        ["python3", script_path, str(poles_cost), str(mv_cables_cost), str(lv_cables_cost)],
        capture_output=True, text=True
    )

    if result.returncode == 0:
        return jsonify({"message": "Success", "output": result.stdout})
    else:
        return jsonify({"error": result.stderr}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
