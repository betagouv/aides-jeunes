package models;

import java.io.IOException;

import org.joda.time.LocalDate;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Ressource {

    public RessourceType type;
    public int montant;
    public RessourcePeriode periode;

    @JsonDeserialize(using=RessourceTypeDeserializer.class)
    public static enum RessourceType {

        REVENUS_SALARIES("revenusSalarie"),
        REVENUS_STAGE("stage"),
        REVENUS_STAGE_FORMATION_PRO("revenusStageFormationPro"),
        ALLOCATIONS_CHOMAGE("allocationsChomage"),
        ALLOCATION_SECURISATION_PRO("allocationSecurisationPro"),
        PRIME_REPRISE_ACTIVITE("primeRepriseActivite"),
        ALLOCATION_LOGEMENT("allocationLogement"),
        RSA("rsa"),
        ASF("asf"),
        ASPA("aspa"),
        ASS("ass"),
        AAH("aah"),
        INDEMNITES_MATERNITE("indJourMaternite"),
        INDEMNITES_MALADIE("indJourMaladie"),
        INDEMNITES_MALADIE_PRO("indJourMaladieProf"),
        INDEMNITES_ACCIDENT_TRAVAIL("indJourAccidentDuTravail"),
        INDEMNITES_CHOMAGE_PARTIEL("indChomagePartiel"),
        INDEMNITES_VOLONTARIAT("indVolontariat"),
        DEDOMMAGEMENT_AMIANTE("dedommagementAmiante"),
        PENSIONS_ALIMENTAIRES("pensionsAlimentaires"),
        PRESTATION_COMPENSATOIRE("prestationCompensatoire"),
        RETRAITES_RENTES("pensionsRetraitesRentes"),
        RETRAITE_COMBATTANT("retraiteCombattant"),
        PENSION_INVALIDITE("pensionsInvalidite"),
        BOURSE_ENSEIGNEMENT_SUP("bourseEnseignementSup"),
        BOURSE_RECHERCHE("bourseRecherche"),
        GAINS_EXCEPTIONNELS("gainsExceptionnels"),
        CA_MICRO_ENTREPRISE("caMicroEntreprise"),
        AUTRES_TNS("autresRevenusTns");

        public final String jsonValue;

        RessourceType(String jsonValue) {
            this.jsonValue = jsonValue;
        }
    }

    public static class RessourceTypeDeserializer extends JsonDeserializer<RessourceType> {

        @Override
        public RessourceType deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (RessourceType type : RessourceType.values()) {
                if (type.jsonValue.equals(jp.getText())) {
                    return type;
                }
            }

            throw new RuntimeException(String.format("Type de ressource inconnu : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using=RessourcePeriodeDeserializer.class)
    public static enum RessourcePeriode {

        MOIS_1(3),
        MOIS_2(2),
        MOIS_3(1),
        ANNEE_MOINS_1,
        ANNEE_MOINS_2;

        public final int minusCurrentMonth;

        RessourcePeriode(int minusCurrentMonth) {
            this.minusCurrentMonth = minusCurrentMonth;
        }

        RessourcePeriode() {
            this.minusCurrentMonth = -1;
        }
    }

    public static class RessourcePeriodeDeserializer extends JsonDeserializer<RessourcePeriode> {

        private static String anneeMoins1 = String.valueOf(LocalDate.now().minusYears(1).getYear());
        private static String anneeMoins2 = String.valueOf(LocalDate.now().minusYears(2).getYear());

        @Override
        public RessourcePeriode deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            String text = jp.getText();
            if (anneeMoins1.equals(text)) {
                return RessourcePeriode.ANNEE_MOINS_1;
            } else if (anneeMoins2.equals(text)) {
                return RessourcePeriode.ANNEE_MOINS_2;
            }

            for (RessourcePeriode periode : RessourcePeriode.values()) {
                if (periode.minusCurrentMonth != -1) {
                    String period = LocalDate
                            .now()
                            .withDayOfMonth(1)
                            .minusMonths(periode.minusCurrentMonth)
                            .toString("YYYY-MM");
                    if (period.equals(text)) {
                        return periode;
                    }
                }
            }

            throw new RuntimeException(String.format("Période invalide : %s", text));
        }
    }
}
