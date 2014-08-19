package formfiller;

import models.Individu;
import models.Individu.IndividuRole;

import org.joda.time.LocalDate;

public class ASFFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",       0, 100, 290},
        {"demandeur.prenom",    0, 402, 290},
        {"demandeur.nom_usage", 0,  95, 267},

        {"enfant.1.nom",    0,  45, 143},
        {"enfant.1.prenom", 0, 240, 143},
        {"enfant.2.nom",    0,  45, 133},
        {"enfant.2.prenom", 0, 240, 133},
        {"enfant.3.nom",    0,  45, 123},
        {"enfant.3.prenom", 0, 240, 123},
        {"enfant.4.nom",    0,  45, 113},
        {"enfant.4.prenom", 0, 240, 113},

        {"current_date", 2, 310, 385},
    };

    private static final Object[][] numberFields = {
        {"demandeur.date_naissance", 0, 113, 247,  8},
        {"demandeur.nir",            0, 149, 214, 13, 14.8f},
        {"demandeur.nir2",           0, 344, 214,  2, 14.8f},

        {"enfant.1.date_naissance", 0, 430, 144, 8, 15.8f},
        {"enfant.2.date_naissance", 0, 430, 134, 8, 15.8f},
        {"enfant.3.date_naissance", 0, 430, 124, 8, 15.8f},
        {"enfant.4.date_naissance", 0, 430, 114, 8, 15.8f},
    };

    private int currentEnfant = 1;

    @Override
    public Object[][] getCheckboxes() {
        return checkboxes;
    }

    @Override
    public Object[][] getTextFields() {
        return textFields;
    }

    @Override
    public Object[][] getNumberFields() {
        return numberFields;
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.ENFANT == individu.role) {
                fillEnfant(individu);
            }
        }

        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        appendText("demandeur.nom", demandeur.lastName);
        appendText("demandeur.prenom", demandeur.firstName);
        appendText("demandeur.nom_usage", demandeur.nomUsage);
        appendNumber("demandeur.date_naissance", demandeur.dateDeNaissance.replaceAll("/", ""));
        if (null != demandeur.nir) {
            appendNumber("demandeur.nir", demandeur.nir.substring(0, 13));
            appendNumber("demandeur.nir2", demandeur.nir.substring(13, 15));
        }
    }

    private void fillEnfant(Individu enfant) {
        appendText(String.format("enfant.%d.nom", currentEnfant), enfant.lastName);
        appendText(String.format("enfant.%d.prenom", currentEnfant), enfant.firstName);
        appendNumber(String.format("enfant.%d.date_naissance", currentEnfant), enfant.dateDeNaissance);
        currentEnfant++;
    }

    private void fillCurrentDate() {
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        appendText("current_date", currentDate);
    }
}
