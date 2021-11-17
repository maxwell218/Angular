/// Tommy Harvey - 1531915
/// 15 novembre 2021
/// Evaluateur.ts

import { Carte } from './Carte';

// Permet d'évaluer la valeur d'une main de poker
export class Evaluateur {
    readonly sorteEnMot:string[] = ['pique', 'trèfle', 'carreau', 'coeur'];
    readonly valeurEnMot:string[] = ['deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'valet', 'dame', 'roi', 'as'];
    readonly VALEUR_PAIRE = 100;
    readonly VALEUR_DOUBLE_PAIRE = 200;
    readonly VALEUR_BRELAN = 300;
    readonly VALEUR_QUINTE = 400;
    readonly VALEUR_FLUSH = 500;
    readonly VALEUR_FULL = 600;
    readonly VALEUR_CARRE = 700;
    readonly VALEUR_QUINTE_FLUSH = 800;
    readonly VALEUR_QUINTE_ROYALE = 900;

    cartes:Carte[] = [];
    cartesGagnantes:Carte[] = [];
    sorteFlush:number = 0;
    titreGagnant:string = '';

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
    }

    // Source : https://github.com/danielpaz6/Poker-Hand-Evaluator
    getValeur():number {
        // On doit avoir une main de 7 cartes
        if (this.cartes.length < 7) {
            return 0;
        }

        this.trierMain();

        let compteurDoublon = 1, compteurSuite = 1, compteurSuiteMax = 1;
        let valeurCartePlusHaute = -1, valeurCarteDoublon = -1, valeurSuiteMax = -1;

        let valeurCarteCourante = -1, valeurCarteProchaine = -1;

        valeurCartePlusHaute = this.cartes[this.cartes.length - 1].valeur;

        let doublons:Doublon[] = [];

        for (let i = 0; i < 6; i++) {
            // Params carte courante
            valeurCarteCourante = this.cartes[i].valeur;

            // Params carte prochaine
            valeurCarteProchaine = this.cartes[i + 1].valeur;

            // Doublons ?
            if (valeurCarteCourante == valeurCarteProchaine) {
                compteurDoublon++;
                valeurCarteDoublon = valeurCarteCourante;
            } else if (compteurDoublon > 1) {
                doublons.push({valeur: valeurCarteDoublon, compteur: compteurDoublon});
                compteurDoublon = 1;
            }

            // Suite ?
            if (valeurCarteCourante + 1 == valeurCarteProchaine) {
                compteurSuite++;
            } else if (valeurCarteCourante != valeurCarteProchaine) {
                if (compteurSuite > compteurSuiteMax) {
                    compteurSuiteMax = compteurSuite;
                    valeurSuiteMax = valeurCarteCourante;
                }

                compteurSuite = 1;
            }
        }

        // La dernière carte
        // On regarde pour la dernière carte si elle rentre dans la suite
        if (compteurSuite > compteurSuiteMax) {
            compteurSuiteMax = compteurSuite;
            valeurSuiteMax = valeurCarteProchaine;
        }
        // Et si elle rentre dans un doublon
        if (compteurDoublon > 1) {
            doublons.push({valeur: valeurCarteProchaine, compteur: compteurDoublon})
        }

        // Calcul des points de la main (5 cartes sur 7 au hold'em) en ordre des meilleurss mains au moins meilleures
        // QUINTE ROYALE (constante, suite de 10 - As de la même sorte)
        // Source : https://en.wikipedia.org/wiki/List_of_poker_hands#Straight_flush
        if (this.cartes[6].valeur == 12 && this.cartes[5].valeur == 11 && this.cartes[4].valeur == 10 && this.cartes[3].valeur == 9 && this.cartes[2].valeur == 8) {
            for (let i = 2; i < this.cartes.length; i++) {
                if (this.cartes[i].sorte == this.cartes[6].sorte) {
                    this.cartesGagnantes.push(this.cartes[i]);
                }
            }

            if (this.cartesGagnantes.length == 5) {
                this.titreGagnant = 'Quinte royale';
                return this.VALEUR_QUINTE_ROYALE;
            }
        } else {
            // Quinte flush
            for (let s = 0; s < this.sorteEnMot.length; s++) {
                // Crée un tableau pour chaque sorte de carte
                let cartesParSorte = this.cartes.filter(c => c.sorte == s);

                // Si une sorte atteint 5 cartes, on a au moins une flush
                if (cartesParSorte.length >= 5) {
                    let compteurCartesQuiSeSuivent = 1, compteurMax = 1, valeurDerniereCarte = -1;
                    for (let i = 0; i < cartesParSorte.length - 1; i++) {
                        // On compare les deux cartes (position courante et celle d'après) 
                        if (cartesParSorte[i].valeur + 1 == cartesParSorte[i + 1].valeur) {
                            compteurCartesQuiSeSuivent++;
                            valeurDerniereCarte = cartesParSorte[i + 1].valeur;
                            this.cartesGagnantes.push(cartesParSorte[i]);
                        } else {
                            compteurMax = compteurCartesQuiSeSuivent;
                            compteurCartesQuiSeSuivent = 1;
                            this.cartesGagnantes = [];
                        }
                    }

                    // Cas particulier : 2, 3, 4, 5, As, As, AS
                    // On doit regarder si les 3 dernières cartes sont des as et s'ils sont de la même sorte que les autres cartes
                    if (compteurCartesQuiSeSuivent >= 5 || (compteurMax == 4 && valeurDerniereCarte == 5 && cartesParSorte[cartesParSorte.length - 1].valeur == 12)) {
                        this.titreGagnant = 'Quinte flush';
                        return this.VALEUR_QUINTE_FLUSH + valeurDerniereCarte;
                    } 
                }

            }

            // On met les doublons en ordre descendant de valeur
            doublons = doublons.sort((a, b) => {
                return b.compteur - a.compteur;
            });

            // Carré
            if (doublons.length > 0 && doublons[0].compteur == 4) {
                this.titreGagnant = 'Carré';
                for (let s = 0; s < this.sorteEnMot.length; s++) {
                    this.cartesGagnantes.push({ valeur:doublons[0].valeur, sorte:s });
                }
                // Valeur de la cinquième et dernière carte
                let valeurDerniereCarte = -1;
                for (let i = this.cartes.length - 1; i >= 0; i--) {
                    if (this.cartes[i].valeur != doublons[0].valeur) {
                        valeurDerniereCarte = this.cartes[i].valeur;
                        break;
                    }
                }
                return this.VALEUR_CARRE + doublons[0].valeur + this.cartes[this.cartes.length - 1].valeur + valeurDerniereCarte;
            }

            // Full
            // Cas particulier : 2 paires de 2 cartes et une paire de trois carte
            else if (doublons.length > 2 && doublons[0].compteur == 3 && doublons[1].compteur == 2 && doublons[2].compteur == 2) {
                this.titreGagnant = 'Full';
                let valeurCartePlusGrande = Math.max(doublons[1].valeur, doublons[2].valeur);
                for (let i = 0; i < 3; i++) {
                    this.cartesGagnantes.push({valeur:doublons[0].valeur})
                }
                for (let i = 0; i < 2; i++) {
                    this.cartesGagnantes.push({valeur:valeurCartePlusGrande});
                }
                // Valeur de la cinquième et dernière carte
                let valeurDerniereCarte = -1;
                for (let i = this.cartes.length - 1; i >= 0; i--) {
                    if (this.cartes[i].valeur != doublons[0].valeur && this.cartes[i].valeur != valeurCartePlusGrande) {
                        valeurDerniereCarte = this.cartes[i].valeur;
                        break;
                    }
                }
                return this.VALEUR_FULL + doublons[0].valeur + doublons[1].valeur + valeurCartePlusGrande;
            }
            // Cas particulier : 2 paires de 3 cartes, il faut trouver la meilleur combinaison
            else if (doublons.length > 1 && doublons[0].compteur == 3 && doublons[1].compteur == 3) {
                this.titreGagnant = 'Full';
                let valeurCartePlusGrande = Math.max(doublons[0].valeur, doublons[1].valeur);
                let valeurCartePlusPetite = Math.min(doublons[0].valeur, doublons[1].valeur);
                for (let i = 0; i < 3; i++) {
                    this.cartesGagnantes.push({valeur:valeurCartePlusGrande})
                }
                for (let i = 0; i < 2; i++) {
                    this.cartesGagnantes.push({valeur:valeurCartePlusPetite});
                }
                // Valeur de la cinquième et dernière carte
                let valeurDerniereCarte = -1;
                for (let i = this.cartes.length - 1; i >= 0; i--) {
                    if (this.cartes[i].valeur != valeurCartePlusGrande) {
                        valeurDerniereCarte = this.cartes[i].valeur;
                        break;
                    }
                }
                return this.VALEUR_FULL + doublons[0].valeur + doublons[1].valeur + valeurDerniereCarte;
            } 
            else if (doublons.length > 1 && doublons[0].compteur == 3 && doublons[1].compteur == 2) {
                this.titreGagnant = 'Full';
                for (let i = 0; i < 3; i++) {
                    this.cartesGagnantes.push({valeur:doublons[0].valeur})
                }
                for (let i = 0; i < 2; i++) {
                    this.cartesGagnantes.push({valeur:doublons[1].valeur});
                }
                // Valeur de la cinquième et dernière carte
                let valeurDerniereCarte = -1;
                for (let i = this.cartes.length - 1; i >= 0; i--) {
                    if (this.cartes[i].valeur != doublons[0].valeur && this.cartes[i].valeur != doublons[1].valeur) {
                        valeurDerniereCarte = this.cartes[i].valeur;
                        break;
                    }
                }
                return this.VALEUR_FULL + doublons[0].valeur + doublons[1].valeur + valeurDerniereCarte;
            } else {
                 // Flush
                for (let s = 0; s < this.sorteEnMot.length; s++) {
                    // Crée un tableau pour chaque sorte de carte
                    let cartesParSorte = this.cartes.filter(c => c.sorte == s);
    
                    // Si une sorte atteint 5 cartes, on a au moins une flush
                    if (cartesParSorte.length >= 5) {
                        this.titreGagnant = 'Flush';
                        // On ajoute les 5 dernières cartes dans le tableau des cartes gagnantes
                        this.cartesGagnantes = cartesParSorte.filter((u, i) => i >= 2);
                        return this.VALEUR_FLUSH + this.cartesGagnantes[4].valeur;
                    }
                }

                // Quinte
                if (compteurSuiteMax >= 5) {
                    this.titreGagnant = 'Quinte';
                    for (let i = valeurSuiteMax; i > compteurSuiteMax; i--) {
                        this.cartesGagnantes.push({valeur: i});
                    }
                    return this.VALEUR_QUINTE + this.cartesGagnantes[0].valeur;
                }
                // Cas particulier : 2, 3, 4, 5, As, As, AS
                // On doit regarder si les 3 dernières cartes sont des as et s'ils sont de la même sorte que les autres cartes
                else if (compteurSuiteMax == 4 && valeurSuiteMax == 5 && valeurCartePlusHaute == 12) {
                    this.titreGagnant = 'Quinte';
                    this.cartesGagnantes.push({valeur: 12});
                    for (let i = valeurSuiteMax; i > 1; i--) {
                        this.cartesGagnantes.push({valeur: i});
                    }
                    return this.VALEUR_QUINTE + valeurSuiteMax;
                } 
                // Brelan
                else if (doublons.length > 0 && doublons[0].compteur == 3) {
                    this.titreGagnant = 'Brelan';
                    // Valeur des dernières cartes
                    let valeurDernieresCartes = [];
                    for (let i = this.cartes.length - 1; i >= 0; i--) {
                        if (this.cartes[i].valeur != doublons[0].valeur) {
                            valeurDernieresCartes.push(this.cartes[i].valeur);
                        }
                        if (valeurDernieresCartes.length >= 3) {
                            break;
                        }
                    }
                    return this.VALEUR_BRELAN + valeurDernieresCartes[0] + valeurDernieresCartes[1];
                }
                // 2 Paires
                else if (doublons.length > 1 && doublons[0].compteur == 2 && doublons[1].compteur == 2) {
                    this.titreGagnant = 'Deux paires';
                    
                    // Cas particulier : 3 paires de 2 cartes, on doit trouver les deux meilleures paires
                    if (doublons.length > 2 && doublons[2].compteur == 2) {
                        let valeursTroisPaires:number[] = [doublons[0].valeur, doublons[1].valeur, doublons[2].valeur];
                        valeursTroisPaires.sort((a, b) => {
                            return b - a;
                        });
                        for (let i = 0; i < 2; i++) {
                            this.cartesGagnantes.push({valeur: valeursTroisPaires[0]});
                        }
                        for (let i = 0; i < 2; i++) {
                            this.cartesGagnantes.push({valeur: valeursTroisPaires[1]});
                        }
                    } else {
                        for (let i = 0; i < 2; i++) {
                            this.cartesGagnantes.push({valeur: doublons[0].valeur});
                        }
                        for (let i = 0; i < 2; i++) {
                            this.cartesGagnantes.push({valeur: doublons[1].valeur});
                        }
                    }

                    // Valeur de la cinquième et dernière carte
                    let valeurDerniereCarte = -1;
                    for (let i = this.cartes.length - 1; i >= 0; i--) {
                        if (this.cartes[i].valeur != this.cartesGagnantes[0].valeur && this.cartes[i].valeur != this.cartesGagnantes[2].valeur) {
                            valeurDerniereCarte = this.cartes[i].valeur;
                            break;
                        }
                    }

                    return this.VALEUR_DOUBLE_PAIRE + this.cartesGagnantes[0].valeur + this.cartesGagnantes[2].valeur + valeurDerniereCarte;
                }
                // 1 Paire
                else if (doublons.length > 0 && doublons[0].compteur == 2) {
                    this.titreGagnant = 'Paire';
                    for (let i = 0; i < 2; i++) {
                        this.cartesGagnantes.push({valeur: doublons[0].valeur});
                    }
                    // Valeur des dernières cartes
                    let valeurDernieresCartes = [];
                    for (let i = this.cartes.length - 1; i >= 0; i--) {
                        if (this.cartes[i].valeur != doublons[0].valeur ) {
                            valeurDernieresCartes.push(this.cartes[i].valeur);
                        }
                        if (valeurDernieresCartes.length >= 3) {
                            break;
                        }
                    }
                    return this.VALEUR_PAIRE + doublons[0].valeur + valeurDernieresCartes.reduce((a, b) => a + b, 0);
                }
                // Carte la plus haute
                else {
                    this.titreGagnant = 'Carte haute';
                    // Valeur des dernières cartes
                    let valeurDernieresCartes = [];
                    for (let i = this.cartes.length - 1; i >= 0; i--) {
                        valeurDernieresCartes.push(this.cartes[i].valeur);
                        if (valeurDernieresCartes.length >= 5) {
                            break;
                        }
                    }
                    return valeurDernieresCartes.reduce((a, b) => a + b, 0);
                }
            }
        }
        return 0;
    }

    convertirValeurEnFrancais(valeur:number):string {
        // Quinte royale
        if (valeur >= this.VALEUR_QUINTE_ROYALE) {
            return this.titreGagnant;
        }
        // Quinte flush
        else if (valeur >= this.VALEUR_QUINTE_FLUSH) {
            return this.titreGagnant;
        }
        // Carré
        else if (valeur >= this.VALEUR_CARRE) {
            return this.titreGagnant;
        }
        // Full
        else if (valeur >= this.VALEUR_FULL) {
            return this.titreGagnant;
        }
        // Couleur
        else if (valeur >= this.VALEUR_FLUSH) {
            return this.titreGagnant;
        }
        // Quinte
        else if (valeur >= this.VALEUR_QUINTE) {
            return this.titreGagnant;
        }
        // Brelan
        else if (valeur >= this.VALEUR_BRELAN) {
            return this.titreGagnant;
        }
        // Deux paires
        else if (valeur >= this.VALEUR_DOUBLE_PAIRE) {
            return this.titreGagnant;
        }
        // Paire
        else if (valeur >= this.VALEUR_PAIRE) {
            return this.titreGagnant;
        }
        // Carte la plus haute
        else {
            return this.titreGagnant;
        }
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