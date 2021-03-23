const workflow = (val)=>{
    switch (val){
        case 0:
            return "Pas Contacté"
        case 1:
            return "Contacté"
        case 2:
            return "Second Contact"
        case 3:
            return "Pas de Réponse"
        case 4:
            return "1. En discussion"
        case 5:
            return "2. Présence Confirmée"
        case 6:
            return "3. Présent liste jeux demandée"
        case 7:
            return "4. Présent : liste jeux reçue"
        case 8:
            return "Absent"
        case 9:
            return "Considéré absent"

    }
}
export default workflow
