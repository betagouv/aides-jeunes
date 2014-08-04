package formfiller;

import java.util.Calendar;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;

import org.apache.pdfbox.pdmodel.PDDocument;

public class CmuFormFiller extends FormFiller {

    private final Situation situation;
    private int currentChildIndex = 1;

    public CmuFormFiller(PDDocument document, Situation situation) {
        super(document);
        this.situation = situation;
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (individu.role == IndividuRole.DEMANDEUR) {
                fillDemandeur(individu);
            } else if (individu.role == IndividuRole.CONJOINT) {
                fillConjoint(individu);
            } else if (individu.role == IndividuRole.ENFANT) {
                fillEnfant(individu);
            }
        }
        Calendar calendar = Calendar.getInstance();
        fillDateField("date demande", String.format("%02d%02d%d", calendar.get(Calendar.DAY_OF_MONTH), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.YEAR)));
    }

    private void fillDemandeur(Individu demandeur) {
        fillTextField("nom prénom demandeur", String.format("%s %s", demandeur.firstName, demandeur.lastName));
        if (null != demandeur.numeroSecu) {
            fillTextField("n° sécu demandeur", demandeur.numeroSecu.substring(0, 13));
            fillTextField("clé n° sécu demandeur", demandeur.numeroSecu.substring(13, 15));
        }
        fillDateField("date naissance demandeur", demandeur.dateDeNaissance);
        fillRadioField("nationalité", demandeur.nationalite.radioValue);
        fillOptionalTextField("adresse demandeur", demandeur.address);
        fillOptionalTextField("code postal demandeur", demandeur.postalCode);
        fillOptionalTextField("commune demandeur", demandeur.city);
        fillOptionalTextField("email demandeur", demandeur.email);
        fillOptionalTextField("téléphone demandeur", demandeur.phoneNumber);
        fillTextField("Nom", demandeur.lastName);
        fillTextField("prénom", demandeur.firstName);
    }

    private void fillConjoint(Individu conjoint) {
        fillTextField("nom prénom conjoint", String.format("%s %s", conjoint.firstName, conjoint.lastName));
        if (null != conjoint.numeroSecu) {
            fillTextField("n° sécu conjoint", conjoint.numeroSecu.substring(0, 13));
            fillTextField("clé n° sécu conjoint", conjoint.numeroSecu.substring(13, 15));
        }
        fillDateField("date naissance conjoint", conjoint.dateDeNaissance);
        fillRadioField("nationalité conjoint", conjoint.nationalite.radioValue);
        fillRadioField("situation famille", conjoint.statutMarital.formValue);
        fillTextField("Nom2", conjoint.lastName);
        fillTextField("prénom2", conjoint.firstName);
    }

    private void fillEnfant(Individu enfant) {
        fillTextField("personne à charge" + currentChildIndex, String.format("%s %s", enfant.firstName, enfant.lastName));
        fillTextField("nationalité personne à charge" + currentChildIndex, enfant.nationalite.stringValue);
        fillDateField("date naissance personne à charge" + currentChildIndex, enfant.dateDeNaissance);
        fillTextField("Nom"+(currentChildIndex + 2), enfant.lastName);
        fillTextField("prénom"+(currentChildIndex + 2), enfant.firstName);
        currentChildIndex++;
    }
}
