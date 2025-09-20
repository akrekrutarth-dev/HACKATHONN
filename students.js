
// students.js - Full Student Management + QR Code Logic

document.addEventListener("DOMContentLoaded", ()=>{
  const nameInput = document.getElementById("student-name");
  const addBtn = document.getElementById("add-student-btn");
  const tableBody = document.querySelector("#students-table tbody");

  // Load students from localStorage
  const stored = localStorage.getItem("students");
  let students = stored ? JSON.parse(stored) : [];

  // Save students to localStorage
  function saveStudents(){
    localStorage.setItem("students", JSON.stringify(students));
  }

  // Render the student table
  function renderTable(){
    tableBody.innerHTML = "";
    students.forEach((s, i)=>{
      const row = document.createElement("tr");
      const qrCell = document.createElement("td");
      qrCell.id = `qrcode-${i}`;

      row.innerHTML = `
        <td>${i+1}</td>
        <td>${s.name}</td>
        <td></td>
        <td><button class="delete-btn" data-index="${i}">🗑 Delete</button></td>
      `;
      row.cells[2].appendChild(qrCell);
      tableBody.appendChild(row);

      // Generate QR code for student
      new QRCode(qrCell, { text: s.qr, width: 80, height: 80 });

      // Optional: Download QR button
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "💾 Download QR";
      downloadBtn.style.marginLeft = "5px";
      downloadBtn.addEventListener("click", ()=>{
        const qrCanvas = qrCell.querySelector("canvas");
        if(qrCanvas){
          const url = qrCanvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = url;
          a.download = `${s.name}_QR.png`;
          a.click();
        }
      });
      row.cells[2].appendChild(downloadBtn);
    });

    // Attach delete event
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", ()=>{
        const index = btn.dataset.index;
        students.splice(index, 1);
        saveStudents();
        renderTable();
      });
    });
  }

  // Add new student
  addBtn.addEventListener("click", ()=>{
    const name = nameInput.value.trim();
    if(!name){ alert("Enter student name"); return; }
    const qr = "QR-" + String(students.length + 1).padStart(3, "0");
    students.push({ name, qr });
    saveStudents();
    renderTable();
    nameInput.value = "";
  });

  renderTable();
});
