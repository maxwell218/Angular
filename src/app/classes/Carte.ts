export class Carte {
    readonly sorteEnMot:String[] = ["pique", "trèfle", "carreau", "coeur"];
    sorte:Number;
    valeur:Number;

    constructor(sorte:Number, valeur:Number) {
        this.sorte = sorte;
        this.valeur = valeur;
    }
}