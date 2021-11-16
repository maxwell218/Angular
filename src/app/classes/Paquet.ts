/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Paquet.ts

import { Carte } from './Carte';

// Représente un paquet de 52 cartes
export class Paquet {
    readonly SORTES_MAX = 4;
    readonly VALEURS_MAX = 13;
    cartes:Carte[] = [];
    curseur:number = 0;

    constructor() {
        // Initialisation du paquet de cartes non brassé
        for (let s = 0; s < this.SORTES_MAX; s++) {
            for (let v = 0; v < this.VALEURS_MAX; v++) {
                this.cartes.push(new Carte(s, v));
            }
        }
    }

    brasse() {
        this.curseur = 0;
        let nombreDeCartes = this.SORTES_MAX * this.VALEURS_MAX;

        for (let i = 0; i < nombreDeCartes; i++) {
            // Valeur entre 0 (inclus) et 52 (exclus)
            let rand = Math.floor(Math.random() * nombreDeCartes);

            // Échange
            let tampon = this.cartes[i];
            this.cartes[i] = this.cartes[rand];
            this.cartes[rand] = tampon;
        }
    }

    distribue():Carte {
        let carte = this.cartes[this.curseur];
        this.curseur++;
        return carte;
    }

}