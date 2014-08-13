package formfiller;

import models.Individu;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Logement;

import org.joda.time.LocalDate;

public class CmuFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
        {"demandeur_francais", 4, 150, 543},
        {"demandeur_ue",       4, 392, 543},
        {"demandeur_non_ue",   4, 444, 543},
    };

    private int currentChildIndex = 1;

    @Override
    public Object[][] getCheckboxes() {
        return checkboxes;
    }

    @Override
    public void fill() {
        writer.initAcroForm();
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
        writer.fillOptionalTextField("email demandeur", situation.email);
        writer.fillOptionalTextField("téléphone demandeur", situation.phoneNumber);
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        writer.fillDateField("date demande", currentDate);
    }

    private void fillDemandeur(Individu demandeur) {
        String nomPrenom = null;
        if (null != demandeur.firstName && null != demandeur.lastName) {
            nomPrenom = String.format("%s %s", demandeur.lastName, demandeur.firstName);
            if (null != demandeur.nomUsage) {
                nomPrenom = String.format("%s (nom d'usage %s)", nomPrenom, demandeur.nomUsage);
            }
        }
        writer.fillOptionalTextField("nom prénom demandeur", nomPrenom);
        if (null != demandeur.nir) {
            writer.fillTextField("n° sécu demandeur", demandeur.nir.substring(0, 13));
            writer.fillTextField("clé n° sécu demandeur", demandeur.nir.substring(13, 15));
        }
        writer.fillDateField("date naissance demandeur", demandeur.dateDeNaissance);

        if (Nationalite.FRANCAISE == demandeur.nationalite) {
            checkbox("demandeur_francais");
        } else if (Nationalite.EEE_UE_SUISSE == demandeur.nationalite) {
            checkbox("demandeur_ue");
        } else if (Nationalite.AUTRE == demandeur.nationalite) {
            checkbox("demandeur_non_ue");
        }

        writer.fillOptionalTextField("email demandeur", demandeur.email);
        writer.fillOptionalTextField("téléphone demandeur", demandeur.phoneNumber);
        writer.fillOptionalTextField("Nom", demandeur.lastName);
        writer.fillOptionalTextField("prénom", demandeur.firstName);
        if (null != demandeur.statusMarital) {
            writer.fillRadioField("situation famille", demandeur.statusMarital.formValue);
        }
    }

    private void fillConjoint(Individu conjoint) {
        String nomPrenom = null;
        if (null != conjoint.firstName && null != conjoint.lastName) {
            nomPrenom = String.format("%s %s", conjoint.lastName, conjoint.firstName);
            if (null != conjoint.nomUsage) {
                nomPrenom = String.format("%s (nom d'usage %s)", nomPrenom, conjoint.nomUsage);
            }
        }
        writer.fillOptionalTextField("nom prénom conjoint", nomPrenom);
        if (null != conjoint.nir) {
            writer.fillTextField("n° sécu conjoint", conjoint.nir.substring(0, 13));
            writer.fillTextField("clé n° sécu conjoint", conjoint.nir.substring(13, 15));
        }
        writer.fillDateField("date naissance conjoint", conjoint.dateDeNaissance);
        writer.fillRadioField("nationalité conjoint", conjoint.nationalite.formRadioValue);
        writer.fillOptionalTextField("Nom2", conjoint.lastName);
        writer.fillOptionalTextField("prénom2", conjoint.firstName);
    }

    private void fillEnfant(Individu enfant) {
        String nomPrenom = null;
        if (null != enfant.firstName && null != enfant.lastName) {
            nomPrenom = String.format("%s %s", enfant.lastName, enfant.firstName);
        }
        writer.fillOptionalTextField("personne à charge" + currentChildIndex, nomPrenom);
        writer.fillTextField("nationalité personne à charge" + currentChildIndex, enfant.nationalite.formStringValue);
        writer.fillDateField("date naissance personne à charge" + currentChildIndex, enfant.dateDeNaissance);
        if (null != enfant.nir) {
            writer.fillTextField("n° sécu personne à charge" + currentChildIndex, enfant.nir.substring(0, 13));
            writer.fillTextField("clé n° sécu personne à charge" + currentChildIndex, enfant.nir.substring(13, 15));
        }
        currentChildIndex++;
    }

    private void fillLogement(Logement logement) {
        writer.fillOptionalTextField("adresse demandeur", logement.adresse);
        writer.fillOptionalTextField("code postal demandeur", logement.codePostal);
        writer.fillOptionalTextField("commune demandeur", logement.ville);
    }
}
