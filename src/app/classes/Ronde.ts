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
        });

        // Flop
        this.flop = [];
        for (let i = 0; i < this.NB_CARTES_FLOP; i++) {
            this.flop.push(this.paquet.distribue());
        }

        this.turn = this.paquet.distribue();
        this.river = this.paquet.distribue();

        this.evaluerMains();
        this.determinerGagnant();
        this.genererHTML();
    }

    evaluerMains() {
        this.joueurs.forEach(j => {
            let cartes = [];
            cartes.push(... j.main);
            cartes.push(... this.flop);
            cartes.push(this.turn);
            cartes.push(this.river);
            let evaluateur = new Evaluateur(cartes);
            j.valeur = evaluateur.getValeur();
            j.valeurEnFrancais = evaluateur.convertirValeurEnFrancais();
        });
    }

    determinerGagnant() {
        let valeurGagnante = this.joueurs[0].valeur;
        let indexJoueurGagnant = 0;

        // Trouver l'index du joueur gagnant
        for (let i = 1; i < this.joueurs.length; i++) {
            if (this.joueurs[i].valeur > valeurGagnante) {
                indexJoueurGagnant = i;
                valeurGagnante = this.joueurs[i].valeur;
            }
        }

        let valeurs = document.getElementsByClassName('valeur-francais');
        for (let i = 0; i < this.joueurs.length; i++) {
            valeurs[i].innerHTML = this.joueurs[i].valeurEnFrancais;
        }

        document.querySelector('.gagnant')!.innerHTML = '';
        document.querySelector('.gagnant')!.innerHTML += `Joueur ${indexJoueurGagnant + 1} est gagnant !`;

        // Todo verifier egalite
        console.log(this.joueurs[0].valeurEnFrancais);
        console.log(this.joueurs[1].valeurEnFrancais);
        console.log(this.joueurs[2].valeurEnFrancais);
        console.log(this.joueurs[3].valeurEnFrancais);
    }

    genererHTML() {
        let src = 'assets/images/';

        // Cartes joueurs
        let joueursDiv = document.getElementsByClassName('joueur');
        for (let i = 0; i < joueursDiv.length; i++) {
            let span = joueursDiv[i].querySelector('span');
            span!.innerHTML = '';
            for (let c = 0; c < this.NB_CARTES_PAR_JOUEURS; c++) {
                span!.innerHTML += `<img class="carte" src="${src + this.joueurs[i].main[c].sorte + '_' + this.joueurs[i].main[c].valeur}.png"/>`;
            }
        }

        // Cartes publiques
        let cartes = this.flop;
        cartes.push(this.turn);
        cartes.push(this.river);
        let tableSpan = document.querySelector('.centre span');
        tableSpan!.innerHTML = '';
        for (let i = 0; i < cartes.length; i++) {
            tableSpan!.innerHTML += `<img class="carte" src="${src + cartes[i].sorte + '_' + cartes[i].valeur}.png"/>`;
        }
    }
}