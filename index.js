// Employee Database Management System (Frontend only)
// Note: Adding/Deleting employees here updates data only in memory.
// Changes are NOT saved permanently to data.json or any backend.

(async function () {
    // Fetch initial employee data from data.json (static file)
    const data = await fetch("data.json");
    const res = await data.json();
    let employees = res;

    // Keep track of selected employee
    let selectedEmployeeId = employees[0].id;
    let selectedEmployee = employees[0];

    // DOM elements for employee list and employee details
    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo = document.querySelector(".employees__single--info");

    // ---------------- Add Employee Logic ----------------
    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");

    // Show add employee modal
    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    // Close modal when clicking outside form
    addEmployeeModal.addEventListener("click", (e) => {
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none";
        }
    });

    // Restrict DOB input → Minimum 18 years old
    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

    // Handle add employee form submit
    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(addEmployeeForm);
        const values = [...formData.entries()];
        let empData = {};
        values.forEach((val) => {
            empData[val[0]] = val[1];
        });

        // Generate new employee data
        empData.id = employees[employees.length - 1].id + 1;
        empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
        empData.imageUrl = empData.imageUrl || "gfg.png";

        // Push into local employees array (NOT saved to file)
        employees.push(empData);

        // Re-render employee list
        renderEmployees();

        // Reset form + close modal
        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
    });
    // ----------------------------------------------------

    // ---------------- Select & Delete Employee Logic ----------------
    employeeList.addEventListener("click", (e) => {
        // Select employee
        if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
            selectedEmployeeId = e.target.id;
            renderEmployees();
            renderSingleEmployee();
        }

        // Delete employee
        if (e.target.tagName === "I") {
            employees = employees.filter((emp) => String(emp.id) !== e.target.parentNode.id);

            // If deleted employee was selected, update selection
            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                selectedEmployeeId = employees[0]?.id || -1;
                selectedEmployee = employees[0] || {};
                renderSingleEmployee();
            }

            renderEmployees();
        }
    });
    // ----------------------------------------------------------------

    // ---------------- Render All Employees ----------------
    const renderEmployees = () => {
        employeeList.innerHTML = "";
        employees.forEach((emp) => {
            const employee = document.createElement("span");
            employee.classList.add("employees__names--item");

            // Highlight selected employee
            if (parseInt(selectedEmployeeId, 10) === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }

            // Render employee name with delete button
            employee.setAttribute("id", emp.id);
            employee.innerHTML = `${emp.firstName} ${emp.lastName} 
                <i class="employeeDelete">&#10060;</i>`;
            employeeList.append(employee);
        });
    };
    // ------------------------------------------------------

    // ---------------- Render Single Employee ----------------
    const renderSingleEmployee = () => {
        // No employee selected
        if (selectedEmployeeId === -1) {
            employeeInfo.innerHTML = "";
            return;
        }

        // Render selected employee details
        employeeInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" />
        <span class="employees__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} 
            (${selectedEmployee.age})
        </span>
        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
      `;
    };
    // --------------------------------------------------------

    // Initial render
    renderEmployees();
    if (selectedEmployee) renderSingleEmployee();
})();