/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Joueur.ts

import { Carte } from './Carte';

// Représente un joueur dans une partie de poker
export class Joueur {
    valeur:number = 0;
    valeurEnFrancais:string = '';
    main:Carte[] = [];

    assignerCarte(cartes:Carte[]) {
        cartes.forEach(carte => {
            this.main.push(carte);
        });

        this.main.sort((a, b) => {
            return b.valeur - a.valeur;
        })
    }

    reinitialiserJoueur() {
        this.valeur = 0;
        this.valeurEnFrancais = '';
        this.main = [];
    }
}