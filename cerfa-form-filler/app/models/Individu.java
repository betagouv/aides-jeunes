package models;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Individu {

    public Civilite civilite;
    public String firstName;
    public String lastName;
    public String nomUsage;
    public String nir;
    public String dateDeNaissance;
    public String paysNaissance;
    public String villeNaissance;
    public Integer departementNaissance;
    public Nationalite nationalite;
    public IndividuRole role;
    public String email;
    public String phoneNumber;
    public StatutMarital statusMarital;
    public boolean demandeurEmploi;
    public boolean etudiant;
    public boolean retraite;
    public boolean enceinte;

    @JsonDeserialize(using = CiviliteDeserializer.class)
    public static enum Civilite {

        HOMME("h"),
        FEMME("f");

        public final String value;

        Civilite(String value) {
            this.value = value;
        }
    }

    public static class CiviliteDeserializer extends JsonDeserializer<Civilite> {

        @Override
        public Civilite deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (Civilite civilite : Civilite.values()) {
                if (civilite.value.equals(jp.getText())) {
                    return civilite;
                }
            }

            throw new RuntimeException(String.format("Civilité inconnue : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using = IndividuRoleDeserializer.class)
    public static enum IndividuRole {

        DEMANDEUR("demandeur"),
        CONJOINT("conjoint"),
        ENFANT("enfant"),
        PERSONNE_A_CHARGE("personneACharge");

        public final String value;

        IndividuRole(String value) {
            this.value = value;
        }
    }

    public static class IndividuRoleDeserializer extends JsonDeserializer<IndividuRole> {

        @Override
        public IndividuRole deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (IndividuRole role : IndividuRole.values()) {
                if (role.value.equals(jp.getText())) {
                    return role;
                }
            }

            throw new RuntimeException(String.format("Individu de role inconnu : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using = NationaliteDeserializer.class)
    public static enum Nationalite {

        FRANCAISE("fr", "française", "FRA"),
        EEE_UE_SUISSE("ue", "UE_EEE_Suisse", "EEE"),
        AUTRE("autre", "autre", "AUT");

        public final String jsonValue;
        public final String formRadioValue;
        public final String formStringValue;

        Nationalite(String jsonValue, String formRadioValue, String formStringValue) {
            this.jsonValue = jsonValue;
            this.formRadioValue = formRadioValue;
            this.formStringValue = formStringValue;
        }
    }

    public static class NationaliteDeserializer extends JsonDeserializer<Nationalite> {

        @Override
        public Nationalite deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (Nationalite nationalite : Nationalite.values()) {
                if (nationalite.jsonValue.equals(jp.getText())) {
                    return nationalite;
                }
            }

            throw new RuntimeException(String.format("Nationalité inconnue : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using = StatutMaritalDeserializer.class)
    public static enum StatutMarital {

        MARIAGE("mariage", "marié"),
        PACS("pacs", "pacsé"),
        RELATION_LIBRE("relation_libre", "vie maritale"),
        SEUL("celibat", "célibataire");

        public final String jsonValue;
        public final String formValue;

        StatutMarital(String jsonValue, String formValue) {
            this.jsonValue = jsonValue;
            this.formValue = formValue;
        }
    }

    public static class StatutMaritalDeserializer extends JsonDeserializer<StatutMarital> {

        @Override
        public StatutMarital deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (StatutMarital statut : StatutMarital.values()) {
                if (statut.jsonValue.equals(jp.getText())) {
                    return statut;
                }
            }

            throw new RuntimeException(String.format("Statut marital inconnu : %s", jp.getText()));
        }
    }
}
