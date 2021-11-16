/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Evaluateur.ts

import { Carte } from './Carte';

// Permet d'évaluer la valeur d'une main de poker
export class Evaluateur {
    readonly QUINTE_MIN = 4;
    readonly VALEUR_PAIRE = 100;
    readonly VALEUR_DOUBLE_PAIRE = 200;
    readonly VALEUR_BRELAN = 300;
    readonly VALEUR_QUINTE = 400;
    readonly VALEUR_COULEUR = 500;
    readonly VALEUR_FULL = 600;
    readonly VALEUR_CARRE = 700;
    readonly VALEUR_QUINTE_FLUSH = 800;

    cartes:Carte[] = [];
    sorteFlush:number = 0;

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
        let unAs = false;

        // Variable pour les flushs
        let sortes:Sorte = {pique: 0, trefle: 0, carreau: 0, coeur: 0};

        // Variables pour les quintes
        let compteurQuinte = 0;
        let compteurQuinteMax = 0;
        let valeursDeLaQuinte = [];

        // Variable pour les paires
        let doublons:Doublon[] = [];

        for (let i = 0; i < this.cartes.length; i++) {
            // As ?
            if (this.cartes[i].valeur == 13) {
                unAs = true;
            }

            // Flush
            switch(this.cartes[i].sorte) {
                case 1: 
                    sortes.pique++;
                    break;
                case 2:
                    sortes.trefle++;
                    break;
                case 3:
                    sortes.carreau++;
                    break;
                case 4:
                    sortes.coeur++;
                    break;
            }

            if (i < this.cartes.length - 1) {
                // Quintes
                // Si la valeur de la carte courante suit celle de la prochaine carte
                if (this.cartes[i].valeur == this.cartes[i + 1].valeur - 1) {
                    valeursDeLaQuinte.push(this.cartes[i].valeur);
                    compteurQuinte++;
                } else {
                    compteurQuinteMax = compteurQuinte;
                    if (compteurQuinteMax <= this.QUINTE_MIN - 1) {
                        valeursDeLaQuinte = [];
                    }
                    compteurQuinte = 0;
                }

                // Si nous avons une quinte de 4 qui commence par un 2, on regarde si on a un as et on incremente le compteur de quinte
                if (compteurQuinteMax == this.QUINTE_MIN && valeursDeLaQuinte.includes(2) && unAs) {
                    compteurQuinteMax++;
                }

                // Doublons
                // Si la carte courante à la même valeur que la prochaine carte
                if (this.cartes[i].valeur == this.cartes[i + 1].valeur) {

                    // On ajoute la valeur de la carte et on incremente son compte si elle existe dans le tableau de doublon
                    let nouveauDoublon = true;
                    if (doublons.length > 0) {
                        // On parcours le tableau a la recherche d'une valeur existante
                        doublons.forEach(doub => {
                            // Un doublon avec une valeur existante
                            if (doub.valeur == this.cartes[i].valeur) {
                                doub.compteur++;
                                nouveauDoublon = false;
                            }
                        }); 
                    }

                    // Sinon, il n'y a pas de doublon existant, on l'ajoute au tableau
                    if (nouveauDoublon) {
                        let doub:Doublon = { valeur: this.cartes[i].valeur, compteur: 1 };
                        doublons.push(doub);
                    }
                }
            }
        }
        
        // Valeurs
        // Quinte flush
        if ((sortes.pique >= 5 || sortes.trefle >= 5 || sortes.carreau >= 5 || sortes.trefle >= 5) && compteurQuinteMax == 5) {
            valeur += this.VALEUR_QUINTE_FLUSH;
        } 
        // Carré, Full
        else if (doublons.length > 0) {
            let deux = false;
            let trois = false;
            for (let doub of doublons) {
                if (doub.compteur == 4) {
                    valeur += this.VALEUR_CARRE;
                    break;
                } else if (doub.compteur == 3) {
                    if (doub.compteur == 3 && deux) {
                        valeur += this.VALEUR_FULL;
                    }
                }
            }
        }
        // Couleur
        // Quinte
        // Brelan
        // Deux paires
        // Paire

        // Carte la plus haute
        this.cartes.forEach(carte => {
            valeur += carte.valeur
        });

        return valeur;
    }

    convertirValeurEnFrancais(valeur:number) {
        // Quinte flush
        // Carré
        // Full
        // Couleur
        // Quinte
        // Brelan
        // Deux paires
        // Paire
        // Carte la plus haute
    }
}

interface Doublon {
    valeur:number;
    compteur:number;
}

interface Sorte {
    pique:number;
    trefle:number;
    carreau:number;
    coeur:number;
}