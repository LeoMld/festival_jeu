import { jsPDF } from "jspdf";

function createHeaders(keys) {
    let result = [];
    for (var i = 0; i < keys.length; i += 1) {
        result.push({
            id: keys[i],
            name: keys[i],
            prompt: keys[i],
            width: 65,
            align: "center",
            padding: 0
        });
    }
    return result;
}



const pdf = {
    createPDF : (r) =>{
        console.log(r)

        let result=[]
        /*let data = {
            idEspace: r.FK_idEspace.toString(),
            idEmplacement: r.idEmplacement.toString(),
            nb_Tables: r.nombreTables.toString(),
            metre_Carres: r.metreCarres.toString(),
            PrixU_Table: r.coutTable.toString(),
            PrixU_M2: r.coutMetreCarre.toString(),
            Prix_Total_HT: r.prixReservation.toString(),

        };*/
        console.log(r)
        r.espace.map(res =>{
            console.log(res)
            let data = {
                idEspace: res.idEspace.toString(),
                idEmplacement: res.FK_idEmplacement.toString(),
                nb_Tables: res.nombreTables.toString(),
                metre_Carres: res.metreCarres.toString(),
                PrixU_Table: res.coutTable.toString(),
                PrixU_M2: res.coutMetreCarre.toString(),
                Prix_Total_HT: (res.coutTable*res.nombreTables+res.metreCarres*res.coutMetreCarre).toString()

            };
            result.push(Object.assign({}, data))
        })


        /*result.push(Object.assign({}, data))*/
        console.log(result)
        let headers = createHeaders([
            "idEspace",
            "idEmplacement",
            "nb_Tables",
            "metre_Carres",
            "PrixU_Table",
            "PrixU_M2",
            "Prix_Total_HT",
        ]);

        let doc = new jsPDF('p','pt');
        doc.setFont("Helvetica")
        doc.setFontSize(40);
        doc.text("Facture", 50, 35);
        doc.setFontSize(13)
        doc.text("Festival du jeu", 50, 80);
        doc.text("Polytech Montpellier", 50, 100);
        doc.setFont("Helvetica","bold");
        doc.text("Référence id :"+r.idReservation.toString(), 50, 150);
        doc.setFont("Helvetica","normal");
        doc.text(r.nomPersonne.toString(), 400, 180);
        doc.text(r.adressePersonne.toString(), 400, 200);
        doc.table(40, 300, result, headers, { autoSize: true });
        doc.text("Prix renvoi jeux HT: "+(r.prixRenvoiTotal).toString()+" €", 400, 440);
        doc.text("Prix total HT: "+(r.prixReservation+r.prixRenvoiTotal).toString()+" €", 400, 460);
        doc.text("TVA : 20%", 400, 480);
        doc.setFont("Helvetica","bold")
        doc.text("Prix total TTC: "+(r.prixReservation*1.2).toString()+" €", 400, 500);
        doc.setFont("Helvetica")
        doc.text("En votre aimable règlement,", 50, 600);
        doc.text("Cordialement,", 50, 620);
        doc.setFontSize(8)
        doc.setFont("Helvetica","italic")
        doc.text("Polytech Montpellier", 260, 800);
        doc.text("Mollard Léo, Raymond Luc, Barbou Bryan", 220, 820);

        doc.save("test.pdf")
    }


}

export default pdf
