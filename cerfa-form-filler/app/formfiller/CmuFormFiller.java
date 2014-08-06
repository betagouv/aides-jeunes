package formfiller;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Logement;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.joda.time.LocalDate;

public class CmuFormFiller extends FormFiller {

    private int currentChildIndex = 1;

    public CmuFormFiller(PDDocument document, Situation situation) {
        super(document, situation);
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
        fillLogement(situation.logement);
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        fillDateField("date demande", currentDate);
    }

    private void fillDemandeur(Individu demandeur) {
        String nomPrenom = null;
        if (null != demandeur.firstName && null != demandeur.lastName) {
            nomPrenom = String.format("%s %s", demandeur.firstName, demandeur.lastName);
        }
        fillOptionalTextField("nom prénom demandeur", nomPrenom);
        if (null != demandeur.numeroSecu) {
            fillTextField("n° sécu demandeur", demandeur.numeroSecu.substring(0, 13));
            fillTextField("clé n° sécu demandeur", demandeur.numeroSecu.substring(13, 15));
        }
        fillDateField("date naissance demandeur", demandeur.dateDeNaissance);
        fillRadioField("nationalité", demandeur.nationalite.formRadioValue);
        fillOptionalTextField("email demandeur", demandeur.email);
        fillOptionalTextField("téléphone demandeur", demandeur.phoneNumber);
        fillOptionalTextField("Nom", demandeur.lastName);
        fillOptionalTextField("prénom", demandeur.firstName);
        fillRadioField("situation famille", demandeur.statusMarital.formValue);
    }

    private void fillConjoint(Individu conjoint) {
        String nomPrenom = null;
        if (null != conjoint.firstName && null != conjoint.lastName) {
            nomPrenom = String.format("%s %s", conjoint.firstName, conjoint.lastName);
        }
        fillOptionalTextField("nom prénom conjoint", nomPrenom);
        if (null != conjoint.numeroSecu) {
            fillTextField("n° sécu conjoint", conjoint.numeroSecu.substring(0, 13));
            fillTextField("clé n° sécu conjoint", conjoint.numeroSecu.substring(13, 15));
        }
        fillDateField("date naissance conjoint", conjoint.dateDeNaissance);
        fillRadioField("nationalité conjoint", conjoint.nationalite.formRadioValue);
        fillOptionalTextField("Nom2", conjoint.lastName);
        fillOptionalTextField("prénom2", conjoint.firstName);
    }

    private void fillEnfant(Individu enfant) {
        String nomPrenom = null;
        if (null != enfant.firstName) {
            nomPrenom = enfant.firstName;
            if (null != enfant.lastName) {
                nomPrenom = nomPrenom.concat(" ").concat(enfant.lastName);
            }
        }
        fillOptionalTextField("personne à charge" + currentChildIndex, nomPrenom);
        fillTextField("nationalité personne à charge" + currentChildIndex, enfant.nationalite.formStringValue);
        fillDateField("date naissance personne à charge" + currentChildIndex, enfant.dateDeNaissance);
        currentChildIndex++;
    }

    private void fillLogement(Logement logement) {
        fillOptionalTextField("adresse demandeur", logement.adresse);
        fillOptionalTextField("code postal demandeur", logement.codePostal);
        fillOptionalTextField("commune demandeur", logement.ville);
    }
}
