from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# 开启 CORS 跨域，允许你的前端网页直接调用这个接口
CORS(app)

# 这里填入你申请的 API Key
# 如果暂时没有，留空也能跑（匿名限每小时30次）
MY_API_KEY = ""

@app.route('/api/parse', methods=['POST', 'GET'])
def parse_video():
    # 兼容 POST (JSON) 和 GET (URL参数) 请求
    if request.method == 'POST':
        data = request.get_json()
        share_text = data.get('url', '') if data else ''
    else:
        share_text = request.args.get('url', '')

    if not share_text:
        return jsonify({"success": False, "msg": "请提供视频链接或分享口令"}), 400

    API_URL = "https://video.zacao.top/api/parse"
    headers = {"Content-Type": "application/json"}
    if MY_API_KEY:
        headers["X-API-Key"] = MY_API_KEY

    payload = {"text": share_text}

    try:
        # 请求第三方接口
        resp = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        res_data = resp.json()

        # 判断第三方接口是否返回成功
        if res_data.get("succ") and res_data.get("code") == 200:
            result = res_data.get("data", {})
            # 把前端需要的数据重新打包返回
            return jsonify({
                "success": True,
                "title": result.get('title', '无标题'),
                "videoUrl": result.get('video_url', ''),
                "coverUrl": result.get('cover_url', '')
            })
        else:
            return jsonify({
                "success": False,
                "msg": res_data.get('message', '解析失败')
            }), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "msg": f"网络请求异常: {str(e)}"}), 500
    except ValueError:
        return jsonify({"success": False, "msg": "接口返回了非 JSON 格式，可能被拦截"}), 500

if __name__ == '__main__':
    # 启动服务，监听所有本地 IP 的 5000 端口
    print("🚀 后端服务已启动，接口地址: http://127.0.0.1:5000/api/parse")
    app.run(host='0.0.0.0', port=5000, debug=True)
