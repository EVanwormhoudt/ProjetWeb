class Player{
    constructor(name){
        this.name=name;
        this.color=undefined;
        // Tableau des pions du joueur
        this.tableOfPawns = [
            {name:"Bombes",nombreRestant:"6",force:"100"},
            {name:"Maréchal",nombreRestant:"1",force:"10"},
            {name:"Général",nombreRestant:"1",force:"9"},
            {name:"Colonels",nombreRestant:"2",force:"8"},
            {name:"Commandants",nombreRestant:"3",force:"7"},
            {name:"Capitaines",nombreRestant:"4",force:"6"},
            {name:"Lieutenants",nombreRestant:"4",force:"5"},
            {name:"Sergents",nombreRestant:"4",force:"4"},
            {name:"Démineurs",nombreRestant:"5",force:"3"},
            {name:"Eclaireurs",nombreRestant:"8",force:"2"},
            {name:"Espion",nombreRestant:"1",force:"1"},
            {name:"Drapeau",nombreRestant:"1",force:"0"},

        ];
    }
    //fonctions de retours
    getName(){
        return this.name;
    }
    tableOfPawnsView(){
        return this.tableOfPawns;
    }
    indiceDuType(type){
        for(const indice in this.tableOfPawns){
            if(this.tableOfPawns[indice].name==type){
                return indice;
            }
        }
    }
    nombreRestantDuType(type){
        for(const element of this.tableOfPawns){
            if(element.name==type){
                return element.nombreRestant;
            }
        }
    }
    typeDeLaPiece(indice){
        return this.tableOfPawns[indice].name;
    }
    nombreRestantIndice(indice){
        return this.tableOfPawns[indice].nombreRestant;
    }
    forceDuType(type){
        for(const element of this.tableOfPawns){
            if(element.name==type){
                return element.force;
            }
        }
    }
    decrNombreRestantDuType(type){
        for(let element of this.tableOfPawns){
            if(element.force==type){
                element.nombreRestant--;
                return this.tableOfPawns;

            }
        }
    }
    //remplir le tableau des pièces d'un joueur, afin de pouvoir compter combien il en reste
    Remplirtab(){
        this.tableOfPawns = [
            {name:"Bombes",nombreRestant:6,force:"100"},
            {name:"Maréchal",nombreRestant:1,force:"10"},
            {name:"Général",nombreRestant:1,force:"9"},
            {name:"Colonels",nombreRestant:2,force:"8"},
            {name:"Commandants",nombreRestant:3,force:"7"},
            {name:"Capitaines",nombreRestant:4,force:"6"},
            {name:"Lieutenants",nombreRestant:4,force:"5"},
            {name:"Sergents",nombreRestant:4,force:"4"},
            {name:"Démineurs",nombreRestant:5,force:"3"},
            {name:"Eclaireurs",nombreRestant:8,force:"2"},
            {name:"Espion",nombreRestant:1,force:"1"},
            {name:"Drapeau",nombreRestant:1,force:"0"},

        ];
    }
}
module.exports = Player;