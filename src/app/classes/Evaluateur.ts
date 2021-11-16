/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Evaluateur.ts

import { Carte } from './Carte';

// Permet d'évaluer la valeur d'une main de poker
export class Evaluateur {
    readonly VALEUR_PAIRE = 100;
    readonly VALEUR_DOUBLE_PAIRE = 200;
    readonly VALEUR_BRELAN = 300;
    readonly VALEUR_QUINTE = 400;
    readonly VALEUR_COULEUR = 500;
    readonly VALEUR_FULL = 600;
    readonly VALEUR_CARRE = 700;
    readonly VALEUR_QUINTE_FLUSH = 800;

    cartes:Carte[] = [];

    constructor(cartesAEvaluer:Carte[]) {
        this.cartes = cartesAEvaluer;
    }

    trierMain() {
        let termine = false;

        // Source : https://en.wikipedia.org/wiki/Sorting_algorithm#Bubble_sort
        while (!termine) {
            termine = true;

            // On parcours la main pour chaque carte
            for (var i = 1; i < this.cartes.length; i++) {

                // Si la valeur de la carte précédente est plus grande que la valeur de la carte courante
                // On inverse les positions
                if (this.cartes[i - 1].valeur > this.cartes[i].valeur) {
                    termine = false;
                    let tampon = this.cartes[i - 1];
                    this.cartes[i - 1] = this.cartes[i];
                    this.cartes[i] = tampon;
                }
            }
        }

        this.cartes.reverse();
    }

    // Source : https://github.com/danielpaz6/Poker-Hand-Evaluator
    getValeur():number {
        this.trierMain();
        let valeur = 0;

        // Quinte flush
        // Carre
        // Full
        // Couleur
        // Quinte
        // Brelan
        // Paires

        let unAs = false;
        let compteurSequence = 0;
        let doublon = 0;

        for (let i = 0; i < this.cartes.length; i++) {
            if (this.cartes[i].valeur == 13) {
                unAs = true;
            }
        }
        
        
        // Carte la plus haute
        this.cartes.forEach(carte => {
            valeur += carte.valeur
        });

        return valeur;
    }

    convertirValeurEnFrancais(valeur:number) {
        // Quinte flush
        // Carre
        // Full
        // Couleur
        // Quinte
        // Brelan
        // Deux paires
        // Paire
        // Carte la plus haute
    }
}