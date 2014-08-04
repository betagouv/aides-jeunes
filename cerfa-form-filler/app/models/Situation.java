package models;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Situation {

    public List<Individu> individus = new ArrayList<>();

    public static class Individu {

        public String firstName;
        public String lastName;
        public String numeroSecu;
        public String dateDeNaissance;
        public Nationalite nationalite = Nationalite.FRANCAISE;
        public IndividuRole role;
        public String address;
        public String postalCode;
        public String city;
        public String email;
        public String phoneNumber;
        public StatutMarital statutMarital;
    }

    @JsonDeserialize(using = IndividuRoleDeserializer.class)
    public static enum IndividuRole {

        DEMANDEUR,
        CONJOINT,
        ENFANT,
        PERSONNE_A_CHARGE
    }

    public static class IndividuRoleDeserializer extends JsonDeserializer<IndividuRole> {

        @Override
        public IndividuRole deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            return IndividuRole.DEMANDEUR;
        }
    }

    @JsonDeserialize(using = NationaliteDeserializer.class)
    public static enum Nationalite {

        FRANCAISE("française", "FRA"),
        EEE_UE_SUISSE("UE_EEE_Suisse", "EEE"),
        AUTRE("autre", "AUT");

        public final String radioValue;
        public final String stringValue;

        Nationalite(String radioValue, String stringValue) {
            this.radioValue = radioValue;
            this.stringValue = stringValue;
        }
    }

    public static class NationaliteDeserializer extends JsonDeserializer<Nationalite> {

        @Override
        public Nationalite deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            return Nationalite.FRANCAISE;
        }
    }

    public static enum StatutMarital {

        MARIAGE("marié"),
        PACS("pacsé"),
        RELATION_LIBRE("vie maritale"),
        SEUL("seul");

        public final String formValue;

        StatutMarital(String formValue) {
            this.formValue = formValue;
        }
    }
}
