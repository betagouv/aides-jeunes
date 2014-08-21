package models;

import java.io.IOException;
import java.util.List;

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
    public LienParente lienParente;
    public String nir;
    public String dateDeNaissance;
    public String paysNaissance;
    public String villeNaissance;
    public Integer departementNaissance;
    public Nationalite nationalite;
    public String dateArriveeFoyer;
    public IndividuRole role;
    public StatutMarital statusMarital;
    public String dateSituationFamiliale;
    public SituationEnfant situation;
    public boolean demandeurEmploi;
    public boolean etudiant;
    public boolean retraite;
    public boolean enceinte;
    public Boolean inscritCaf;
    public String numeroAllocataire;
    public List<SituationPro> situationsPro;

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

        MARIAGE("mariage", false),
        PACS("pacs", false),
        RELATION_LIBRE("relation_libre", false),
        CELIBATAIRE("celibataire"),
        VEUF("veuf"),
        SEPARE("separe"),
        DIVORCE("divorce"),
        CONCUBINAGE_ROMPU("concubinage_rompu"),
        PACS_ROMPU("pacs_rompu");

        public final String jsonValue;
        public final boolean isAlone;

        StatutMarital(String jsonValue, boolean isAlone) {
            this.jsonValue = jsonValue;
            this.isAlone = isAlone;
        }

        StatutMarital(String jsonValue) {
            this(jsonValue, true);
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

    @JsonDeserialize(using = SituationEnfantDeserializer.class)
    public static enum SituationEnfant {

        SCOLARISE("scolarise", "scolarisé"),
        APPRENTI("apprenti", "apprenti"),
        SALARIE("salarie", "salarié"),
        FORMATION_PRO("formation_pro", "en formation professionnelle"),
        DEMANDEUR_EMPLOI("demandeur_emploi", "demandeur d'emploi"),
        CHOMAGE_INDEMNISE("chomage_indemnise", "en chômage indemnisé"),
        SANS_ACTIVITE("sans_activite", "sans activité"),
        AUTRE("autre", "autre");

        public final String jsonValue;
        public final String formValue;

        SituationEnfant(String jsonValue, String formValue) {
            this.jsonValue = jsonValue;
            this.formValue = formValue;
        }
    }

    public static class SituationEnfantDeserializer extends JsonDeserializer<SituationEnfant> {

        @Override
        public SituationEnfant deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (SituationEnfant situation : SituationEnfant.values()) {
                if (situation.jsonValue.equals(jp.getText())) {
                    return situation;
                }
            }

            throw new RuntimeException(String.format("Situation inconnue d'une personne à charge : %s", jp.getText()));
        }
    }

    @JsonDeserialize(using = LienParenteDeserializer.class)
    public static enum LienParente {

        FILS("fils", "fils"),
        NEVEU("neveu", "neveu"),
        AUCUN("aucun", "aucun"),
        AUTRE("autre", "autre");

        public final String jsonValue;
        public final String formValue;

        LienParente(String jsonValue, String formValue) {
            this.jsonValue = jsonValue;
            this.formValue = formValue;
        }
    }

    public static class LienParenteDeserializer extends JsonDeserializer<LienParente> {

        @Override
        public LienParente deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            for (LienParente lien : LienParente.values()) {
                if (lien.jsonValue.equals(jp.getText())) {
                    return lien;
                }
            }

            throw new RuntimeException(String.format("Lien de parenté d'une personne à charge inconnue : %s", jp.getText()));
        }
    }

    public static class SituationPro {

        public SituationProType situation;
        public String since;
        public Boolean volontairementSansActivite;
        public SalarieContractType contractType;
        public Boolean isRemunere;
        public String gerantSalarieAffiliation;
        public Boolean isIndemnise;
        public String indemniseSince;
    }

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
