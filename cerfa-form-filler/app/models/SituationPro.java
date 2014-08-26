package models;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class SituationPro {

    public SituationProType situation;
    public String since;
    public Boolean volontairementSansActivite;
    public SalarieContractType contractType;
    public Boolean isRemunere;
    public String gerantSalarieAffiliation;
    public Boolean isIndemnise;
    public String indemniseSince;

    @JsonDeserialize(using = SituationProTypeDeserializer.class)
    public static enum SituationProType {

        SANS_ACTIVITE("sans_activite"),
        SALARIE("salarie"),
        AUTO_ENTREPRENEUR("auto_entrepreneur"),
        TRAVAILLEUR_SAISONNIER("travailleur_saisonnier"),
        APPRENTI("apprenti"),
        STAGIAIRE("stagiaire"),
        INDEPENDANT("independant"),
        GERANT_SALARIE("gerant_salarie"),
        DEMANDEUR_EMPLOI("demandeur_emploi"),
        ETUDIANT("etudiant"),
        RETRAITE("retraite");

        public final String jsonValue;

        SituationProType(String jsonValue) {
            this.jsonValue = jsonValue;
        }
    }

    public static class SituationProTypeDeserializer extends JsonDeserializer<SituationProType> {

        @Override
        public SituationProType deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (SituationProType situationPro : SituationProType.values()) {
                if (situationPro.jsonValue.equals(jp.getText())) {
                    return situationPro;
                }
            }

            throw new RuntimeException(String.format("Situation professionnelle inconnue : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using = SalarieContractTypeDeserializer.class)
    public static enum SalarieContractType {

        CDI("cdi"),
        CDD("cdd"),
        INTERIM("interim");

        public final String jsonValue;

        SalarieContractType(String jsonValue) {
            this.jsonValue = jsonValue;
        }
    }

    public static class SalarieContractTypeDeserializer extends JsonDeserializer<SalarieContractType> {

        @Override
        public SalarieContractType deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (SalarieContractType contract : SalarieContractType.values()) {
                if (contract.jsonValue.equals(jp.getText())) {
                    return contract;
                }
            }

            throw new RuntimeException(String.format("Type de contrat salarié inconnu : %s", jp.getText()));
        }
    }
}
