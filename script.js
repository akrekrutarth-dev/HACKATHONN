document.addEventListener("DOMContentLoaded", () => {
  const qrInput = document.getElementById('qr-input');
  const submitBtn = document.getElementById('submit-btn');
  const messageDiv = document.getElementById('message');
  const recordsList = document.getElementById('records-list');

  const storedRecords = localStorage.getItem("attendanceRecords");
  let records = storedRecords ? JSON.parse(storedRecords) : [];

  function renderRecords() {
    recordsList.innerHTML = "";
    records.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      recordsList.appendChild(li);
    });
  }

  function showMessage(msg, isError=false) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? 'red' : 'green';
    setTimeout(()=>{messageDiv.textContent='';},3000);
  }

  function markAttendance(code) {
    const storedStudents = localStorage.getItem("students");
    const students = storedStudents ? JSON.parse(storedStudents) : [];
    const student = students.find(s => s.qr===code);
    if(!student){
      showMessage("❌ QR code not registered", true);
      return;
    }
    const record = `${new Date().toLocaleString()} ✅ ${student.name} (${code})`;
    records.push(record);
    localStorage.setItem("attendanceRecords", JSON.stringify(records));
    renderRecords();
    showMessage(`✔ Attendance marked for ${student.name}`);
  }

  submitBtn.addEventListener('click',()=>{
    const code = qrInput.value.trim();
    if(!code){ showMessage("Enter QR code", true); return; }
    markAttendance(code);
    qrInput.value = '';
  });

  const qrReader = new Html5Qrcode("qr-reader");
  qrReader.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250}}, qrCodeMessage=>{
    markAttendance(qrCodeMessage);
  }).catch(err=>{
    console.error(err);
    showMessage("⚠ Camera access error", true);
  });

  renderRecords();
});
