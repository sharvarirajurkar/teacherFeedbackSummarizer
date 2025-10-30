<img width="2880" height="1628" alt="Screenshot 2025-10-30 at 12 05 32 PM" src="https://github.com/user-attachments/assets/95e7184f-0bd3-4486-82a7-107e72aac441" />AI-Powered Teacher Feedback Summarizer (Hybrid AWS + Local LLM)


🔍 Overview
This project automates the process of collecting, summarizing, and displaying teacher feedback using a hybrid architecture:
🧾 Frontend (HTML/CSS/JS): Collects teacher feedback
☁️ AWS Backend (Lambda + API Gateway + DynamoDB): Stores and retrieves data
💻 Local Python Summarizer: Downloads data, summarizes using an LLM model, and uploads results back
📊 Dashboard Page: Displays summarized feedback and recommendations

Homepage:
<img width="2880" height="1628" alt="Screenshot 2025-10-30 at 12 05 32 PM" src="https://github.com/user-attachments/assets/ea66b6a3-1f9c-4f9a-802b-5079ed45a4f1" />


Submissions page:
<img width="2878" height="1524" alt="Screenshot 2025-10-30 at 12 05 39 PM" src="https://github.com/user-attachments/assets/bcbd02ba-4ec3-48f9-a97f-286ce2f3a458" />


Summary page:
<img width="2878" height="1560" alt="Screenshot 2025-10-30 at 12 29 33 PM" src="https://github.com/user-attachments/assets/0940cc81-cdbb-44b2-9874-45a612afbd04" />
<img width="2880" height="1324" alt="Screenshot 2025-10-30 at 12 29 52 PM" src="https://github.com/user-attachments/assets/daca6fe3-f706-4741-814a-25cac19c8fad" />
<img width="2880" height="1612" alt="Screenshot 2025-10-30 at 12 30 33 PM" src="https://github.com/user-attachments/assets/0176a275-27a7-4a49-9942-cd986a65792e" />
<img width="2880" height="458" alt="Screenshot 2025-10-30 at 12 30 44 PM" src="https://github.com/user-attachments/assets/89116b66-cf7a-4711-9e96-77ff9bf493da" />


🚀 Features
✅ Collects teacher feedback from a web page

✅ Stores feedback in AWS DynamoDB

✅ Downloads unsummarized feedback to your local system

✅ Summarizes text using your local LLM model (MiniPLM-Qwen-200M)

✅ Uploads summarized results back to DynamoDB

✅ Displays teacher-wise summaries on the frontend



🏗️ System Architecture

Frontend (HTML Form)

       ↓
       
API Gateway → Lambda (store feedback)

       ↓
       
DynamoDB (FeedbackTable)

       ↓
       
Local Python Summarizer (uses local LLM)

       ↓
       
DynamoDB (update with summaries)

       ↓
       
Frontend Dashboard (display summaries)



⚙️ Setup Instructions

🪜 Step 1: AWS Setup

1️⃣ Create DynamoDB Table
Name: FeedbackTable
Primary Key: teacher (String)
Attributes:
teacher
feedback
summary (optional, added later)

2️⃣ Create Lambda Function (Store Feedback)
Name: FeedbackCollector
Runtime: Python 3.10
Add this code:
import json
import boto3

dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table('FeedbackTable')


def lambda_handler(event, context):
    body = json.loads(event['body'])
    teacher = body['teacher']
    feedback = body['feedback']
    
    table.put_item(Item={'teacher': teacher, 'feedback': feedback})
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Feedback saved successfully!'})
    }
Deploy it

Add permission for DynamoDB full access

3️⃣ Create API Gateway

Create a REST API
Resource: /feedback
Method: POST
Integration: Lambda (FeedbackCollector)
Enable CORS
Deploy the API → copy the Invoke URL


🪜 Step 2: Frontend Setup
File: index.html



🪜 Step 3: Local Summarization Setup
1️⃣ Install dependencies:
pip install boto3 pandas llama-cpp-python
2️⃣ Place your local model:
MiniPLM-Qwen-200M-Q4_K_M.gguf in your working directory.
3️⃣ Create summarization script: local_summarizer.py
import boto3, pandas as pd
from llama_cpp import Llama

# Initialize LLM
llm = Llama(model_path="MiniPLM-Qwen-200M-Q4_K_M.gguf")

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FeedbackTable')

# Download data
response = table.scan()
data = response['Items']
df = pd.DataFrame(data)
df.to_csv('feedback_data.csv', index=False)
print("✅ Feedback data downloaded.")

# Summarize
summaries = []
for feedback in df["feedback"]:
    prompt = f"Summarize and recommend based on this feedback:\n{feedback}"
    output = llm(prompt, max_tokens=200)
    summaries.append(output["choices"][0]["text"].strip())

df["summary"] = summaries
df.to_csv("feedback_summarized.csv", index=False)
print("✅ Summaries saved locally.")

# Upload summaries back
the python code to be executed to implement the summarizer func


📂 Suggested Repository Structure
📁 TeacherFeedbackSummarizer/
├── README.md
├── index.html                 # Feedback submission page
├── summary.html               # Dashboard page
├── local_summarizer.py        # Local summarization script
├── feedback_data.csv          # Optional local export
├── feedback_summarized.csv    # Optional local summarized export
└── requirements.txt           # (optional) dependencies


Optional: requirements.txt
boto3
pandas
llama-cpp-python
Future Improvements
Add authentication (Cognito or IAM)
Add an S3 dashboard to visualize summary trends
Replace local summarizer with AWS Comprehend or SageMaker for full cloud automation
