module.exports = {

    // Check if all the fields to create a festival are good
    // Return an object describing where the errors are, if any
    checkFestivalInput: (nameFestival, emplacements) => {
        // O the field is ok
        // 1 there is an error
        let error = {
            generalStatus: 0,
            nameFestivalErr: 0,
            emplacementsErr: []
        }
        // We check the name of the festival
        if (nameFestival.length <= 2 || nameFestival.length >= 50) {
            error.nameFestivalErr = 1
            error.generalStatus = 1
        }
        // Now we check for each emplacement
        let emplacement
        for (let i = 0; i < emplacements.length; i++) {
            let newRow = {
                libelleEmplacementErr: 0,
                coutTableErr: 0,
                coutMetreCarreErr: 0,
                nombreTablesPrevuesErr: 0,
            }
            error.emplacementsErr.push(newRow)
            emplacement = emplacements[i]
            // We check the name of the emplacement
            if (emplacement.libelleEmplacement.length <= 2 || emplacement.libelleEmplacement.length >= 20) {
                error.emplacementsErr[i].libelleEmplacementErr = 1
                error.generalStatus = 1
            }
            // We check if the rest are numbers
            if (isNaN(parseFloat(emplacement.coutTable))) {
                error.emplacementsErr[i].coutTableErr = 1
                error.generalStatus = 1
            }
            if (isNaN(parseFloat(emplacement.coutMetreCarre))) {
                error.emplacementsErr[i].coutMetreCarreErr = 1
                error.generalStatus = 1
            }
            if (isNaN(parseInt(emplacement.nombreTablesPrevues))) {
                error.emplacementsErr[i].nombreTablesPrevuesErr = 1
                error.generalStatus = 1
            }
        }
        return error
    }
}