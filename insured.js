"use strict";

class Insured {
  constructor(firstName, lastName, birthDate, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.phone = phone.toString();
  }

  // Metoda pro validaci údajů o pojištěném
  static validateInsured(firstName, lastName, birthDate, phone) {
    if (!firstName || !lastName) {
      return "Jméno a příjmení jsou povinné.";
    }
    if (!/^\+\d{1,3}\d{3}\d{3}\d{3}$/.test(phone.toString())) {
      return "Telefonní číslo musí obsahovat mezinárodní předvolbu (např. +420) a být ve formátu +XXXYYYXXXYYY.";
    }

    // Výpočet věku na základě data narození
    const dnes = new Date();
    const datumNar = new Date(birthDate);
    let vek = dnes.getFullYear() - datumNar.getFullYear();
    const mesic = dnes.getMonth() - datumNar.getMonth();
    if (mesic < 0 || (mesic === 0 && dnes.getDate() < datumNar.getDate())) {
      vek--;
    }

    if (isNaN(vek) || vek < 0 || vek > 150) {
      return "Věk musí být mezi 0 a 150 lety.";
    }
    return null; // Žádné chyby
  }

  // Metoda pro formátování data narození
  static formatBirthDate(date) {
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
