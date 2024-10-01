let J1 = ["case1-J1", "case2-J1", "case3-J1", "case4-J1", "case5-J1", "case6-J1", "case7-J1", "case8-J1", "case9-J1"];
let J2 = ["case1-J2", "case2-J2", "case3-J2", "case4-J2", "case5-J2", "case6-J2", "case7-J2", "case8-J2", "case9-J2"];
let Tour = true; // True pour J1, False pour J2

// Initialise les cases à zéro
for (let k = 0; k < 9; k++) {
    document.getElementById(J1[k]).value = 0;
    document.getElementById(J2[k]).value = 0;
}

// Fonction qui lance le dé au début et après chaque tour
function Lancer() {
    document.getElementById("ResDe").innerText = Math.floor(Math.random() * 6) + 1;
}

// Vérifie si toutes les cases sont pleines
function CompteZero() {
    let Fini1 = true;
    let Fini2 = true;
    for (let k = 0; k < 9; k++) {
        if (document.getElementById(J1[k]).value == 0) {
            Fini1 = false;
        }
        if (document.getElementById(J2[k]).value == 0) {
            Fini2 = false;
        }
    }
    return (Fini1 || Fini2);
}

function SupprimeDesAdverses(n, valeur) {
    let colonne = n % 3;
    let listeAdverse = Tour ? J2 : J1; // On prend l'adversaire

    // Supprimer les dés adverses dans la colonne
    for (let i = colonne + 6; i >= colonne; i -= 3) {
        if (parseInt(document.getElementById(listeAdverse[i]).value) == valeur) {
            document.getElementById(listeAdverse[i]).value = 0;
            document.getElementById(listeAdverse[i]).innerText = "";
        }
    }

    // Faire tomber les dés restants dans la colonne
    for (let i = colonne + 6; i >= colonne; i -= 3) {
        // Déplacer les dés restants vers le bas
        while (i > colonne && document.getElementById(listeAdverse[i]).value == 0) {
            let above = i - 3;
            if (above >= 0 && document.getElementById(listeAdverse[above]).value != 0) {
                // Faire tomber le dé
                document.getElementById(listeAdverse[i]).value = document.getElementById(listeAdverse[above]).value;
                document.getElementById(listeAdverse[i]).innerText = document.getElementById(listeAdverse[above]).innerText;

                // Vider la case du dessus
                document.getElementById(listeAdverse[above]).value = 0;
                document.getElementById(listeAdverse[above]).innerText = "";
            } else {
                break; // Arrêter si aucune case au-dessus n'est remplie ou si déjà vide
            }
        }
    }

    // Après la première chute, faire une autre chute pour réorganiser les dés
    for (let i = colonne + 6; i >= colonne; i -= 3) {
        // Réorganiser les dés après la première chute
        while (i > colonne && document.getElementById(listeAdverse[i]).value == 0) {
            let above = i - 3;
            if (above >= 0 && document.getElementById(listeAdverse[above]).value != 0) {
                // Faire tomber le dé
                document.getElementById(listeAdverse[i]).value = document.getElementById(listeAdverse[above]).value;
                document.getElementById(listeAdverse[i]).innerText = document.getElementById(listeAdverse[above]).innerText;

                // Vider la case du dessus
                document.getElementById(listeAdverse[above]).value = 0;
                document.getElementById(listeAdverse[above]).innerText = "";
            } else {
                break; // Arrêter si aucune case au-dessus n'est remplie ou si déjà vide
            }
        }
    }
}
function EnleverOnClickDeTousLesP() {
    // Sélectionne tous les éléments <p>
    const tousLesP = document.querySelectorAll('p');

    // Parcourt chaque élément et enlève l'événement onclick
    tousLesP.forEach(p => {
        p.onclick = null; // Ou utiliser p.removeEventListener si l'événement a été ajouté avec addEventListener
    });
}

// Effectue le coup de J1 ou J2
function Coup(n, joueur) {
    if (joueur == Tour) {

        let coup = -1;
        let listeCases = Tour ? J1 : J2;

        // Détermine où placer le dé dans la colonne
        if (n % 3 == 0) {
            if (document.getElementById(listeCases[6]).value == 0) coup = 6;
            else if (document.getElementById(listeCases[3]).value == 0) coup = 3;
            else if (document.getElementById(listeCases[0]).value == 0) coup = 0;
        } else if (n % 3 == 1) {
            if (document.getElementById(listeCases[7]).value == 0) coup = 7;
            else if (document.getElementById(listeCases[4]).value == 0) coup = 4;
            else if (document.getElementById(listeCases[1]).value == 0) coup = 1;
        } else {
            if (document.getElementById(listeCases[8]).value == 0) coup = 8;
            else if (document.getElementById(listeCases[5]).value == 0) coup = 5;
            else if (document.getElementById(listeCases[2]).value == 0) coup = 2;
        }

        // Si on a trouvé une case, on place le dé et on supprime les dés adverses
        if (coup != -1) {
            let valeurDe = document.getElementById("ResDe").innerText;
            document.getElementById(listeCases[coup]).value = valeurDe;
            document.getElementById(listeCases[coup]).innerText = valeurDe;

            // Supprimer les dés adverses si le même nombre est trouvé dans la colonne
            SupprimeDesAdverses(coup, valeurDe);

            // Changer de joueur
            Tour = !Tour;

            // Lancer un nouveau dé
            Lancer();

            // Vérifier la fin du jeu après le coup
            if (CompteZero()) {
                // Enlever les événements onclick des <p> car la partie est terminée
                EnleverOnClickDeTousLesP();
                if(ComptePoints(J1)>ComptePoints(J2)){
                    alert("La partie est terminée ! Joueur 1 gagne !!");
                }else{
                    alert("La partie est terminée ! Joueur 2 gagne !!");
                }
            }
            let pointsJ1 = ComptePoints(J1);
            let pointsJ2 = ComptePoints(J2);
            document.getElementById("Score").innerText = pointsJ1 + " - " + pointsJ2;
        }
    }
}

// Compte les points d'un joueur
function ComptePoints(listeCases) {
    let total = 0;

    // Parcours des colonnes (indices 0, 3, 6 / 1, 4, 7 / 2, 5, 8)
    for (let colonne = 0; colonne < 3; colonne++) {
        let des = [
            parseInt(document.getElementById(listeCases[colonne]).value) || 0,
            parseInt(document.getElementById(listeCases[colonne + 3]).value) || 0,
            parseInt(document.getElementById(listeCases[colonne + 6]).value) || 0
        ];

        des.sort();  // Tri des dés pour simplifier les conditions

        if (des[0] == des[1] && des[1] == des[2]) {
            // Les 3 dés sont identiques : multiplier par 8
            total += des[0] * 12;
        } else if (des[0] == des[1] || des[1] == des[2]) {
            // Il y a un double : multiplier le double par 4 et ajouter le dé non identique
            if (des[0] == des[1]) {
                total += des[0] * 4 + des[2];  // Le double est des[0] et des[1], donc on ajoute des[2]
            } else {
                total += des[1] * 4 + des[0];  // Le double est des[1] et des[2], donc on ajoute des[0]
            }
        } else {
            // Pas de double : somme des dés
            total += des[0] + des[1] + des[2];
        }
    }

    return total;
}

// Lancer le premier dé au début de la partie
Lancer();