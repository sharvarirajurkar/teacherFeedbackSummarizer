const API_URL = "https://9yjx90lobb.execute-api.ap-south-1.amazonaws.com/prod";

async function submitFeedback() {
  const data = {
    teacher_name: document.getElementById("teacher_name").value,
    emp_id: document.getElementById("emp_id").value,
    course_code: document.getElementById("course_code").value,
    feedback_text: document.getElementById("feedback_text").value
  };

  const res = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  document.getElementById("student_msg").innerText = result.message || "Saved!";
}

async function getSummary() {
  const data = { teacher_name: document.getElementById("teacher_query").value };
  const res = await fetch(`${API_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  document.getElementById("summary_output").innerText = result.summary || "No feedback found.";
}
