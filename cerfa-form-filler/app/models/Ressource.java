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
        REVENUS_NON_SALARIES("revenusNonSalarie"),
        REVENUS_AUTO_ENTREPRENEUR("revenusAutoEntrepreneur"),
        REVENUS_STAGE("revenusStage"),
        ALLOCATIONS_CHOMAGE("allocationsChomage"),
        ALLOCATION_LOGEMENT("allocationLogement"),
        RSA("rsa"),
        ASPA("aspa"),
        ASS("ass"),
        AAH("aah"),
        PENSION_INVALIDITE("pensionsInvalidite"),
        INDEMNITES_MATERNITE("indJourMaternite"),
        INDEMNITES_MALADIE("indJourMaladie"),
        INDEMNITES_MALADIE_PRO("indJourMaladieProf"),
        INDEMNITES_ACCIDENT_TRAVAIL("indJourAccidentDuTravail"),
        INDEMNITES_CHOMAGE_PARTIEL("indChomagePartiel"),
        PENSIONS_ALIMENTAIRES("pensionsAlimentaires"),
        RETRAITES_RENTES("pensionsRetraitesRentes"),
        BOURSE("bourseEnseignementSup");

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
        MOIS_3(1);

        public final int minusCurrentMonth;

        RessourcePeriode(int minusCurrentMonth) {
            this.minusCurrentMonth = minusCurrentMonth;
        }
    }

    public static class RessourcePeriodeDeserializer extends JsonDeserializer<RessourcePeriode> {

        @Override
        public RessourcePeriode deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (RessourcePeriode periode : RessourcePeriode.values()) {
                String period = LocalDate.now().withDayOfMonth(1).minusMonths(periode.minusCurrentMonth).toString("YYYY-MM");
                if (period.equals(jp.getText())) {
                    return periode;
                }
            }

            throw new RuntimeException(String.format("Période invalide : %s", jp.getText()));
        }
    }
}
