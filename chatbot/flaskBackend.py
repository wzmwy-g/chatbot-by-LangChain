import json
from flask import Flask,request
from flask_cors import CORS
import os
os.environ["OPENAI_API_KEY"] = ""

from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.schema import messages_from_dict, messages_to_dict

llm = OpenAI(model="gpt-3.5-turbo-instruct")

template = """
{chat_history}
Human:{human_input}
AI:"""

prompt = PromptTemplate(
    input_variables=["item"],
    template=template,
)

# 指定要写入的文件名
file_name = "history.json"
# 使用 json.load 从 JSON 文件中读取数据
with open(file_name, "r") as json_file:
    file_content = json_file.read()
    if not file_content:
        loaded_data = {}  # 或者你想要的其他默认值
    else:
        loaded_data = json.loads(file_content)
new_messages = messages_from_dict(loaded_data)
memory = ConversationBufferMemory(memory_key="chat_history")
for message in new_messages:
    memory.chat_memory.add_message(message)

chain = LLMChain(llm=llm, prompt=prompt, verbose=True, memory=memory)

app = Flask(__name__)
#flask --app flaskBackend run
CORS(app)  # 允许所有域访问，可以根据需要设置允许的域

dicts = loaded_data

@app.post("/sendText")
def sendText():
    ans = chain.run(request.data.decode('utf-8'))
    dicts = messages_to_dict(memory.buffer_as_messages)

    # 使用 json.dump 将字典写入到 JSON 文件中
    with open(file_name, "w") as json_file:
        json.dump(dicts, json_file)
    print(f"Data has been saved to {file_name}")
    print(ans)
    return ans

@app.get("/getHistory")
def sendHistory():
    # 使用 json.load 从 JSON 文件中读取数据
    with open(file_name, "r") as json_file:
        file_content = json_file.read()
        if not file_content:
            history = {}  # 或者你想要的其他默认值
        else:
            history = json.loads(file_content)
#    print (dicts)
    return history

@app.post("/reset")
def reset():
    memory.clear()
    dicts = {}
     # 使用 json.dump 将字典写入到 JSON 文件中
    with open(file_name, "w") as json_file:
        json.dump(dicts, json_file)
    return "success"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"