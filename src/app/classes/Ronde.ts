/// Tommy Harvey - 1531915
/// 16 novembre 2021
/// Ronde.ts

import { Joueur } from './Joueur';
import { Carte } from './Carte';
import { Paquet } from './Paquet';
import { Evaluateur } from './Evaluateur';

export class Ronde {
    readonly NOMBRE_JOUEURS = 4;
    readonly NB_CARTES_PAR_JOUEURS = 2;
    readonly NB_CARTES_FLOP = 3;
    paquet:Paquet = new Paquet();
    joueurs:Joueur[] = [];
    flop:Carte[] = [];
    turn:Carte = new Carte();
    river:Carte = new Carte();

    constructor() {
        for (let i = 0; i < this.NOMBRE_JOUEURS; i++) {
            this.joueurs.push(new Joueur());
        }
    }

    distribuerCartes() {
        // On reinitialise les joueurs
        this.joueurs.forEach(joueur => {
            joueur.reinitialiserJoueur();
        });
        // On brasse le paquet
        this.paquet.brasse();

        // On donne les cartes à chaque joueur
        this.joueurs.forEach(joueur => {
            let cartes = [];
            for (let i = 0; i < this.NB_CARTES_PAR_JOUEURS; i++) {
                cartes.push(this.paquet.distribue());
                
            }
            joueur.assignerCarte(cartes);
            console.log(joueur.main);
            
        });

        console.log(this.joueurs[0].main[1]);

        // Flop
        for (let i = 0; i < this.NB_CARTES_FLOP; i++) {
            this.flop.push(this.paquet.distribue());
        }

        this.turn = this.paquet.distribue();
        this.river = this.paquet.distribue();

        // TODO Evaluer et determiner le gagnant

        this.genererHTML();
    }

    evaluerMains() {
        
    }

    determinerGagnant() {

    }

    genererHTML() {
        console.log(this.joueurs[0].main[0].sorte);
        let src = 'assets/images/';
        let joueursDiv = document.getElementsByClassName('joueur');
        for (let i = 0; i < joueursDiv.length; i++) {
            let cartes = joueursDiv[i].querySelector('span');
            cartes!.innerHTML = '';
            for (let c = 0; c < this.NB_CARTES_PAR_JOUEURS; c++) {
                cartes!.innerHTML += `<img class="carte" src="${src + this.joueurs[i].main[c].sorte + '_' + this.joueurs[i].main[c].valeur}.png"/>`;
            }
        }
    }
}