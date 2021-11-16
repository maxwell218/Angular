/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Carte.ts

// IMPORTS

// Représente une carte de jeu
export class Carte {
    sorte?:number;
    valeur:number;

    constructor(sorte:number, valeur:number) {
        this.sorte = sorte;
        this.valeur = valeur;
    }
}