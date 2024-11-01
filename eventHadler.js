"use strict";

class InsuranceApp {
  constructor() {
    this.insuranceList = JSON.parse(localStorage.getItem("insurance")) || [];
    this.form = document.getElementById("insuranceForm");
    this.editIndex = null;
    this.originalInsured = null;
  }

  // Odstranění pojištěnce
  deleteInsured(index, row) {
    this.insuranceList.splice(index, 1);
    localStorage.setItem("insurance", JSON.stringify(this.insuranceList));
    row.remove();
  }

  // Úprava pojištěnce
  onEditInsured(insured, index) {
    document.getElementById("firstName").value = insured.firstName;
    document.getElementById("lastName").value = insured.lastName;
    document.getElementById("birthDate").value = insured.birthDate;
    document.getElementById("phone").value = insured.phone;

    this.editIndex = index;
    this.originalInsured = new Insured(
      insured.firstName,
      insured.lastName,
      insured.birthDate,
      insured.phone
    );
  }

  // Zpracování formuláře po odeslání
  onFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const validationError = Insured.validateInsured(
      firstName,
      lastName,
      birthDate,
      phone
    );
    if (validationError) {
      alert(validationError);
      return;
    }

    if (
      this.editIndex !== null &&
      this.originalInsured &&
      this.originalInsured.firstName === firstName &&
      this.originalInsured.lastName === lastName &&
      this.originalInsured.birthDate === birthDate &&
      this.originalInsured.phone === phone
    ) {
      alert("Nebyly provedeny žádné změny.");
      return;
    }

    const insured = new Insured(firstName, lastName, birthDate, phone);
    this.saveInsured(insured);

    this.form.reset();
    this.originalInsured = null;
  }

  // Uložení pojištěnce
  saveInsured(insured) {
    if (this.editIndex === null) {
      this.insuranceList.push(insured);
    } else {
      this.insuranceList[this.editIndex] = insured;
      this.editIndex = null;
    }
    localStorage.setItem("insurance", JSON.stringify(this.insuranceList));
    this.reloadTable();
  }

  // Přidání tlačítek "Upravit" a "Odstranit"
  addEditAndDeleteButtons(optionsCell, insured, index) {
    const editButton = document.createElement("button");
    editButton.textContent = "Upravit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () =>
      this.onEditInsured(insured, index)
    );
    optionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Odstranit";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () =>
      this.deleteInsured(index, optionsCell.parentElement)
    );
    optionsCell.appendChild(deleteButton);
  }

  // Načtení a obnovení tabulky
  reloadTable() {
    this.tableBody.innerHTML = "";
    this.loadInsurance();
  }

  // Načtení pojištěnců z localStorage
  loadInsurance() {
    for (let i = 0; i < this.insuranceList.length; i++) {
      this.addRowToTable(this.insuranceList[i], i);
    }
  }

  // Přidání nového řádku do tabulky
  addRowToTable(insured, index) {
    const row = this.tableBody.insertRow();
    row.classList.add("new-row");

    row.insertCell(0).textContent = `${insured.firstName} ${insured.lastName}`;
    row.insertCell(1).textContent = insured.phone.toString();
    row.insertCell(2).textContent = Insured.formatBirthDate(insured.birthDate);

    const optionsCell = row.insertCell(3);
    this.addEditAndDeleteButtons(optionsCell, insured, index);
  }
}
