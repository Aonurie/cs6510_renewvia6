from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/run-script', methods=['POST'])
def run_script():
    data = request.json
    poles_cost = data.get("polesCost", "")
    mv_cables_cost = data.get("mvCablesCost", "")
    lv_cables_cost = data.get("lvCablesCost", "")

    # Simulate processing (replace with actual script logic)
    result = {
        "message": "Script executed successfully",
        "input": {
            "polesCost": poles_cost,
            "mvCablesCost": mv_cables_cost,
            "lvCablesCost": lv_cables_cost,
        }
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)